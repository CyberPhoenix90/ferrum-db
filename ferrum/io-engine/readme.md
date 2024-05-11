The IO Engine is an abstraction layer for IO, for folder operations it's simply a passthrough for the .net basic file api but for file reads and writes it has a cache layer as well as automatic locking and offers atomic operations.

This means that all reads occur from cache when possible and in parallel. In case of writes they are queued on a per file basis and executed in order but parallel in case of different files.
The IO Engine also has atomic operations for file writing which is achived by copying the file to a temporary file and then renaming it to the original file name. This means that the file is never in an inconsistent state at the cost of a performance hit proportional to the file size.
It also supports multi file writes that lock multiple files and then write to them in parallel.

The IO Engine also abstracts away the file system so that it can be used with any file system that implements the IIOEngine interface. This is used for the in memory IO Engine which is used for testing and for the collection engine which uses it to store the collections in memory.

Lastly the IO Engine also automatically handles opening and closing files as well as flushing to disk to balance the performance and memory usage as well as minimize the risk of data loss.
