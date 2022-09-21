import express, { Express, Request, Response } from 'express';
import userAuthRouter from './routers/userAuthRouter';
import { authenticateJWT } from './utils/jwt';
import cookieParser from 'cookie-parser';

const app: Express = express();

const port = 8000;

// Config
app.use(express.json());
app.use(cookieParser());

// Endpoint raiz
app.get('/', (req, res) => {
  res.send('Bem-vindo!')
})

// Middlewares
//app.use(authenticateJWT)

// Routes
app.use('/auth', userAuthRouter)



app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});