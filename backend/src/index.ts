import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.route";
import taskRouter from "./routes/task.route";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS to support local development and production domains via environment variables
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware for parsing JSON requests
app.use(express.json());

// Routes
app.use("/", healthRouter);
app.use("/api", taskRouter);

// Standard 404 Route Not Found handler
app.use((req, res, next) => {
  const error: any = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Global error handling middleware 
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
