const Customer = require("../models/Customer");

exports.getCustomers = async (req, res) => {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Request timeout: Processing took too long"));
      }, 30000);
    });

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const skip = (page - 1) * perPage;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";

    const schemaFields = Object.keys(Customer.schema.paths);
    const allowedSortFields = schemaFields.filter(
      (field) => !field.startsWith("_") && field !== "__v"
    );

    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";
    const validSortOrder = ["asc", "desc"].includes(sortOrder)
      ? sortOrder
      : "desc";

    const sortObj = {};
    sortObj[validSortBy] = validSortOrder === "asc" ? 1 : -1;

    const queryPromise = Promise.all([
      Customer.find()
        .skip(skip)
        .limit(perPage + 1)
        .sort(sortObj)
        .lean(),
      Customer.countDocuments(),
    ]);

    const [customers, totalCount] = await Promise.race([
      queryPromise,
      timeoutPromise,
    ]);

    const totalPages = Math.ceil(totalCount / perPage);

    const hasNextPage = customers.length > perPage;

    if (hasNextPage) {
      customers.pop();
    }

    res.json({
      page,
      result: customers,
      nextPage: hasNextPage ? page + 1 : 0,
      perPage,
      totalPages,
      totalCount,
      previousPage: page > 1 ? page - 1 : 0,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error while fetching customers",
      details: error.message,
      suggestion: "Try with smaller page size or add database indexes",
    });
  }
};

exports.getCustomerCount = async (req, res) => {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Request timeout: Processing took too long"));
      }, 30000);
    });

    const countPromise = Customer.countDocuments();

    const count = await Promise.race([countPromise, timeoutPromise]);

    res.json({
      count,
      msg: "Total customers retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error while counting customers",
      details: error.message,
      suggestion: "Try again or check database performance",
    });
  }
};
