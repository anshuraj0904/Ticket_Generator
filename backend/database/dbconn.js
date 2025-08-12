import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const ConnDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Connection Successful!`);
    
  } catch (err) {
    console.log(`❌ Error connecting to the Database : ${err}`)
  }
};

export default ConnDB;