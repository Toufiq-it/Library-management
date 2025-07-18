import express from "express"
import cors from "cors"  
import mongoose from "mongoose";
import config from "./config";
import { booksRouters } from "./modules/Books/books.controller";
import { borrowRouters } from "./modules/Borrow/borrow.controller";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", booksRouters);
app.use("/api/borrow", borrowRouters);

app.get('/', (req, res)=>{
    res.send("Welcome To Our Library")
})

app.listen(config.port, ()=>{
    console.log(`server is Running on port ${5000}`);   
});

async function server () {
    try {
        await mongoose.connect(config.database_url!)

        console.log(`Connected on Database`);
    } catch (error) {
        console.error(`server error ${server}`);
    }
};

server();