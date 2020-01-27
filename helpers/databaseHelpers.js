const uuidv4 = require('uuid/v4');
const database = require('./database');

// initiate database -----------------------------------------------------------------------
exports.initiateDatabase = () => {
  const productsInitiated = database.has("products").value();
  const cartInitiated = database.has("cart").value();

  if (!productsInitiated) {
    database.defaults({ products: [] }).write();
    insertProduct("Tablet", 2800, "https://placeimg.com/640/480/tech?t=1579869191799");
    insertProduct("PC", 15000, "https://placeimg.com/640/480/tech?t=1579868878632");
    insertProduct("Galaxy", 3000, "https://placeimg.com/640/480/tech?t=1579868849092");
    insertProduct("Headphones", 450, "https://placeimg.com/640/480/tech?t=1579868931952");
    insertProduct("Camera", 690, "https://placeimg.com/640/480/tech?t=1579876476137");
    insertProduct("Iphone", 5000, "https://placeimg.com/640/480/tech?t=1579876551498");
    insertProduct("Macbook", 17000, "https://placeimg.com/640/480/tech?t=1579876696471");
    insertProduct("Battery", 55, "https://placeimg.com/640/480/tech?t=1579876999052");
    insertProduct("Ipad", 1000, "https://placeimg.com/640/480/tech?t=1579877023789");
    insertProduct("Macbook Pro", 20000, "https://placeimg.com/640/480/tech?t=1579876696471");
  }
  if (!cartInitiated) {
    database.defaults({ cart: [] }).write();
  }
};

// insert products  -------------------------------------------------------------------------
const insertProduct = async ( name, price, imageUrl) => {
        const response = await database
          .get("products")
          .push({ id: uuidv4(), name: name, price: price, imageUrl: imageUrl })
          .write();
        return response;
      };

// get all products --------------------------------------------------------------------------
exports.getProducts = async () => {
  return await database.get("products");
};

// insert products in the shopping cart ------------------------------------------------------
exports.insertProductInCart = async (productId) => {
    await database.get("cart").push({ productId: productId }).write();
    const response = await database.get("products").find({ id: productId }).value();
    return response;
};

// remove products from the shopping cart ----------------------------------------------------
exports.removeProductFromCart = async (productId) => { 
    return await database.get("cart").remove({ productId: productId}).write(); 
  };

// get the shopping cart with all the added products -----------------------------------------
exports.getCartWithProducts = async () => {
    let response = [];
    await database.get("cart").map('productId').value().forEach(element => {
      response.push(database.get("products").find({id: element}).value());
    });
    return response;
    };