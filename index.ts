import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routers
import userAuthRouter from "./routers/userAuthRouter";
import adminRouter from "./routers/adminRouter";
import userRouter from "./routers/userRouter";

// Middlewares
import { isAuthenticatedMiddleware } from "./middlewares/authenticationMiddleware";
import { isStaffMiddleware } from "./middlewares/staffMiddleware";

const app: Express = express();
const PORT = process.env.PORT || 8000;

// Config
app.use(cookieParser());
app.use(cors({ origin: "http://127.0.0.1:3000", credentials: true }));
app.use(express.json());

// Endpoint raiz
app.get("/", (req, res) => {
  res.send("Bem-vindo!");
});

// Global Middlewares
app.use(isAuthenticatedMiddleware);
app.use(isStaffMiddleware);

// Routers
app.use("/auth", userAuthRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://0.0.0.0:${PORT}`);
});
