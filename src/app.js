const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const schoolRoutes = require("./routes/schoolRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", schoolRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the School Management API!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
