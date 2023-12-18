# Accesories Store API

[Live Preview](https://accesories-store-api-83f92813ccbf.herokuapp.com)

This API is designed to communicate with MongoDB, retrieve products, save orders to the database, and provides a debug page for managing products and viewing orders.

## Features

- **MongoDB Integration:** The API seamlessly integrates with MongoDB for data storage.
- **Retrieve Products:** Retrieve information about products stored in the database.
- **Save Orders:** Save orders to the MongoDB database.
- **Debug Page:** Access the debug page at `/debug` to manage products and view orders.

## API Endpoints

### Retrieve Products

- **Endpoint:** `/products`
- **Method:** GET
- **Description:** Retrieve a list of products from the database.

### Save Orders

- **Endpoint:** `/saveorder`
- **Method:** POST
- **Description:** Save an order to the MongoDB database.

### Debug Page

- **Endpoint:** `/debug`
- **Description:** Access the debug page to manage products and view orders.

## Getting Started

1. Clone the repository: `git clone https://github.com/your-username/your-api-repo.git`
2. Install dependencies: `npm install`
3. Set up your MongoDB connection by configuring the environment variables.
4. Start the API: `npm start`

Access the debug page at `/debug` to perform the following actions:

- View Products
- Add Products
- View Orders

## Contributing

Feel free to contribute by opening issues or submitting pull requests. Your contributions are highly appreciated.
