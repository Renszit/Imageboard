const express = require("express");
const app = express();
const db = require("./db");
app.use(express.static("public"));

app.get("/images", (req, res) => {
    db.receiveImages().then(({ rows }) => {
        // console.log(rows);
        res.json(rows);
    });
});

app.listen(8080, () => console.log(`app listening on port 8080!`));
