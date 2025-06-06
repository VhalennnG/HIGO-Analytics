const Customer = require("../models/Customer");

exports.getSummary = async (req, res) => {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Request timeout: Processing took too long"));
      }, 30000);
    });

    // First get total count for percentage calculations
    const totalCustomers = await Customer.countDocuments();

    const summaryPromise = Promise.all([
      // Gender distribution
      Customer.aggregate([
        {
          $group: {
            _id: "$gender",
            count: { $sum: 1 },
            avgAge: { $avg: "$age" },
          },
        },
        { $sort: { count: -1 } },
      ]),

      // Device popularity (simplified)
      Customer.aggregate([
        {
          $group: {
            _id: "$brandDevice",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $addFields: {
            percentage: {
              $round: [
                { $multiply: [{ $divide: ["$count", totalCustomers] }, 100] },
                2,
              ],
            },
          },
        },
      ]),

      // Digital interest analysis (simplified)
      Customer.aggregate([
        {
          $group: {
            _id: "$digitalInterest",
            count: { $sum: 1 },
            genders: { $push: "$gender" },
          },
        },
        {
          $addFields: {
            topGender: {
              $arrayElemAt: [
                {
                  $slice: [
                    {
                      $reduce: {
                        input: "$genders",
                        initialValue: [],
                        in: {
                          $concatArrays: [
                            "$$value",
                            {
                              $cond: [
                                { $in: ["$$this", "$$value.gender"] },
                                [],
                                [{ gender: "$$this", count: { $sum: 1 } }],
                              ],
                            },
                          ],
                        },
                      },
                    },
                    1,
                  ],
                },
                0,
              ],
            },
          },
        },
        { $sort: { count: -1 } },
        { $project: { genders: 0 } },
      ]),

      // Location breakdown (simplified)
      Customer.aggregate([
        {
          $group: {
            _id: "$locationType",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      // Age demographics (simplified)
      Customer.aggregate([
        {
          $bucket: {
            groupBy: "$age",
            boundaries: [0, 18, 25, 35, 45, 55, 65, 100],
            default: "Other",
            output: {
              count: { $sum: 1 },
              maleCount: {
                $sum: {
                  $cond: [{ $eq: ["$gender", "Male"] }, 1, 0],
                },
              },
              femaleCount: {
                $sum: {
                  $cond: [{ $eq: ["$gender", "Female"] }, 1, 0],
                },
              },
            },
          },
        },
        {
          $addFields: {
            malePercentage: {
              $round: [
                { $multiply: [{ $divide: ["$maleCount", "$count"] }, 100] },
                2,
              ],
            },
            femalePercentage: {
              $round: [
                { $multiply: [{ $divide: ["$femaleCount", "$count"] }, 100] },
                2,
              ],
            },
          },
        },
      ]),

      // Time analysis (simplified)
      Customer.aggregate([
        {
          $group: {
            _id: { $substr: ["$loginHour", 0, 2] },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { hour: "$_id", count: 1, _id: 0 } },
      ]),
    ]);

    const [
      genderData,
      deviceData,
      interestData,
      locationData,
      ageData,
      timeData,
    ] = await Promise.race([summaryPromise, timeoutPromise]);

    res.json({
      status: "success",
      data: {
        totalCustomers,
        genderDistribution: genderData,
        devicePopularity: deviceData,
        interestCategories: interestData,
        locationBreakdown: locationData,
        ageDemographics: ageData,
        peakHours: timeData,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to generate summary data",
      error: error.message,
      suggestion: "Try again with a smaller dataset or add more indexes",
      documentation: "Check MongoDB aggregation pipeline syntax",
    });
  }
};
