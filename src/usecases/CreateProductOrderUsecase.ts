import { Product } from "../entities/Product";
import { ProductOrder } from "../entities/ProductOrder";
import { InfrastructureError } from "../InfrastructureError";
import type { ProductRepositoryInterface } from "../repositories/ProductRepository";
import type { ProductOrderRepositoryInterface } from "../repositories/ProductOrderRepository";

export interface CreateProductOrderDTO {
    id: string;
    productBarcode: string;
    orderQuantity: number;
    orderDate: Date;
}

export class CreateProductOrderUsecase {

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
            productBarcode: productOrder.getProduct().getBarcode(),
            orderQuantity: productOrder.getOrderQuantity(),
            orderDate: productOrder.getOrderDate()
        };
    }
}
