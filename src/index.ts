import express from "express"
import dotenv from "dotenv";
import cors from "cors";
import deployRouter from "./routes/deployRouter.js"


dotenv.config();

const PORT = process.env.PORT;



const app = express();
app.use(express.json());
app.use(cors());
app.use("/deploy" ,deployRouter);

app.listen(PORT , () =>{
    console.log(`App listening on port ${PORT}`)
})
