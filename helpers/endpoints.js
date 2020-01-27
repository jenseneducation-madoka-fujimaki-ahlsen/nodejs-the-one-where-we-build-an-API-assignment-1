const database = require('./database');
const databaseHelpers = require('./databaseHelpers');
const { ErrorHandler } = require('./error')

module.exports = (app) => {

// get all products ------------------------------------------------------------------------
app.get("/api/products", async (request, response) => {
    let data = await databaseHelpers.getProducts();
    data = data.sortBy("name");
    response.send(data);
  });
  
  // insert products in the shopping cart ----------------------------------------------------
  app.post("/api/cart", async (request, response, next) => {
    const productId = request.body.productId;
    try {
      if (database.get("products").some(product => product.id === productId).value()) {
        if (database.get("cart").some(cart => cart.productId === productId).value()) {
          throw new ErrorHandler(400, 'The product is already in your cart');
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
        throw new ErrorHandler(404, 'The product does not exist');
      };
      next()
    } catch (error) {
      next(error)
    }
  });
  
  // remove products from the shopping cart ----------------------------------------------------
  app.delete("/api/cart/:productId", async (request, response, next) => {
      const productId = request.params.productId;
    try {
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
          throw new ErrorHandler(404, 'The product does not exist in your cart');
        }
      } else {
        throw new ErrorHandler(404, 'The product does not exist');
      }
      next()
    } catch (error) {
      next(error)
    }  
    });
  
  // get the shopping cart with all the added products -----------------------------------------
   app.get("/api/cart", async (request, response) => {
          let data = await databaseHelpers.getCartWithProducts();
          response.send(data);
        });
       
}