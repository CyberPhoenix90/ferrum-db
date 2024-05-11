The master record (mr) file contain information about all the databases

Binary structure:
int: Version

repeated until eof:
byte: Database status (0: deleted, 1: active)
int7 base string: Database name

Each database has a .db file that contains the database metadata

Binary structure:
int: Version

repeated until eof:
byte: Collection type (0: string, 1: number, 2: event channel, 3: event queue)
byte: Collection encoding (0: void, 1:binary, 2: text, 3: integer, 4: decimal, 5: json, 6: ndjson)
byte: Collection compression
int7 base string: Collection name

if string or number or event queue
byte: Persistence (0: persistent, 1: volatile)

if event queue collection:
uint: read limit
uint: max size
