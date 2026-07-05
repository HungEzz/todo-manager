import express from "express";
import healthRouter from "./routes/health.route";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON requests
app.use(express.json());

// Routes
app.use("/", healthRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
