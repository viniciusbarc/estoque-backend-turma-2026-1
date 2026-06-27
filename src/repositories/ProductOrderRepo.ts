import { ProductOrder } from '../entities/ProductOrder';
import { InfrastructureError } from '../InfrastructureError';

export interface ProductOrderRepositoryInterface {
    create(productOrder: ProductOrder): ProductOrder | InfrastructureError;
}

export class ProductOrderRepository implements ProductOrderRepositoryInterface {
    private connection: any;

    constructor(sqliteConnection: any) {
        // Intercepta a propriedade interna de conexão contida no SqliteConnection
        this.connection = sqliteConnection.db || sqliteConnection;
    }

    create(productOrder: ProductOrder): ProductOrder | InfrastructureError {
        try {
            const stmt = this.connection.prepare(`
                INSERT INTO product_orders (id, product_barcode, order_quantity, order_date)
                VALUES (?, ?, ?, ?)
            `);

            stmt.run(
                productOrder.getId(),
                productOrder.getProduct().getBarcode(),
                productOrder.getOrderQuantity(),
                productOrder.formatOrderDate()
            );

            return productOrder;
        } catch (error: any) {
            console.error("Erro ao inserir ordem no banco:", error);
            return new InfrastructureError("Erro ao salvar a ordem de produto no banco de dados.");
        }
    }
}