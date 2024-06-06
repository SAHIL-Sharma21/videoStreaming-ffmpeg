//index file
import express from "express";
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'//to handle file
import { exec } from 'child_process'; //use to execute the command. --> this is dangerous whatch out
import { stderr, stdout } from "process"

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

//multer configuration
const upload = multer({ storage: storage });



app.get('/', (req, res) => {
    res.json({ message: "Hello video server" });
});

//more route - for posting video only single file can be uploaded
app.post("/upload", upload.single('file'), (req, res) => {

    const lessonID = uuidv4(); //generasting lession id
    const videoPath = req.file.path;
    const outputPath = `./uploads/courses/${lessonID}`; //output path ka fiolder hai not the video path
    const hlsPath = `${outputPath}/index.m3u8`;//we are conveting video to hls--> which is outstiched video 
    console.log("hls Path:", hlsPath);


    //if folders nhi hai to folder create kremnge
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    //ffmpeg cmd
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}
    `


    //cmd run
    //this belwo code takes a lot of time and in production it runs on different sts of machine and there are queues which implemented in as youtube.
    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.log(`exec error: ${error}`);
        }

        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}}`);
        const videoUrl = `http://localhost:8080/uploads/courses/${lessonID}/index.m3u8`

        //sending response
        return res.status(200).json({
            message: "Video converted to HLS format",
            videoUrl: videoUrl,
            lessonID: lessonID,
        });
    });
});


app.listen(8080, (_) => {
    console.log('server is listening at port 8080....');
});