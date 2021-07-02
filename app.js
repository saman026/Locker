const express = require("express");
const connectDB = require("./config/db");
const orgDocsRouter = require("./routes/orgDocsRouter");
const globalError = require("./controllers/errorController");

const app = express();

connectDB();

app.use(express.json());


app.use("/api", orgDocsRouter);
app.use(globalError);

app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    })
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})