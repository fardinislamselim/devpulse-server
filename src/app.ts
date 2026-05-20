import express, { type Application, type Request, type Response } from 'express'


// ── Init express
const app: Application = express();


// ── Global middleware 
app.use(express.json());


// ── Check if server is running
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "DevPulse Server is running!" });
});



export default app