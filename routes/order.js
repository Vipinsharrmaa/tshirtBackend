const express = require("express");
const router = express.Router();
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { isAdmin, isSignedIn, isAuthenticated } = require("../controllers/auth");
const { updateStock } = require("../controllers/product");
const {
  getOrderById,
  createOrder,
  getAllOrders,
  getOrderStatus,
  updateStatus
} = require("../controllers/order");

// Params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

// Actual Routes
// Create
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);
//Read
router.get("/order/all/:userId", isSignedIn,isAuthenticated,isAdmin, getAllOrders);

// status of order
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus);

router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus )

module.exports = router;
