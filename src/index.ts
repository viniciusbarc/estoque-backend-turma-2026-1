import fastify from "fastify";
import { Product } from "./entities/Product";
import { SqliteConnection } from "./repositories/SqliteConnection";
import { ProductRepository } from "./repositories/ProductRepository";
import { InfrastructureError } from "./InfrastructureError";
import { CreateProductUsecase } from "./usecases/CreateProductUsecase";
import { CreateProductController } from "./controllers/CreateProductController";

const sqliteConnection = new SqliteConnection("db/estoque.sqlite");
const productRepository = new ProductRepository(sqliteConnection);
const createProductUsecase = new CreateProductUsecase(productRepository);
const createProductController = new CreateProductController(createProductUsecase);

const app = fastify();

app.post("/products", async (request, reply) => { await createProductController.handle(request, reply); });

app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error("Error starting server:", err);
        process.exit(1);
    }
    console.log(`Server is running at ${address}`);
});