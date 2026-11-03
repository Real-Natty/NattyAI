require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");

const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing from your .env file.");
}

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("NattyAI backend is running!");
});

app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`NattyAI server running on port ${PORT}`);
  });
};

startServer();
