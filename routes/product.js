const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  updateProduct,
  deleteProduct,
  getAllProducts,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// Including params
router.param("productId", getProductById);
router.param("userId", getUserById);

// All actual routes

// Create Routes
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

// Read routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo, getProduct);

// Update Routes
router.put(
  "/product/:productId/:userId",
  isAdmin,
  isSignedIn,
  isAuthenticated,
  updateProduct
);

// Delete Routes
router.delete(
  "/product/:productId/:userId",
  isAdmin,
  isSignedIn,
  isAuthenticated,
  deleteProduct
);

// listing routes
router.get("/products", getAllProducts)

module.exports = router;
