import express from "express";
import "dotenv/config";
import cors from "cors";
const app = express();

const PORT = process.env.PORT || 5001;

//* Middleware

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); //

app.get("/", (req, res) => {
  return res.json({ message: "It's working" });
});

//* Routes
import Routes from "./routes/index.js";
app.use(Routes);

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
