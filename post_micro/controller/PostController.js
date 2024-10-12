import axios from "axios";
import prisma from "../config/db.config.js";

class PostController {
  static async index(req, res) {
    try {
      const posts = await prisma.post.findMany({});

      // * Method 2
      let userIds = [];
      posts.forEach((item) => {
        userIds.push(item.user_id);
      });

      //   Fetch users
      const response = await axios.post(
        `${process.env.AUTH_MICRO_URL}/api/getUsers`,
        userIds
      );

      const users = {};
      response.data.users.forEach((item) => {
        users[item.id] = item;
      });

      //   * Method 3
      let postWithUsers = await Promise.all(
        posts.map((post) => {
          const user = users[post.user_id];

          return {
            ...post,
            user,
          };
        })
      );

      return res.json({ postWithUsers });
    } catch (error) {
      console.log("the post fetch error is", error);
      return res.status(500).json({ message: "Something went wrong." });
    }
  }

  static async store(req, res) {
    try {
      const authUser = req.user; // Use req.user instead of req.authUser
      console.log("Authenticated User:", authUser); // Debugging line
      const { title, content } = req.body;

      // Input validation: Check if title and content are provided
      if (!title || !content) {
        return res.status(400).json({
          status: "error",
          message: "Title and content are required.",
        });
      }

      // Check if authUser is defined
      if (!authUser) {
        return res.status(401).json({
          status: "error",
          message: "User not authenticated.",
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

// * Method 1
// let postWithUser = await Promise.all(
//   posts.map(async (post) => {
//     const res = await axios.get(
//       `${process.env.AUTH_MICRO_URL}/api/getUser/${post.user_id}`
//     );

//     return {
//       ...post,
//       ...res.data,
//     };
//   })
// );
