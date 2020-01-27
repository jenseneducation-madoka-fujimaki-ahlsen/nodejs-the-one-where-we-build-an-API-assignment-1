class ErrorHandler extends Error {
    constructor(statusCode, message) {
      super(); //Call the constructor of the parent class(Error)
      this.statusCode = statusCode;
      this.message = message;
    }
  }

const handleError = (err, res) => {
    const { statusCode, message } = err;
    res.status(statusCode).send({
      status: "error",
      statusCode,
      message
    });
};
  
  module.exports = {
    ErrorHandler,
    handleError
  }