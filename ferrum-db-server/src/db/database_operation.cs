namespace ferrum_db_server.db {
    public enum DatabaseOperationType {
        WRITE,
        DELETE
    }

    public enum TargetType {
        SET,
        INDEX
    }


    public class DatabaseOperation {
        public readonly DatabaseOperationType operationType;
        public readonly TargetType targetType;
        public readonly string database;
        public readonly string target;
        public readonly string key;
        public readonly byte[]? newValue;


        public DatabaseOperation(string database, DatabaseOperationType type, TargetType targetType, string target, string key, byte[]? newValue = null) {
            this.database = database;
            this.operationType = type;
            this.targetType = targetType;
            this.target = target;
            this.newValue = newValue;
            this.key = key;
        }
    }
}
