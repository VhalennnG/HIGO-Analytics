const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    number: Number,
    nameOfLocation: String,
    date: Date,
    loginHour: String,
    name: String,
    age: Number,
    gender: String,
    email: String,
    noTelp: String,
    brandDevice: String,
    digitalInterest: String,
    locationType: String,
  },
  { timestamps: true }
);

// Add indexes for performance
customerSchema.index({ gender: 1 });
customerSchema.index({ brandDevice: 1 });
customerSchema.index({ locationType: 1 });
customerSchema.index({ digitalInterest: 1 });

module.exports = mongoose.model("Customer", customerSchema);
