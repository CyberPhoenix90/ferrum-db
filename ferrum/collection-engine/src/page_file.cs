using System;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json.Linq;

namespace ferrum_collection_engine;
class PageFile
{
    // How many bytes of this page file contain data that was deleted
    public long trashBytes;
    // Which page file is this
    public readonly uint index;
    public long cursor;

    public float getThrasRatio(int size)
    {
        return this.trashBytes / size;
    }


    public PageFile(uint index, long cursor = 0)
    {
        this.index = index;
        this.trashBytes = 0;
        this.cursor = cursor;
    }

}
