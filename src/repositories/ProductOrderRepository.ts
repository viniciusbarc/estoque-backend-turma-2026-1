import Database from "better-sqlite3";
import { ProductOrder } from "../entities/ProductOrder";
import { InfrastructureError } from "../InfrastructureError";
import type { SqliteConnection } from "./SqliteConnection";

export interface ProductOrderRepositoryInterface {
    create(productOrder: ProductOrder): void | InfrastructureError;
}

export class ProductOrderRepository implements ProductOrderRepositoryInterface {

    private sqliteConnection: SqliteConnection;

    constructor(connection: SqliteConnection) {
        this.sqliteConnection = connection;
    }

    public create(productOrder: ProductOrder): void | InfrastructureError {
        try {
            const connection: Database.Database = this.sqliteConnection.getConnection();
            const insertStatement = connection.prepare(
                "INSERT INTO product_orders (id, product_barcode, order_quantity, order_date) VALUES (?, ?, ?, ?)"
            );
            insertStatement.run(
                productOrder.getId(),
                productOrder.getProduct().getBarcode(),
                productOrder.getOrderQuantity(),
                productOrder.formatOrderDate()
            );
        } catch (error) {
            return new InfrastructureError("Failed to create product order");
        }
    }
}
