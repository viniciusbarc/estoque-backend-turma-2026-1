import { Product } from "../entities/Product";
import { ProductOrder } from "../entities/ProductOrder";
import { InfrastructureError } from "../InfrastructureError";
import type { ProductRepositoryInterface } from "../repositories/ProductRepository";
import type { ProductOrderRepositoryInterface } from "../repositories/ProductOrderRepository";

export interface ProductDTO {
    barcode: string;
    name: string;
    quantityInStock: number;
}

export interface CreateProductOrderDTO {
    id: string;
    product: ProductDTO;
    orderQuantity: number;
    orderDate: Date;
    status: string;
}

export interface CreateProductOrderUsecaseInterface {
    execute(barcode: string, orderQuantity: number, orderDate: Date): CreateProductOrderDTO | Error;
}

export class CreateProductOrderUsecase implements CreateProductOrderUsecaseInterface {

    private productRepository: ProductRepositoryInterface;
    private productOrderRepository: ProductOrderRepositoryInterface;

    constructor(
        productRepository: ProductRepositoryInterface,
        productOrderRepository: ProductOrderRepositoryInterface
    ) {
        this.productRepository = productRepository;
        this.productOrderRepository = productOrderRepository;
    }

    execute(barcode: string, orderQuantity: number, orderDate: Date): CreateProductOrderDTO | Error {
        const product = this.productRepository.findByBarcode(barcode);
        if (product instanceof InfrastructureError) {
            return product;
        }
        if (!(product instanceof Product)) {
            return new Error("Product does not exist");
        }

        const productOrder = ProductOrder.create(product, orderQuantity, orderDate);
        if (productOrder instanceof Error) {
            return productOrder;
        }

        const createResult = this.productOrderRepository.create(productOrder);
        if (createResult instanceof InfrastructureError) {
            return createResult;
        }

        return {
            id: productOrder.getId(),
            product: {
                barcode: productOrder.getProduct().getBarcode(),
                name: productOrder.getProduct().getName(),
                quantityInStock: productOrder.getProduct().getQuantityInStock()
            },
            orderQuantity: productOrder.getOrderQuantity(),
            orderDate: productOrder.getOrderDate(),
            status: productOrder.getStatus()
        };
    }
}
