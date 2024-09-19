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
}

export default UserController;
