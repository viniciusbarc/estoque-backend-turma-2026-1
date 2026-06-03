import Database from "better-sqlite3";
import { Product } from "../entities/Product";
import { InfrastructureError } from "../InfrastructureError";
import type { SqliteConnection } from "./SqliteConnection";

export interface ProductRepositoryInterface {
    create(product: Product): void | InfrastructureError;
    findByBarcode(barcode: string): Product | null | InfrastructureError;
}

export class ProductRepository implements ProductRepositoryInterface {

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

    public findByBarcode(barcode: string): Product | null | InfrastructureError {
        try {
            const connection: Database.Database = this.sqliteConnection.getConnection();
            const selectStatement = connection.prepare(
                "SELECT * FROM products WHERE barcode = ?"
            );
            const row = selectStatement.get(barcode) as { barcode: string; name: string; quantity_in_stock: number } | undefined;
            if (row) {
                return Product.rebuild(row.barcode, row.name, row.quantity_in_stock);
            } else {
                return null;
            }
        } catch (error) {
            return new InfrastructureError("Failed to find product by barcode");
        }
    }
}
