import bcrypt from "bcrypt";
import prisma from "../config/db.config.js";
import jwt from "jsonwebtoken";

class AuthController {
  static async register(req, res) {
    try {
      const payload = req.body;
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(payload.password, salt);

      const user = await prisma.user.create({
        data: payload,
      });

      return res.status(201).json({
        status: "success",
        message: "Account created successfully",
        data: { user },
      });
    } catch (error) {
      if (error.code === "P2002" && error.meta.target.includes("email")) {
        return res.status(409).json({
          status: "error",
          message: "Email already in use",
        });
      }
      console.error("Registration Error: ", error);
      return res.status(500).json({
        status: "error",
        message: "Something went wrong, please try again",
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Check if user exists in the database
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, name: true, password: true },
      });

      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Invalid credentials",
        });
      }

      // Compare provided password with the stored hash
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: "error",
          message: "Invalid credentials",
        });
      }

      // Create the payload for the JWT
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      // Sign the token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h", // Token expires in 1 hour
      });

      // Return success response with the token
      return res.status(200).json({
        status: "success",
        message: "Logged in successfully",
        data: {
          token,
        },
      });
    } catch (error) {
      console.error("Login Error: ", error);
      return res.status(500).json({
        status: "error",
        message: "Something went wrong, please try again",
      });
    }
  }
  static async user(req, res) {
    const user = req.user;
    return res.status(200).json({
      status: "success",
      message: "User details",
    });
  }
}

export default AuthController;
