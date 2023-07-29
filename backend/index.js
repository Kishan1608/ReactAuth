import express from "express";
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from "dotenv";
import Users from './routes/users.js';

dotenv.config();
const app = express()
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDb")).catch(err => console.log(err));

app.use("/auth", Users);

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})