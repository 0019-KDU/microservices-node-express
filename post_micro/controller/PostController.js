import prisma from "../config/db.config.js";

class PostController {
  static async index(req, res) {
    try {
      // Fetch all posts from the database
      const posts = await prisma.post.findMany({});

      // Return success response
      return res.status(200).json({
        status: "success",
        data: posts,
      });
    } catch (error) {
      console.error("Error fetching posts:", error.message); // Logging error for debugging

      // Return error response
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error. Please try again later.",
      });
    }
  }

  static async store(req, res) {
    try {
      const authUser = req.authUser;
      const { title, content } = req.body;

      // Input validation: Check if title and content are provided
      if (!title || !content) {
        return res.status(400).json({
          status: "error",
          message: "Title and content are required.",
        });
      }

      // Create a new post
      const post = await prisma.post.create({
        data: {
          user_id: authUser.id, // Assuming user_id comes from authUser
          title,
          content,
        },
      });

      // Return success response
      return res.status(201).json({
        status: "success",
        message: "Post created successfully",
        data: post,
      });
    } catch (error) {
      console.error("Error creating post:", error.message); // Logging error

      // Return error response
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error. Please try again later.",
      });
    }
  }
}

export default PostController;
