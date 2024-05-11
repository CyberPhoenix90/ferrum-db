Transactions work by creating a change log file for the records. When the transaction is committed, the log is used to apply the changes one by one. If the transaction is interrupted like a power failure, the log is used to complete the interrupted transaction.
Transactions that start committing can not be rolled back. A transaction that is about to commit starts by locking all involved collections. Multiple transactions can commit in parallel as long as they don't involve the same collections. If a transaction is interrupted before
the commit phase it is discarded.
The first byte of the change log file represents the transaction status (0: active, 1: committed). The rest of the file is a list of changes to be applied to the records. The changes are in the following format:
byte: Change type (0: delete, 1: write, 2: continuation) // continuation means that append was called on the record
int7 base string: Database name
int7 base string: Collection name
if string collection:
int7 base string: Key name
if number collection:
long: Key
ulong: data size
byte[]: Record data

This can lead to changes being applied twice but this is not a problem because the changes are idempotent. The change log file is deleted after the transaction is committed.
