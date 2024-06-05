//index file
import express from "express";
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

const app = express();


//setting cors
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:5173"],
        credentials: true,
    })
);


//one more middleware to use for video
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin'); //unhi origins ko allow kro jinko aap jante ho.
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(express.json()); //to get the json data into our server
app.use(express.urlencoded({ extended: true }));//to get the data as urlencoded form when data come in url it changes spaces are conterted to %20 
app.use("/uploads", express.static("uploads"));//to serve static files 



//multer middleware

const storage = multer.diskStorage({
    //destination and filename
    destination: function (req, file, cb) {
        cb(null, './uploads');//first para is error and 2nd is destination
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + uuidv4() + path.extname(file.originalname));//yeh filename rakh raha hai file.extname hamara file ka extension niklanega and usko concatenate kr dega.
    }
});



app.get('/', (req, res) => {
    res.json({ message: "Hello video server" });
});


app.listen(8080, (req, res) => {
    console.log('server is listening at port 8080....');
});