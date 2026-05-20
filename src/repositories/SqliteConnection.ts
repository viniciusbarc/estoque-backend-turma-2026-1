import Database from "better-sqlite3";

export class SqliteConnection {

    private connection: Database.Database;

    constructor(databasePath: string) {
        this.connection = new Database(databasePath);
    }

    getConnection(): Database.Database {
        return this.connection;
    }
}