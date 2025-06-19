import express, { Request, Response } from 'express'

const app = express();
const PORT = process.env.PORT;

app.use(express.json())\

app.use("/v1/user", Router)

app.get("/", (req:Request,res: Response) => {
    res.send(`App is running `)
})
app.listen(PORT, () => {
    // Db call
    console.log(`Server running on port ${PORT}`)
})