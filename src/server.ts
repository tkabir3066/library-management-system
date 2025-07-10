import "dotenv/config";

import mongoose from "mongoose";
import app from "./app";

const port = process.env.PORT || 3000;

async function main() {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);

    console.log("✅ Connected to MongoDB using Mongoose");

    app.listen(port, () => {
      console.log(`🚀 Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log("❌ Error connecting to MongoDB:", error);
  }
}

main();
