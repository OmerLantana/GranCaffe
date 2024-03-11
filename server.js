import express from "express";
import morgan from "morgan";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import userRouter from "./routes/userRoutes.js";
import menuRoutes from './routes/menuRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create an Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(errorHandler);

// Set bufferCommands to false to disable buffering
mongoose.set('bufferCommands', false);

// API routes
app.use('/api/users', userRouter);
app.use('/api/menu', menuRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Serve static assets
app.use(express.static(path.resolve(__dirname, 'client', 'build')));

app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
);

// Set port
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});
