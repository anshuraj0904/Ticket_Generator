import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import { inngest } from "../inngest/client.js";

export const userSignUp = async (req, res) => {
  try {
    const { email, password, name, role, skills = [] } = req.body;
    role = role || "user";
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
          await User.create({
            email,
            password: hashed_password,
            name,
            role,
            skills,
          });

          const user_details = User.findOne({ email }).select("-password");

          // Firing the inngest event:
          await inngest.send({
            name: "user/signup", // Because, the name of the event in /inngest/functions/on-signup is user/signup
            data: {
              email, // Remember, we're having const {email} = event.data in our on-signup.js, this is what is there for.
            },
          });

          const token = jwt.sign(
            { id: user_details._id, role: user_details.role },
            process.env.JWT_SECRET
          );

          return res.status(201).json({
            message: "User Created Successfully!",
            data: user_details,
            token,
          });
        }
      }
    }
  } catch (e) {
    console.error("Error creating the user: ", e);
    return res.status(500).json({
      message: "Signup failed!",
      details: e.message,
    });
  }
};

// Controller for logging an user:-
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "User doesn't exist. Please Enter valid credentials!",
      });
    } else {
      const isPasswordMatching = await bcrypt.compare(password, user.password);
      if (!isPasswordMatching) {
        return res.status(401).json({
          message: "Enter correct password!",
        });
      } else {
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return res
          .status(200)
          .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          })
          .json({ message: "Login Successful!" });
      }
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Login failed!",
      details: e.message,
    });
  }
};

// For use logout:
export const userLogout = async (req, res) => {
  try {
    const isToken = req.headers.authorization.split(" ")[1];
    //Because, the header has "Bearer <JWT_token>", hence, we split it using (" "), and we need the 2nd part so, index =1.
    if (!isToken) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    } else {
      jwt.verify(isToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized!" });
        }

        res.clearCookie("token"); // Clearing the cookie.
        return res
          .status(200)
          .json({ message: "User logged out successfully!" });
      });
    }
  } catch (err) {
    console.error("Error in the action: ", err);
    return res.status(500).json({ message: err });
  }
};

export const userUpdate = async (req, res) => {
  const { skills = [], role, email } = req.body;

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden!" });
  }

  const user_to_update = await User.findOne({ email });
  if (!user_to_update) {
    return res.status(401).json({ message: "User not found to be updated!" });
  }

  try {
    await user_to_update.updateOne(
      { email },
      { skills: skills.length ? skills : user_to_update.skills, role }
    );

    return res
      .status(200)
      .json({ message: "User details updated successfully!" });
  } catch (err) {
    console.error("Error updating the user: ", err);
    return res.status(500).json({ message: `Error Updating the User: ${err}` });
  }
};

export const getAllUserS = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden!" });
    }

    const user = await User.findOne().select("-password");
  } catch (error) {}
};
