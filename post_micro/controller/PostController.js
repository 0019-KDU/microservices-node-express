import prisma from "../config/db.config.js";
import axios from "axios";

class PostController {
  static async index(req, res) {
    try {
      // Fetch all posts from the database
      const posts = await prisma.post.findMany({});

      let userIds = [];
      posts.forEach((item) => {
        userIds.push(item.user_id);
      });
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

      const response = await axios.post(
        `${process.env.AUTH_MICRO_URL}/api/getAllUsers/`,
        userIds
      );

      const users = {};
      response.data.users.forEach((item) => {
        users[item.id] = item;
      });
      // * Method 2
      // let postWithUser = await Promise.all(
      //   posts.map((posts) => {
      //     const user = users.find((item) => item.id === posts.user_id);
      //     return { ...posts, user };
      //   })
      // );

      // * Method 3
      let postWithUser = await Promise.all(
        posts.map((post) => {
          const user = users[post.user_id];
          return { ...post, user };
        })
      );

      // Return success response
      return res.status(200).json({
        status: "success",
        data: postWithUser,
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
