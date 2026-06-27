import { InfrastructureError } from '../InfrastructureError';
import { CreateProductOrderUsecase } from '../usecases/CreateProductOrderUsecase';

export class CreateProductOrderController {
    
    constructor(private createProductOrderUsecase: CreateProductOrderUsecase) {}

    async handle(request: any, reply: any) {
        try {
            // Validação do corpo da requisição exigida nos testes
            if (!request.body) {
                return reply.status(400).send({ error: "Invalid request body" });
            }

            const { barcode, orderQuantity, orderDate } = request.body;
            const parsedDate = new Date(orderDate);

            const result = this.createProductOrderUsecase.execute(barcode, orderQuantity, parsedDate);

            // Tratamento de erro de infraestrutura do banco de dados (Status 500)
            if (result instanceof InfrastructureError) {
                return reply.status(500).send({ error: result.message });
            }

            // Tratamento de erros de regra de negócio (Status 400)
            if (result instanceof Error) {
                return reply.status(400).send({ error: result.message });
            }

            // Sucesso na criação do recurso (Status 201)
            return reply.status(201).send(result);
        } catch (error: any) {
            return reply.status(500).send({ error: "Internal server error" });
        }
    }
}