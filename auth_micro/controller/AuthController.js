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

      const user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        //check both  password
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({
            status: "error",
            message: "Invalid credentials",
          });
        }
        const payload = {
          id: user.id,
          email: user.email,
          name: user.name,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        return res.status(200).json({
          status: "success",
          message: "Logged in successfully",
          data: { token },
        });
      }
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    } catch (error) {
      console.error("Login Error: ", error);
      return res.status(500).json({
        status: "error",
        message: "Something went wrong, please try again",
      });
    }
  }
}

export default AuthController;
