using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using ferrum_io_engine;

namespace ferrum_collection_engine;

public abstract class Collection {
    public const uint MIN_PAGE_SIZE = 1024 * 1024 * 16;
    public const uint DEFAULT_PAGE_SIZE = 1024 * 1024 * 64;
    public const uint MAX_PAGE_FILE_PER_FOLDER = 10000;
    protected readonly string folder;
    protected readonly IOEngine io;
    public readonly ReaderWriterLockSlim writeLock = new();
    protected uint activePageFile;
    public bool disposed;
    protected uint nextPageFile;
    protected Dictionary<uint, PageFile> pageFiles;
    protected uint pageSize;

    protected Collection(IOEngine io, string folder) {
        this.io = io;
        this.folder = folder;
        pageFiles = [];
        activePageFile = 0;
        nextPageFile = 0;
    }

    public abstract CollectionKeyType GetKeyType();

    protected void LoadPageFiles() {
        foreach (var file in io.iterateFilesRecursively(folder)) {
            var index = GetPageFileIndexFromPath(file.Substring(folder.Length));
            if (index >= nextPageFile) {
                nextPageFile = index + 1;
                // We want to use the highest page file index as the active page file
                activePageFile = index;
            }

            var pageFile = new PageFile(index, io.getFileSize(file));
            pageFiles[index] = pageFile;
        }
    }

    private string PageFileIndexToPath(uint index) {
        // We group page files in folders of 0 to 9999 page files to avoid having too many files in a single folder which can break some file systems
        var folder = (index / 10000).ToString();
        var file = (index % 10000).ToString();
        return this.folder + "/" + folder + "/" + file;
    }

    private uint GetPageFileIndexFromPath(string path) {
        var parts = path.Split("/");
        if (parts.Count() > 2) throw new Exception("Invalid page file path");

        var folder = parts[0];
        var file = parts[1];

        return uint.Parse(folder) * 10000 + uint.Parse(file);
    }

    private uint NewBlankPageFile() {
        var index = nextPageFile;
        var pageFile = new PageFile(index);
        io.writeFile(PageFileIndexToPath(index), []);
        pageFiles[index] = pageFile;
        nextPageFile++;
        return index;
    }

    public void Dispose() {
        if (disposed) throw new Exception("Collection has been disposed");

        try {
            writeLock.EnterWriteLock();
            Directory.Delete(folder, true);
            pageFiles.Clear();
            disposed = true;
        }
        finally {
            writeLock.ExitWriteLock();
        }
    }
}