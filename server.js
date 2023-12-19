require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require("mongodb")
const app = express()
const path = require("path")
const { log } = require("console")
const URI = process.env.DB_URI
const PORT = process.env.PORT || 5000
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
const database = client.db("accesories-store")

app.use(express.json())
app.use(cors())

// DB query functions

async function getAllProducts() {
  try {
    await client.connect()

    // Access the database and collection
    const collection = database.collection("products")

    // Query to get all products
    const products = await collection.find({}).toArray()

    return products
  } finally {
    await client.close()
  }
}

async function getAllOrders() {
  try {
    await client.connect()

    // Access the database and collection
    const collection = database.collection("orders")

    // Query to get all orders
    const orders = await collection.find({}).toArray()

    return orders
  } finally {
    await client.close()
  }
}

async function saveOrder(data) {
  try {
    await client.connect()

    // Access the 'accessories-api' database and 'orders' collection
    const ordersCollection = database.collection("orders")

    // Insert the data into the 'orders' collection
    const result = await ordersCollection.insertOne(data)

    console.log(`Order has been saved to MongoDB with ID: ${result.insertedId}`)
    return result
  } finally {
    await client.close()
  }
}

async function addProduct(data) {
  try {
    await client.connect()

    // Access the 'accessories-api' database and 'orders' collection

    const ordersCollection = database.collection("products")

    // Insert the data into the 'orders' collection
    const result = await ordersCollection.insertOne(data)

    console.log(
      `Product has been saved to MongoDB with ID: ${result.insertedId}`
    )
  } finally {
    await client.close()
  }
}

// Endpoints

// Entry endpoint

app.get("/", (req, res) => {
  res.json(
    "Hello, you`ve reached accesories-store-api, for some ui go to /debug"
  )
})

// Get all products from DB

app.get("/products", (req, res) => {
  getAllProducts()
    .then((products) => {
      res.json(products)
    })
    .catch((error) => {
      console.error("Error:", error)
      res
        .status(500)
        .json("SERVER: There was a problem getting products from DB")
    })
})

// Get all orders from DB

app.get("/getorders", (req, res) => {
  getAllOrders()
    .then((orders) => {
      res.json(orders)
    })
    .catch((error) => {
      console.error("Error:", error)
      res.status(500).json("SERVER: there was a problem getting orders from DB")
    })
})

// Debug 'backdoor' to quickly check orders, products, add product

app.get("/debug", (req, res) => {
  res.sendFile(path.join(__dirname, "debug.html"))
})

// Send cart list to the DB

app.post("/sendorder", (req, res) => {
  // Creating timestamp
  const currentDate = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "")

  let totalPrice = 0
  // Creating new order object, reducing price of all to total
  let newOrder = {
    items: req.body.reduce((acc, item) => {
      totalPrice += parseInt(item.product.price * item.quantity)
      acc[item.product.name] = item.quantity
      return acc
    }, {}),
    orderDate: currentDate,
    totalPrice: `${totalPrice}.00$`,
  }

  newOrder
    ? // If the order object exist try to saveOrder
      saveOrder(newOrder)
        .then((result) => {
          res.json(`Succesfully placed and order: ${result.insertedId}`)
        })
        .catch((error) => {
          console.error("Error:", error)
          res
            .status(500)
            .json("SERVER: there was a problem placing orders to DB")
        })
    : // If not send back 500 and error masg back to the client
      res
        .status(500)
        .json("SERVER: Some error had happened, order was not placed")
})

app.post("/addproduct", (req, res) => {
  addProduct(req.body)
    .catch((e) => {
      console.log(e)
    })
    .finally(res.json(`Product ${req.body.name} has been added`))
})

// Server start

app.listen(PORT, () => {
  console.log(`SERVER: accesories API is running on port: ${PORT}`)
})

