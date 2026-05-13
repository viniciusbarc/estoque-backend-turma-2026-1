import readlineSync from "readline-sync";
import { Product } from "./entities/Product";

const barcode = readlineSync.question("Enter the product barcode: ");
const name = readlineSync.question("Enter the product name: ");

const product = Product.create(barcode, name);

if (product instanceof Error) {
    console.log("Error creating product:", product.message);
} else {
    console.log("Product created successfully:");
    console.log("Barcode: ", product.getBarcode());
    console.log("Name: ", product.getName());
    console.log("Quantity in Stock: ", product.getQuantityInStock());
}