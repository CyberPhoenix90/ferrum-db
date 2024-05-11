using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace ferrum_io_engine;

public class IOEngine
{

    public bool exists(string path)
    {
        return File.Exists(path);
    }

    public DirectoryInfo mkdir(string path)
    {
        return Directory.CreateDirectory(path);
    }

    public string[] getFiles(string path)
    {
        return Directory.GetFiles(path);
    }

    public string[] getDirectories(string path)
    {
        return Directory.GetDirectories(path);
    }

    public FileStream openFile(string folder)
    {
        return File.Open(folder, FileMode.OpenOrCreate);
    }

    public void writeFile(string path, byte[] bytes, bool createDirectory = false)
    {
        if (createDirectory)
        {
            var folder = Path.GetDirectoryName(path);
            if (folder != null)
            {
                this.mkdir(folder);
            }
        }

        File.WriteAllBytes(path, bytes);
    }

    public IEnumerable<string> iterateFilesRecursively(string path)
    {
        return Directory.EnumerateFiles(path, "*", SearchOption.AllDirectories);
    }

    public void deleteDirectory(string folder)
    {
        Directory.Delete(folder, true);
    }

    public long getFileSize(string file)
    {
        return new FileInfo(file).Length;
    }
}