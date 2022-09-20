import express, { Express, Request, Response } from 'express';
import userAuthRouter from './routers/userAuthRouter';

const app: Express = express();

const port = 8000;

// Config
app.use(express.json());

// Endpoint raiz
app.get('/', (req, res) => {
  res.send('Bem-vindo!')
})

// Routes
app.use('/auth', userAuthRouter)



app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});