import { Product } from "./Product";

export class ProductOrder{
    private id: string;
    private product: Product;
    private orderQuantity: number;
    private orderDate: string;

    private constructor(id: string, product: Product, orderQuantity: number, orderDate: string){
        this.id = id;
        this.product = product;
        this.orderQuantity = orderQuantity;
        this.orderDate = orderDate;
    }

    public static create(product: Product, orderQuantity: number, orderDate: Date): ProductOrder | Error{
        if(orderQuantity <= 0){
            return new Error("A quantidade do pedido deve ser maior que zero.");
        }

        if(typeof orderQuantity !== 'number' || isNaN(orderQuantity)){
            return new Error("A quantidade do pedido deve ser um número válido.");
        }

        if(this.isInteger(orderQuantity) === false){
            return new Error("A quantidade do pedido deve ser um número inteiro.");
        }

        if(orderDate > new Date()){
            return new Error("A data do pedido não pode ser no futuro.");
        }

        if(!product){
            return new Error("O produto do pedido é obrigatório.");
        }

        return new ProductOrder(
            crypto.randomUUID(),
            product,
            orderQuantity,
            this.formatOrderDate(orderDate)
        );
    }

    private static isInteger(value: number): boolean {
        return Number.isInteger(value);
    }
    
    public getId(): string{
        return this.id;
    }

    public getProduct(): Product{
        return this.product;
    }

    public getOrderQuantity(): number{
        return this.orderQuantity;
    }

    public getOrderDate(): string{
        return this.orderDate;
    }

    public static formatOrderDate(orderDate: Date): string{
        return orderDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, 'Z');
    }
}