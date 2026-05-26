import { ProductOrder } from "../../src/entities/ProductOrder";
import { Product } from "../../src/entities/Product";

describe("testing ProductOrder entity", () => {
  test("should create a product order with valid properties", () => {
    const product = Product.create("1234567890123", "Biscoito Recheado");
    const orderQuantity: number = 10;
    const orderDate: Date = new Date();

    const productOrder = ProductOrder.create(product, orderQuantity, orderDate);

    expect(productOrder).toBeInstanceOf(ProductOrder);

    if (productOrder instanceof ProductOrder) {
      expect(productOrder.getId()).toBeDefined();
      expect(productOrder.getProduct()).toBe(product);
      expect(productOrder.getOrderQuantity()).toBe(orderQuantity);
      expect(productOrder.getOrderDate()).toBe(
        ProductOrder.formatOrderDate(orderDate),
      );
    }
  });

  test("should return error when order quantity is less than or equal to zero", () => {
    const product = Product.create("1234567890123", "Biscoito Recheado");
    const orderQuantity: number = 0;
    const orderDate: Date = new Date();

    const productOrder = ProductOrder.create(product, orderQuantity, orderDate);

    expect(productOrder).toBeInstanceOf(Error);
  });

  test("should return error when order quantity is not a valid number", () => {
    const product = Product.create("1234567890123", "Biscoito Recheado");
    const orderQuantity: any = "ten";
    const orderDate: Date = new Date();
    const productOrder = ProductOrder.create(product, orderQuantity, orderDate);

    expect(productOrder).toBeInstanceOf(Error);
  });

  test("should return error when order quantity is not an integer", () => {
    const product = Product.create("1234567890123", "Biscoito Recheado");
    const orderQuantity: any = 10.5;
    const orderDate: Date = new Date();
    const productOrder = ProductOrder.create(product, orderQuantity, orderDate);
    expect(productOrder).toBeInstanceOf(Error);
  });

  test("should return error when order date is in the future", () => {
    const product = Product.create("1234567890123", "Biscoito Recheado");
    const orderQuantity: number = 10;
    const orderDate: Date = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const productOrder = ProductOrder.create(product, orderQuantity, orderDate);

    expect(productOrder).toBeInstanceOf(Error);
  });

  test("should return error when product is not provided", () => {
    const orderQuantity: number = 10;
    const orderDate: Date = new Date();
    const product = null;
    const productOrder = ProductOrder.create(product, orderQuantity, orderDate);

    expect(productOrder).toBeInstanceOf(Error);
  });
});
