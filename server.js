const express = require("express")
const cors = require("cors")
const app = express()
const fs = require("fs")
const path = require("path")
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

//temporary saving to file, later will be database
function saveOrderToFile(data) {
  // Create a directory if it doesn't exist
  const directoryPath = "./orders"
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath)
  }

  // Convert to 'YYYY-MM-DD HH:mm:ss' format
  const currentDate = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "")

  // Create the file path
  const filePath = path.join(directoryPath, `${currentDate}.txt`)

  // Convert the object to a JSON string
  const jsonString = JSON.stringify(data, null, 2) // 2 is for indentation

  // Add the ID of customer and append to jsonString
  //jsonString.concat(customer)

  // Write the JSON string to the file
  fs.writeFileSync(filePath, jsonString, "utf-8")

  console.log(`Data has been written to ${filePath}`)
}

app.get("/products", (req, res) => {
  const products = require("./products.json")
  res.json(products)
})

app.get("/", (req, res) => {
  res.json("hello, you`ve reached accesories-store-api")
})

app.post("/sendorder", (req, res) => {
  let totalPrice = 0
  let newOrder = {
    items: req.body.reduce((acc, item) => {
      totalPrice += parseInt(item.product.price * item.quantity)
      acc[item.product.name] = item.quantity
      return acc
    }, {}),
    totalPrice: `${totalPrice}.00$`,
  }

  //add logic to save to database or some orders handler

  //check if new order exist
  newOrder
    ? (console.log("Server: You have got a new order:\n", newOrder),
      saveOrderToFile(newOrder),
      res.json("Succesfully placed and order"))
    : res.json("Some error had happened, order was not placed")
})

app.listen(port, () => {
  console.log("Server: accesories API is running on port 5000")
})
