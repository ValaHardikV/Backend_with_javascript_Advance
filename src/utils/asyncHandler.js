//method - 1

/*

// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {} //here func is other function that exicute inside asyncHandler
// const asyncHandler = (func) => async () => {}


const asyncHandler = (fn) => async (req, res, next) => { //next is flag that send middle-where , next = 1 means middle-where exicute succesfully and check all things
    try{
        await fn(req, res, next)
    }catch(error){
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        });

    }
}

export {asyncHandler}


*/

// ------------------ METHOD 2 ------------------

// ---------------- ASYNCHANDLER FUNCTION ----------------
// This function helps us handle errors in async functions automatically
// without writing try-catch blocks again and again in every controller.

const asyncHandler = (fn) => {
  // fn → this is the async function (like a controller) we want to wrap

  return (req, res, next) => {
    // Promise.resolve() makes sure that even if 'fn' returns a promise,
    // it will be handled properly. If 'fn' throws an error or rejects,
    // the .catch() part will automatically pass the error to Express.

    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    // next(err) → sends the error to Express's default error handler or any
    // custom error-handling middleware we define later.
  };
};

// Exporting the function so we can use it in other files (like controllers)
export { asyncHandler };