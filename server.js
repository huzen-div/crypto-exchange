const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
//Drop and re-sync db.
db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to crypto application." });
});

const PORT = process.env.PORT || 8090;

require("./app/routes/user.routes")(app);
require("./app/routes/treasure.routes")(app);
require("./app/routes/transfer.routes")(app);
require("./app/routes/sell.routes")(app);
require("./app/routes/buy.routes")(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});