import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken"
import {inngest} from "../inngest/client.js"

export const userSignUp = async (req, res) => {
  const { email, password, name, skills = [] } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({
      message: "Some of the details are missing!",
    });
  } else {
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please Enter a valid email!",
      });
    } else {
      const isUserExisting = User.find({ email });
      if (isUserExisting) {
        return res.status(409).json({
          message: "This user already exists!",
        });
      } else {
        const hashed_password = bcrypt.hash(password, 10);
        const new_user = await User.create({
          email,
          password: hashed_password,
          name,
          skills,
        });
        return res.status(201).json({
          message: "User Created Successfully!",
          data: new_user,
        });
      }
    }
  }
};



