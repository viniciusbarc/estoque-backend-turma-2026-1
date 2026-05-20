import readlineSync from "readline-sync";
import { Product } from "./entities/Product";
import { SqliteConnection } from "./repositories/SqliteConnection";
import { ProductRepository } from "./repositories/ProductRepository";
import { InfrastructureError } from "./InfrastructureError";

const sqliteConnection = new SqliteConnection("db/estoque.sqlite");
const productRepository = new ProductRepository(sqliteConnection);

const barcode = readlineSync.question("Enter the product barcode: ");
const name = readlineSync.question("Enter the product name: ");

const product = Product.create(barcode, name);

if (product instanceof Error) {
    console.log("Error creating product:", product.message);
} else {
    const result = productRepository.create(product);
    if (result instanceof InfrastructureError) {
        console.log("Error saving product to database:", result.message);
    } else {
        console.log("Product created successfully:");
        console.log("Barcode: ", product.getBarcode());
        console.log("Name: ", product.getName());
        console.log("Quantity in Stock: ", product.getQuantityInStock());
    }
}