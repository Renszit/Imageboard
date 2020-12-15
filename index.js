const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads");
    },
    filename: (req, file, callback) => {
        uidSafe(24).then((uid) => {
            callback(null, `${uid}${path.extname(file.originalname)}`);
        });
    },
});

const uploader = multer({
    storage,
    limits: {
        // Set a file size limit to prevent users from uploading huge files and to protect against DOS attacks
        fileSize: 2097152,
    },
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    console.log("req.body", req.body.title);
    let title = req.body.title;
    let url = `${s3Url}${req.file.filename}`;
    let username = "rens";
    let description = "description";
    if (req.file) {
        db.putImage(url, username, title, description);
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.get("/images", (req, res) => {
    db.receiveImages().then(({ rows }) => {
        res.json(rows);
    });
});

app.use(express.static("public"));

app.listen(8080, () => console.log(`app listening on port 8080!`));
