-- CIMS DATABASE SCHEMA
-- This script sets up the database structure and populates it with initial mock data.

-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Table: users
-- Stores user account information.
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: categories
-- Stores item categories.
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    capacity INT DEFAULT 0
);

-- Table: items
-- Stores all inventory items.
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    status ENUM('In Stock', 'Low Stock', 'Out of Stock') NOT NULL,
    sku VARCHAR(100) UNIQUE,
    dimensions VARCHAR(100),
    weight VARCHAR(50),
    manufacturer VARCHAR(100),
    location VARCHAR(255),
    date_added DATE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Table: orders
-- Stores customer order information.
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Processing', 'Shipped', 'Delivered', 'Cancelled') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: order_items
-- A linking table between orders and items.
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50),
    item_id INT,
    quantity INT NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- Table: activity_logs
-- Stores a log of all actions performed in the system.
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    category ENUM('inventory', 'order', 'user', 'system') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


-- POPULATE DATABASE WITH MOCK DATA

-- Insert users
-- Note: In a real application, passwords should be securely hashed.
INSERT INTO users (id, username, password_hash, name, email, role, avatar) VALUES
(1, 'admin', 'admin123', 'Admin', 'admin@inventory.com', 'Administrator', 'https://ui-avatars.com/api/?name=Admin&background=0061ff&color=fff'),
(2, 'manager', 'manager123', 'Inventory Manager', 'manager@inventory.com', 'Manager', 'https://ui-avatars.com/api/?name=Inventory+Manager&background=0061ff&color=fff'),
(3, 'johndoe', 'password', 'John Doe', 'john.doe@example.com', 'Staff', NULL),
(4, 'janesmith', 'password', 'Jane Smith', 'jane.smith@example.com', 'Staff', NULL),
(5, 'markjohnson', 'password', 'Mark Johnson', 'mark.johnson@example.com', 'Staff', NULL);


-- Insert categories
INSERT INTO categories (id, name, capacity) VALUES
(1, 'Furniture', 50),
(2, 'Electronics', 60),
(3, 'Stationery', 200),
(4, 'Accessories', 100),
(5, 'Lighting', 40);

-- Insert items
INSERT INTO items (id, name, category_id, price, stock, status, sku, date_added, description, dimensions, weight, manufacturer, location) VALUES
(1, 'Ergonomic Office Chair', 1, 4999.99, 42, 'In Stock', 'FURN-CH-001', '2023-05-15', 'Ergonomic office chair with adjustable height and lumbar support', '60 x 65 x 95 cm', '12.5 kg', 'ErgoDesigns', 'Warehouse A, Aisle 3, Shelf 2'),
(2, 'Wireless Mechanical Keyboard', 2, 2499.95, 15, 'In Stock', 'ELEC-KB-002', '2023-06-01', NULL, NULL, NULL, NULL, NULL),
(3, '27-inch 4K Monitor', 2, 15999.99, 8, 'Low Stock', 'ELEC-MON-001', '2023-06-10', NULL, NULL, NULL, NULL, NULL),
(4, 'A4 Notebook Bundle (5pcs)', 3, 250.00, 120, 'In Stock', 'STAT-NB-001', '2023-07-20', NULL, NULL, NULL, NULL, NULL),
(5, 'Gel Pen Set (12 colors)', 3, 180.00, 0, 'Out of Stock', 'STAT-PEN-005', '2023-07-20', NULL, NULL, NULL, NULL, NULL),
(6, 'USB-C Hub', 4, 1200.00, 35, 'In Stock', 'ACC-HUB-003', '2023-08-01', NULL, NULL, NULL, NULL, NULL),
(7, 'LED Desk Lamp', 5, 850.00, 3, 'Low Stock', 'LGT-LAMP-001', '2023-08-05', NULL, NULL, NULL, NULL, NULL);

-- Insert orders
INSERT INTO orders (id, customer_name, order_date, total_amount, status) VALUES
('ORD-001', 'Angelika Rain', '2023-10-15', 13000.50, 'Processing'),
('ORD-002', 'John Doe', '2023-10-14', 5500.00, 'Delivered'),
('ORD-003', 'Jane Smith', '2023-10-14', 8900.00, 'Shipped'),
('ORD-004', 'Acme Corp', '2023-10-13', 25000.00, 'Processing'),
('ORD-005', 'Peter Jones', '2023-10-12', 500.00, 'Cancelled');

-- Insert order_items
-- For ORD-001
INSERT INTO order_items (order_id, item_id, quantity, price_per_unit) VALUES
('ORD-001', 1, 2, 4999.99),
('ORD-001', 2, 1, 2499.95);
-- For ORD-002
INSERT INTO order_items (order_id, item_id, quantity, price_per_unit) VALUES
('ORD-002', 2, 1, 2499.95),
('ORD-002', 7, 1, 850.00);
-- For ORD-003
INSERT INTO order_items (order_id, item_id, quantity, price_per_unit) VALUES
('ORD-003', 4, 10, 250.00),
('ORD-003', 6, 2, 1200.00);


-- Insert activity_logs
INSERT INTO activity_logs (timestamp, user_id, action, details, category) VALUES
('2023-08-15 09:23:45', 3, 'Stock Update', 'Added 50 units of Office Chair', 'inventory'),
('2023-08-15 10:45:12', 4, 'Order Placed', 'Order #ORD-2023-089 created', 'order'),
('2023-08-14 15:32:08', 1, 'User Login', 'Admin logged in from 192.168.1.45', 'user'),
('2023-08-14 11:05:30', 3, 'Item Added', 'New item "Wireless Mouse" added to inventory', 'inventory'),
('2023-08-13 16:47:21', 4, 'Order Fulfilled', 'Order #ORD-2023-075 marked as fulfilled', 'order'),
('2023-08-13 09:15:42', 5, 'Stock Update', 'Removed 15 units of Desk Lamp', 'inventory'),
('2023-08-12 14:32:10', 1, 'Settings Change', 'System notification settings updated', 'system'),
('2023-08-12 10:05:38', 3, 'Item Edited', 'Updated price for "Ergonomic Desk"', 'inventory'),
('2023-08-11 15:45:22', 4, 'Order Canceled', 'Order #ORD-2023-062 canceled - customer request', 'order'),
('2023-08-11 09:30:15', 5, 'User Profile Update', 'Updated contact information', 'user'),
('2023-08-10 16:22:48', 1, 'Item Deleted', 'Removed "Obsolete Product" from inventory', 'inventory'),
('2023-08-10 11:18:33', 3, 'Order Placed', 'Order #ORD-2023-058 created', 'order'),
('2023-08-09 14:55:27', 4, 'User Login', 'Jane logged in from 192.168.1.87', 'user'),
('2023-08-09 10:12:19', 5, 'Stock Update', 'Added 100 units of Printer Paper', 'inventory'),
('2023-08-08 15:30:05', 1, 'System Backup', 'Scheduled backup completed successfully', 'system');
