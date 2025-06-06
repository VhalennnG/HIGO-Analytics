const csv = require("csv-parser");
const fs = require("fs");
const Customer = require("../models/Customer");
const { mongoURI } = require("../config/db");
const mongoose = require("mongoose");

// Hapus deprecated options
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
    importCSV();
  })
  .catch((err) => console.error("Connection error:", err));

async function importCSV() {
  try {
    // Hapus data lama terlebih dahulu
    await Customer.deleteMany({});
    console.log("Cleared existing data");

    const batchSize = 1000; // Proses per 1000 records
    let batch = [];
    let totalImported = 0;

    const stream = fs
      .createReadStream("data/Dataset.csv")
      .pipe(csv())
      .on("data", async (data) => {
        // Pause stream sementara untuk mencegah memory overflow
        stream.pause();

        try {
          const customerData = {
            number: parseInt(data.Number) || 0,
            nameOfLocation: data["Name of Location"] || "",
            date: data.Date ? new Date(data.Date) : new Date(),
            loginHour: data["Login Hour"] || "",
            name: data.Name || "",
            age: parseInt(data.Age) || 0,
            gender: data.gender || "",
            email: data.Email || "",
            noTelp: data["No Telp"] || "",
            brandDevice: data["Brand Device"] || "",
            digitalInterest: data["Digital Interest"] || "",
            locationType: data["Location Type"] || "",
          };

          batch.push(customerData);

          // Jika batch sudah penuh, insert ke database
          if (batch.length >= batchSize) {
            await Customer.insertMany(batch);
            totalImported += batch.length;
            console.log(`Imported ${totalImported} customers so far...`);
            batch = []; // Reset batch

            // Garbage collection hint
            if (global.gc) {
              global.gc();
            }
          }

          // Resume stream
          stream.resume();
        } catch (err) {
          console.error("Error processing row:", err);
          stream.resume();
        }
      })
      .on("end", async () => {
        try {
          // Insert sisa data yang belum di-insert
          if (batch.length > 0) {
            await Customer.insertMany(batch);
            totalImported += batch.length;
          }

          console.log(
            `✅ Import completed! Total: ${totalImported} customers imported successfully`
          );
          process.exit(0);
        } catch (err) {
          console.error("Final import error:", err);
          process.exit(1);
        }
      })
      .on("error", (err) => {
        console.error("Stream error:", err);
        process.exit(1);
      });
  } catch (err) {
    console.error("Import error:", err);
    process.exit(1);
  }
}
