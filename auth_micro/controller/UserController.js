import validationResult from "express-validator";
import prisma from "../config/db.config.js";

class UserController {
  static async getUser(req, res) {
    try {
      const { id } = req.params;

      // Fetch user by ID from the database
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(id, 10), // Ensures ID is treated as an integer
        },
      });

      // Check if user exists
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return the found user
      return res.json({ user });
    } catch (error) {
      // Handle any unexpected errors
      return res
        .status(500)
        .json({ error: "An error occurred while fetching the user" });
    }
  }

  // static async getUsers(req, res) {
  //   try {
  //     // Validate input
  //     const { userIds } = req.body;
  //     if (!Array.isArray(userIds) || userIds.length === 0) {
  //       return res
  //         .status(400)
  //         .json({
  //           message: "Invalid input: userIds must be a non-empty array.",
  //         });
  //     }

  //     // Fetch users from the database
  //     const users = await prisma.user.findMany({
  //       where: {
  //         id: {
  //           in: userIds,
  //         },
  //       },
  //       select: {
  //         id: true,
  //         name: true,
  //         email: true,
  //       },
  //     });

  //     // Check if users were found
  //     if (users.length === 0) {
  //       return res
  //         .status(404)
  //         .json({ message: "No users found with the provided IDs." });
  //     }

  //     // Return successful response
  //     return res.status(200).json({ users });
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //     return res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }
  static async getUsers(req, res) {
    const { userIds } = req.body;
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return res.json({ users: users });
  }
}

export default UserController;
