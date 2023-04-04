const express = require("express");
const router = express.Router();

// Controller
const {makePayment} = require("../controllers/stripepayment")

router.post("/stripepayment", makePayment); 


module.exports = router; 