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

app.get("/products", (req, res) => {
  getAllProducts()
    .then((products) => {
      res.json(products)
    })
    .catch((error) => {
      console.error("Error:", error)
    })
})

app.get("/getorders", (req, res) => {
  getAllOrders()
    .then((orders) => {
      res.json(orders)
    })
    .catch((error) => {
      console.error("Error:", error)
    })
})

app.get("/", (req, res) => {
  res.json("hello, you`ve reached accesories-store-api")
})

app.get("/debug", (req, res) => {
  res.sendFile(path.join(__dirname, "debug.html"))
})

app.post("/sendorder", (req, res) => {
  const currentDate = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "")

  let totalPrice = 0
  let newOrder = {
    items: req.body.reduce((acc, item) => {
      totalPrice += parseInt(item.product.price * item.quantity)
      acc[item.product.name] = item.quantity
      return acc
    }, {}),
    orderDate: currentDate,
    totalPrice: `${totalPrice}.00$`,
  }

  //check if new order exist
  newOrder
    ? (saveOrder(newOrder), res.json("Succesfully placed and order"))
    : res.status(500).json("Some error had happened, order was not placed")
})

app.post("/addproduct", (req, res) => {
  addProduct(req.body)
    .catch((e) => {
      console.log(e)
    })
    .finally(res.json(`Product ${req.body.name} has been added`))
})

app.listen(PORT, () => {
  console.log(`Server: accesories API is running on port: ${PORT}`)
})
