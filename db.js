var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:rens:imageboard@localhost:5432/imageboard"
);

module.exports.receiveImages = () => {
    const q = `SELECT *
    FROM images 
    ORDER BY id DESC
    LIMIT 8`;
    return db.query(q);
};

module.exports.getSingleImage = (id) => {
    const q = `SELECT * FROM images WHERE id= $1`;
    const param = [id];
    return db.query(q, param);
};

module.exports.putImage = (url, username, title, description) => {
    const q = `INSERT INTO images(url,username,title,description)
    VALUES ($1,$2,$3,$4)
    RETURNING id`;
    const param = [url, username, title, description];
    return db.query(q, param);
};

module.exports.moreImages = (lowestId) => {
    const q = `SELECT *, (
        SELECT id FROM images 
        ORDER by id ASC
        LIMIT 1 
        ) AS lowest_id FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 4`;
    const param = [lowestId];
    return db.query(q,param);     
};