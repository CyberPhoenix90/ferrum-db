using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading;
using System.Threading.Tasks;
using ferrum_io_engine;

namespace ferrum_collection_engine;


public class Collection
{
        const uint MIN_PAGE_SIZE = 1024 * 1024 * 16;
        const uint DEFAULT_PAGE_SIZE = 1024 * 1024 * 64;
        const uint MAX_PAGE_FILE_PER_FOLDER = 10000;
        private readonly IOEngine io;
        private readonly string folder;
        private readonly uint pageSize;
        private Dictionary<uint, PageFile> pageFiles;
        private uint activePageFile;
        private uint nextPageFile;
        public ReaderWriterLockSlim writeLock = new ReaderWriterLockSlim();

        public Collection(IOEngine io, string folder, string encoding, uint? pageSize)
        {
                if (pageSize < MIN_PAGE_SIZE)
                {
                        throw new Exception("Page size must be at least 16MB to avoid excessive fragmentation");
                }

                this.io = io;
                this.folder = folder;
                this.pageSize = pageSize ?? DEFAULT_PAGE_SIZE;
                this.pageFiles = [];
                this.activePageFile = 0;
                this.nextPageFile = 0;
        }

        public void initialize()
        {
                if (!this.io.exists(this.folder))
                {
                        this.io.mkdir(this.folder);
                        return;
                }

                loadPageFiles();
        }

        private void loadPageFiles()
        {
                foreach (var file in this.io.iterateFilesRecursively(this.folder))
                {
                        uint index = this.getPageFileIndexFromPath(file.Substring(this.folder.Length));
                        if (index >= this.nextPageFile)
                        {
                                this.nextPageFile = index + 1;
                                // We want to use the highest page file index as the active page file
                                this.activePageFile = index;
                        }
                        var pageFile = new PageFile(index, this.io.getFileSize(file));
                        this.pageFiles[index] = pageFile;
                }
        }

        private string pageFileIndexToPath(uint index)
        {
                // We group page files in folders of 0 to 9999 page files to avoid having too many files in a single folder which can break some file systems
                var folder = (index / 10000).ToString();
                var file = (index % 10000).ToString();
                return this.folder + "/" + folder + "/" + file;
        }

        private uint getPageFileIndexFromPath(string path)
        {
                var parts = path.Split("/");
                if (parts.Count() > 2)
                {
                        throw new Exception("Invalid page file path");
                }

                var folder = parts[0];
                var file = parts[1];

                return uint.Parse(folder) * 10000 + uint.Parse(file);
        }

        private uint newBlankPageFile()
        {
                var index = this.nextPageFile;
                var pageFile = new PageFile(index);
                this.io.writeFile(this.pageFileIndexToPath(index), []);
                this.pageFiles[index] = pageFile;
                this.nextPageFile++;
                return index;
        }
}
