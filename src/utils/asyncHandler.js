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

// This is another (shorter) way to handle async errors in Express
const asyncHandler = (fn) => {
  return (req, res, next) => {
    // Run the async function and handle errors using Promise.catch()
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };