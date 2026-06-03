import { Product } from "../entities/Product";
import { InfrastructureError } from "../InfrastructureError";
import type { ProductRepository, ProductRepositoryInterface } from "../repositories/ProductRepository";

export interface CreateProductDTO {
    barcode: string;
    name: string;
    quantityInStock: number;
}

export class CreateProductUsecase {

    private productRepository: ProductRepositoryInterface;

    constructor(productRepository: ProductRepositoryInterface) {
        this.productRepository = productRepository;
    }

    execute(barcode: string, name: string): CreateProductDTO | Error {
        const result = this.productRepository.findByBarcode(barcode);
        if (result instanceof InfrastructureError) {
            return result;
        }
        if (result instanceof Product) {
            return new Error("Product with the same barcode already exists");
        }
        const newProduct = Product.create(barcode, name);
        if (newProduct instanceof Error) {
            return newProduct;
        }
        const createResult = this.productRepository.create(newProduct);
        if (createResult instanceof InfrastructureError) {
            return createResult;
        } else {
            return {
                barcode: newProduct.getBarcode(),
                name: newProduct.getName(),
                quantityInStock: newProduct.getQuantityInStock()
            };
        }
    }
}