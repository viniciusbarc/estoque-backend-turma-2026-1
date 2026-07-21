import type { FastifyRequest, FastifyReply } from "fastify";
import Database from "better-sqlite3";


export class CreateProductInputController {
    public async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
        const { productOrderId, inputQuantity, inputDate } = request.body as { productOrderId: string; inputQuantity: number; inputDate: string; };

        if (!productOrderId) {
            return response.status(400).send({ error: "Product order ID is required" });
        }

        if (!inputQuantity || inputQuantity <= 0) {
            return response.status(400).send({ error: "Input quantity must be a positive number" });
        }

        if (!inputDate) {
            return response.status(400).send({ error: "Input date is required" });
        }

        const newInputDate = new Date(inputDate);
        if (isNaN(newInputDate.getTime())) {
            return response.status(400).send({ error: "Invalid input date format" });
        }
        
        try {
            const connection = new Database("db/estoque.sqlite");

            const statement = connection.prepare("SELECT * FROM product_orders WHERE id = ?");
            const productOrder = statement.get(productOrderId) as { id: string; product_barcode: string; order_quantity: number; order_date: string, status: string } | undefined;
            if (!productOrder) {
                return response.status(404).send({ error: "Product order not found" });
            }

            if (productOrder.status !== "opened") {
                return response.status(400).send({ error: "Product order is not in opened status" });
            }

            const orderDate = new Date(productOrder.order_date);

            if (orderDate > newInputDate) {
                return response.status(400).send({ error: "Input date cannot be before the product order date" });
            }

            const getProductStatement = connection.prepare("SELECT * FROM products WHERE barcode = ?");
            const product = getProductStatement.get(productOrder.product_barcode) as { barcode: string; name: string; quantity_in_stock: number } | undefined;
            if (!product) {
                return response.status(404).send({ error: "Product not found" });
            }

            const uuid = crypto.randomUUID();

            const insertStatement = connection.prepare("INSERT INTO product_inputs (id, product_order_id, input_quantity, input_date) VALUES (?, ?, ?, ?)");
            insertStatement.run(uuid, productOrderId, inputQuantity, newInputDate.toISOString());

            const updateProductOrderStatement = connection.prepare("UPDATE product_orders SET status = ? WHERE id = ?");
            updateProductOrderStatement.run("closed", productOrderId);

            const newStock = product.quantity_in_stock + inputQuantity;

            const updateProductStatement = connection.prepare("UPDATE products SET quantity_in_stock = ? WHERE barcode = ?");
            updateProductStatement.run(newStock, productOrder.product_barcode);

            return response.status(201).send({ 
                id: uuid,
                inputQuantity: inputQuantity,
                inputDate: newInputDate.toISOString(),
                productOrder: {
                    id: productOrderId,
                    orderDate: productOrder.order_date,
                    status: "closed",
                    product: {
                        barcode: product.barcode,
                        name: product.name,
                        quantityInStock: newStock
                    }
                }
                
               
             });


        } catch (Newerror) {
            return response.status(500).send({ error: Newerror });
        }
    }
}