import express, { type Application, type NextFunction, type Request, type Response } from "express";
import { errorHandler, notFound } from "./middlewares/errorHandler";

// Init express
const app: Application = express();

// Global middleware
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "DevPulse Server is running!",
  });
});

app.get("/error", (req: Request, res: Response, next: NextFunction) => {
  next(new Error("Test error"));
});

// 404 middleware
app.use(notFound);

// Global error middleware
app.use(errorHandler);

export default app;
