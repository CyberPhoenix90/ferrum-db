using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using ferrum_collection_engine;
using ferrum_io_engine;

namespace ferrum_db_engine;

public class Database
{
    private string folder;
    private string name;
    private IOEngine io;
    private Dictionary<string, Collection> collections;

    public static int Version = 0;

    public Database(string folder, string name, IOEngine io)
    {
        this.folder = folder;
        this.name = name;
        this.io = io;
        this.collections = [];
    }

    public void initializeDatabase()
    {
        if (!this.io.exists(Path.Join(this.folder, "ferrum.db")))
        {
            if (!this.io.exists(this.folder))
            {
                this.io.mkdir(this.folder);
            }

            this.io.writeFile(Path.Join(this.folder, "ferrum.db"), [
                            ..(BitConverter.GetBytes(Database.Version))
            ]);
        }
        else
        {
            using (BinaryReader reader = new BinaryReader(this.io.openFile(Path.Join(this.folder, "ferrum.db"))))
            {
                var version = reader.ReadInt32();
                if (version != Database.Version)
                {
                    throw new Exception("Unsupported database version");
                }
            }
        }

    }

    public void dispose()
    {
        io.deleteDirectory(this.folder);
    }
}
