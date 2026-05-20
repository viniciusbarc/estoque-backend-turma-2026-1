import Database from "better-sqlite3";
import { Product } from "../entities/Product";
import { InfrastructureError } from "../InfrastructureError";
import type { SqliteConnection } from "./SqliteConnection";

export class ProductRepository {

    private sqliteConnection: SqliteConnection;

    constructor(connection: SqliteConnection) {
        this.sqliteConnection = connection;
    }

    public create(product: Product): void | InfrastructureError {
        try {
            const connection: Database.Database = this.sqliteConnection.getConnection();
            const insertStatement = connection.prepare(
                "INSERT INTO products (barcode, name, quantity_in_stock) VALUES (?, ?, ?)"
            );
            insertStatement.run(product.getBarcode(), product.getName(), 
                product.getQuantityInStock());
        } catch (error) {
            return new InfrastructureError("Failed to create product");
        }
    }

}
