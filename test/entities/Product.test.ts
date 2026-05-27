import { Product } from "../../src/entities/Product";

describe("testing Product entity", () => {

    test("should create a product with valid properties", () => {
        const barcode: string = "1234567890123";
        const name: string = "Coca Cola 2L";

        const product = Product.create(barcode, name);

        expect(product).toBeInstanceOf(Product);

        if (product instanceof Product) {
            expect(product.getBarcode()).toBe(barcode);
            expect(product.getName()).toBe(name);
            expect(product.getQuantityInStock()).toBe(0);
        }
    });

    test("should return an error when creating a product with invalid barcode", () => {

        const barcode: string = "";
        const name: string = "Coca Cola 2L";
        const product = Product.create(barcode, name);
        expect(product).toBeInstanceOf(Error);

        const barcode2: string = "       ";
        const product2 = Product.create(barcode2, name);
        expect(product2).toBeInstanceOf(Error);

    });

    test("should return an error when creating a product with invalid name", () => {

        const barcode: string = "35235235235";
        const name: string = "";
        const product = Product.create(barcode, name);
        expect(product).toBeInstanceOf(Error);

        const name2: string = "       ";
        const product2 = Product.create(barcode, name2);
        expect(product2).toBeInstanceOf(Error);

    });

    test("should rebuild a product with valid properties", () => {
        const barcode: string = "1234567890123";
        const name: string = "Coca Cola 2L";
        const quantityInStock: number = 100;

        const product = Product.rebuild(barcode, name, quantityInStock);

        expect(product).toBeInstanceOf(Product);

        if (product instanceof Product) {
            expect(product.getBarcode()).toBe(barcode);
            expect(product.getName()).toBe(name);
            expect(product.getQuantityInStock()).toBe(quantityInStock);
        }
    });


});