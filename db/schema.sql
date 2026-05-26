CREATE TABLE products (
    barcode TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    quantity_in_stock INTEGER NOT NULL
);

CREATE TABLE product_orders (
    id TEXT PRIMARY KEY,
    product_barcode TEXT NOT NULL,
    order_quantity INTEGER NOT NULL,
    order_date TEXT NOT NULL,
    FOREIGN KEY (product_barcode) REFERENCES products(barcode)
)