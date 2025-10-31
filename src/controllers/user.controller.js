import { asyncHandler } from "../utils/asyncHandler.js";

// Controller function for user registration
// asyncHandler is used to handle errors in async functions easily
const registerUser = asyncHandler(async (req, res) => {

  // For now, it just sends a simple success response
  res.status(200).json({
    message: "Hardik Vala"  // message sent back to client
  });
});

export {
  registerUser,
}