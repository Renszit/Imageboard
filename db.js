var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:rens:imageboard@localhost:5432/imageboard"
);

module.exports.receiveImages = () => {
    const q = `SELECT *
    FROM images 
    ORDER BY created_at DESC
    LIMIT 12`;
    return db.query(q);
};

module.exports.putImage = (url, username, title, description) => {
    const q = `INSERT INTO images(url,username,title,description)
    VALUES ($1,$2,$3,$4)
    RETURNING id`;
    const param = [url, username, title, description];
    return db.query(q, param);
};
