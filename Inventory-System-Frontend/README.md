# CIMS: Customizable Inventory Management System

## ✨ Features

- **Authentication**: Secure login and logout functionality for registered users.
- **Dashboard**: An at-a-glance overview of key statistics, including total stock, low stock items, pending orders, and sales performance charts.
- **Item Management**: Full CRUD (Create, Read, Update, Delete) functionality for inventory items.
- **Stock Management**: Monitor stock utilization by category and receive alerts for low-stock items.
- **Order Processing**: Create new orders, view detailed order information, and update order statuses (Processing, Shipped, Delivered, Cancelled).
- **Reporting Suite**:
  - **Overview**: High-level view of revenue, sales by category, top-selling items, and top customers.
  - **Stock Report**: Detailed table of all inventory items with their current stock levels and valuation.
  - **Sales Report**: A complete log of all sales transactions.
  - **Financial Report**: Analysis of revenue, costs, and profits over time.
- **Activity History**: A searchable and filterable log of all major actions taken within the system.
- **Customizable Settings**:
  - **Appearance**: Switch between light, dark, and system themes. Choose a custom accent color.
  - **System**: Manage and clear application data with confirmation dialogues.
- **Responsive Design**: A user-friendly interface that works seamlessly on both desktop and mobile devices.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API & Hooks
- **Charting**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation

## 🔑 Usage & Credentials

The application comes with pre-configured mock data and users for demonstration purposes. Use the following credentials to log in:

- **Username**: `admin`
- **Password**: `admin123`

All data is stored in the browser's `localStorage`, so it will persist between sessions. You can clear this data from the **Settings > System** page.
