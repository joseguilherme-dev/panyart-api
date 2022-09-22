import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';

// Routers
import userAuthRouter from './routers/userAuthRouter';
import adminRouter from './routers/adminRouter';
import userRouter from './routers/userRouter';

// Middlewares
import { isAuthenticatedMiddleware } from './middlewares/authenticationMiddleware';
import { isStaffMiddleware } from './middlewares/staffMiddleware';


const app: Express = express();
const port = 8000;

// Config
app.use(express.json());
app.use(cookieParser());

// Endpoint raiz
app.get('/', (req, res) => {
  res.send('Bem-vindo!')
})

// Global Middlewares
app.use(isAuthenticatedMiddleware)
app.use(isStaffMiddleware);

// Routers
app.use('/auth', userAuthRouter)
app.use('/admin', adminRouter)
app.use('/user', userRouter)


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});