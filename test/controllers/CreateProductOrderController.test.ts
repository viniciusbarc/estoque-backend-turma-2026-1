import { CreateProductOrderController } from "../../src/controllers/CreateProductOrderController";
import { InfrastructureError } from "../../src/InfrastructureError";
import type { CreateProductOrderDTO } from "../../src/usecases/CreateProductOrderUsecase";

describe('Testing CreateProductOrderController', () => {

    test('should create a product order successfully', async () => {
        const requestMock: any = {
            body: {
                barcode: '123456',
                orderQuantity: 10,
                orderDate: '2026-06-20T10:00:00Z'
            }
        };

        const responseMock: any = {
            statusCode: 0,
            data: null,
            status(code: number) {
                this.statusCode = code;
                return this;
            },
            send(data: any) {
                this.data = data;
                return this;
            }
        };

        class CreateProductOrderUseCaseMock {
            execute(barcode: string, orderQuantity: number, orderDate: Date): CreateProductOrderDTO | Error {
                return { 
                    id: "random-uuid", 
                    productBarcode: "123456", 
                    orderQuantity: 10, 
                    orderDate: new Date('2026-06-20T10:00:00Z')
                };
            }
        }

        const createProductOrderUseCaseMock = new CreateProductOrderUseCaseMock() as any;
        const createProductOrderController = new CreateProductOrderController(createProductOrderUseCaseMock);

        await createProductOrderController.handle(requestMock, responseMock);

        expect(responseMock.statusCode).toBe(201);
        expect(responseMock.data).toEqual({ 
            id: "random-uuid", 
            productBarcode: "123456", 
            orderQuantity: 10, 
            orderDate: new Date('2026-06-20T10:00:00Z')
        });
    });

    test('should return an error 400 if the body is not present', async () => {
        const requestMock: any = {};

        const responseMock: any = {
            statusCode: 0,
            data: null,
            status(code: number) {
                this.statusCode = code;
                return this;
            },
            send(data: any) {
                this.data = data;
                return this;
            }
        };

        class CreateProductOrderUseCaseMock {
            execute(barcode: string, orderQuantity: number, orderDate: Date): CreateProductOrderDTO | Error {
                return { id: "123", productBarcode: "123456", orderQuantity: 10, orderDate: new Date() };
            }
        }

        const createProductOrderUseCaseMock = new CreateProductOrderUseCaseMock() as any;
        const createProductOrderController = new CreateProductOrderController(createProductOrderUseCaseMock);

        await createProductOrderController.handle(requestMock, responseMock);

        expect(responseMock.statusCode).toBe(400);
        expect(responseMock.data).toEqual({ error: "Invalid request body" });
    });

    test('should return an error 500 if receive an InfrastructureError from usecase', async () => {
        const requestMock: any = {
            body: {
                barcode: '123456',
                orderQuantity: 10,
                orderDate: '2026-06-20T10:00:00Z'
            }
        };

        const responseMock: any = {
            statusCode: 0,
            data: null,
            status(code: number) {
                this.statusCode = code;
                return this;
            },
            send(data: any) {
                this.data = data;
                return this;
            }
        };

        class CreateProductOrderUseCaseMock {
            execute(barcode: string, orderQuantity: number, orderDate: Date): CreateProductOrderDTO | Error {
                return new InfrastructureError("Database connection failed");
            }
        }

        const createProductOrderUseCaseMock = new CreateProductOrderUseCaseMock() as any;
        const createProductOrderController = new CreateProductOrderController(createProductOrderUseCaseMock);

        await createProductOrderController.handle(requestMock, responseMock);

        expect(responseMock.statusCode).toBe(500);
        expect(responseMock.data).toEqual({ error: "Database connection failed" });
    });

    test('should return an error 400 if receive an Error from usecase', async () => {
        const requestMock: any = {
            body: {
                barcode: '123456',
                orderQuantity: -5,
                orderDate: '2026-06-20T10:00:00Z'
            }
        };

        const responseMock: any = {
            statusCode: 0,
            data: null,
            status(code: number) {
                this.statusCode = code;
                return this;
            },
            send(data: any) {
                this.data = data;
                return this;
            }
        };

        class CreateProductOrderUseCaseMock {
            execute(barcode: string, orderQuantity: number, orderDate: Date): CreateProductOrderDTO | Error {
                return new Error("A quantidade do pedido deve ser maior que zero.");
            }
        }

        const createProductOrderUseCaseMock = new CreateProductOrderUseCaseMock() as any;
        const createProductOrderController = new CreateProductOrderController(createProductOrderUseCaseMock);

        await createProductOrderController.handle(requestMock, responseMock);

        expect(responseMock.statusCode).toBe(400);
        expect(responseMock.data).toEqual({ error: "A quantidade do pedido deve ser maior que zero." });
    });
});