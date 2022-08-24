const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const { MongoClient } = require("mongodb");
const app = express();

const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());
//env import
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vljpp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
    try {
      await client.connect();
      console.log("dbms connected");
      const database = client.db("Shopping-Cart");
      const productsCollection = database.collection("products");
      const cartCollection = database.collection("cart");
  
      //----------GET API ALL PRODUCTS -----------------
      app.get("/products", async (req, res) => {
        const cursor = productsCollection.find({});
        const products = await cursor.toArray();
        res.json(products);
      });
    //----------GET API SINGLE DETAILS -----------------
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id is", id);
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });
      //----------GET API ALL CART PRODUCTS -----------------
      app.get("/cart", async (req, res) => {
        const cursor = cartCollection.find({});
        const products = await cursor.toArray();
        res.json(products);
      });

    //----------POST API ADD TO CART -----------------
    app.post("/cart", async (req, res) => {
      const cart = req.body;
      console.log(cart);
      const result = await cartCollection.insertOne(cart);
      res.json(result);
    });

    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);
  
  app.get('/', (req, res) => {
    res.send('Welcome to the Server ')
  })

  app.listen(port, () => {
    console.log(`Server is Running at  http://localhost:${port}`);
  });
  