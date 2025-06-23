import express, { Request, Response, Router } from 'express'
import { UserRouter } from './routes';

const app = express();
const PORT = 3001;

app.use(express.json())

app.use("/v1/user",UserRouter)

app.get("/", (req:Request,res: Response) => {
    res.send(`App is running `)
})
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})