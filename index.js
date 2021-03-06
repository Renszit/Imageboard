const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config");

app.use(
    express.json({
        extended: false,
    })
);

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

// app.get('/more')

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    // console.log("req.body", req.body.title);
    if (req.file) {
        const singleImage = {
            title: req.body.title,
            url: `${s3Url}${req.file.filename}`,
            username: req.body.username,
            description: req.body.description,
            selected: req.body.selected,
        };
        db.putImage(
            singleImage.url,
            singleImage.username,
            singleImage.title,
            singleImage.description,
            singleImage.selected,
        )
            .then((result) => (singleImage.id = result.rows[0].id))
            .then(() => res.json(singleImage));
    } else {
        res.json({ success: false });
    }
});

app.get("/images", (req, res) => {
    db.receiveImages().then(({ rows }) => {
        res.json(rows);
    });
});

app.get("/imageId/:id", (req, res) => {
    const { id } = req.params;
    db.getSingleImage(id)
        .then((result) => {
            // console.log(res);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("error in image get", err);
        });
});

app.get("/comments/:id", (req, res) => {
    const { id } = req.params;
    // console.log("get request comments", id);
    db.getComments(id)
        .then((result) => {
            // console.log(result.rows[0]);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("err in comment get", err);
        });
});

app.post("/comments", (req, res) => {
    const { username, comment, id } = req.body;
    // console.log("db comment:", comment);
    db.postComments(comment, username, id)
        .then((result) => {
            // console.log(result);
            res.json(result.rows);
        })
        .catch((err) => console.log("error in posting comment", err));
});

app.get("/more/:id", (req, res) => {
    var lowestId = req.params.id;
    db.moreImages(lowestId)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.log("error in getting more images", err);
        });
});

app.use(express.static("public"));

app.listen(8080, () => console.log(`app listening on port 8080!`));
