const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const summaryController = require("../controllers/summaryController");

// Customer data routes
router.get("/customers", customerController.getCustomers);
router.get("/customers/count", customerController.getCustomerCount);

// Summary data routes
router.get("/summary", summaryController.getSummary);

module.exports = router;
