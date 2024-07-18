//This line of JavaScript code defines a new class named ApiError that extends the built-in Error class.
//xtending the Error class means that ApiError inherits all the properties and methods of Error, allowing you to create custom error objects that
// can be used in a similar way to standard errors but with additional functionality or information specific to your application's needs. 
//This is useful for error handling, especially when you want to distinguish between different types of errors in your code.
class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}