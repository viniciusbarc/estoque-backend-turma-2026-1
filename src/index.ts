import readlineSync from "readline-sync";
import { Product } from "./entities/Product";
import { SqliteConnection } from "./repositories/SqliteConnection";
import { ProductRepository } from "./repositories/ProductRepository";
import { InfrastructureError } from "./InfrastructureError";
import { CreateProductUsecase } from "./usecases/CreateProductUsecase";

const sqliteConnection = new SqliteConnection("db/estoque.sqlite");
const productRepository = new ProductRepository(sqliteConnection);
const createProductUsecase = new CreateProductUsecase(productRepository);

const barcode = readlineSync.question("Enter the product barcode: ");
const name = readlineSync.question("Enter the product name: ");

const product = createProductUsecase.execute(barcode, name);

if (product instanceof InfrastructureError) {
    console.log("Internal error 500 creating product:", product.message);
} else if (product instanceof Error) {
    console.log("Error creating product:", product.message);
} else {
    console.log("Product created successfully:");
    console.log("Barcode: ", product.barcode);
    console.log("Name: ", product.name);
    console.log("Quantity in Stock: ", product.quantityInStock);
}
