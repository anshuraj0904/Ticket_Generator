import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const ConnDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Connection Successful!`);
    
  } catch (error) {
    console.error(`❌ Error connecting to the Database : ${error}`)
    process.exit(1)
  }
};

export default ConnDB;
