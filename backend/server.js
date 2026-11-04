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
  throw new Error("GROQ_API_KEY is missing from your environment variables.");
}

const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(
  Boolean,
);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
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
  try {
    console.log("Starting NattyAI backend...");
    console.log("MONGO_URI exists:", Boolean(process.env.MONGO_URI));
    console.log("GROQ_API_KEY exists:", Boolean(process.env.GROQ_API_KEY));

    await connectDB();

    app.listen(PORT, () => {
      console.log(`NattyAI server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("SERVER STARTUP ERROR:", error);
    process.exit(1);
  }
};

startServer();

startServer();
