Collections are made of a records.index file and page files
The records file is a list of record ids and their offsets in the page files
The page files are a list of records

Binary structure:
records.index
int: Version
byte: Collection type (0: string, 1: number)
uint: page size
byte: Records Staging mode (0: no staging, >1: staging transaction ID) Staging mode that applies to all records in the collection. This can be done because collections can only be written to by a single transaction at a time
int7 base string: Collection name
byte: Collection encoding (0: void, 1:binary, 2: text, 3: integer, 4: decimal, 5: json, 6: ndjson)
byte: Collection compression
byte: Persistence (0: persistent, 1: volatile)
long: max records
byte: Eviction policy (0: none, 1: lru, 2: lfu)

repeated until eof:

byte: State (0: active, 1: deleted)
uint: Record page file
uint: Record offset in page file
For string collections:
int7 base string: Record key
For number collections:
long: Record key

page files have the following structure:
int: Version
repeated until eof:
byte: Record status (0: deleted, 1: active, 2: staged)
ulong: Record location in records.index
ulong: Used record size
ulong: Record size
byte[]: Record data
