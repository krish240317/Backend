const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  }
}

//Promise Handling: Inside the returned function, it calls the requestHandler and ensures it returns a promise (by using Promise.resolve).
// Error Handling: If the promise is rejected (i.e., an error occurs), the 
//catch block catches the error and passes it to the next function, which forwards the error to the next middleware in the stack.

export { asyncHandler };
