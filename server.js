const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const database = require('./modules/database');
const databaseHelpers = require('./modules/databaseHelpers');
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// get all products ------------------------------------------------------------------------
app.get("/api/products", async (request, response) => {
  let data = await databaseHelpers.getProducts();
  data = data.sortBy("name");
  response.send(data);
});

// insert products in the shopping cart ----------------------------------------------------
app.post("/api/cart", async (request, response) => {
  const productId = request.body.productId;
  
  if (database.get("products").some(product => product.id === productId).value()) {
    if (database.get("cart").some(cart => cart.productId === productId).value()) {
      const errorMessage = {
        error: 'ERROR',
        message: 'The product is already in your cart'
     }
      response.status(400).send(errorMessage);
    } else {
        let message = {
        success: true,
        message: "The product has been added to your cart"
      };  
      const res = await databaseHelpers.insertProductInCart(productId);
      message.data = res;
      response.send(message);
    }
  } else {
    const errorMessage = {
      error: 'ERROR',
      message: 'The product does not exist'
   }
   response.status(404).send(errorMessage);
  };
});

// remove products from the shopping cart ----------------------------------------------------
app.delete("/api/cart/:productId", async (request, response) => {
    const productId = request.params.productId;
  
    if (database.get("products").some(product => product.id === productId).value()) {
      if (database.get("cart").some(cart => cart.productId === productId).value()) {      
      let message = {
        success: true,
        message: "The product has been removed from your cart"
      }; 
      const res = await databaseHelpers.removeProductFromCart(productId);
      message.data = res;
      response.send(message);
      } else {
        const errorMessage = {
          error: 'ERROR',
          message: 'The product does not exist in your cart'
       }
        response.status(404).send(errorMessage);
      }
    } else {
      const errorMessage = {
        error: 'ERROR',
        message: 'The product does not exist'
     }
      response.status(404).send(errorMessage);
    }
  });

// get the shopping cart with all the added products -----------------------------------------
 app.get("/api/cart", async (request, response) => {
        let data = await databaseHelpers.getCartWithProducts();
        response.send(data);
      });
     
// -------------------------------------------------------------------------------------------
app.listen(port, () => {
  console.log("Server started on port: ", port);
  databaseHelpers.initiateDatabase();
});