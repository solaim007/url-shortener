const express = require("express");
const dotenv = require("dotenv")
dotenv.config();

const { URL } = require("./models/url");

const path = require("path");

const cookieParser = require("cookie-parser");

const { restrictToLoggedInUserOnly, checkAuth } = require("./middleware/auth");

const URLRoute = require("./Routes/url");

const staticRoute = require("./Routes/staticRouter")

const UserRoute = require("./Routes/user");




const app = express();

const PORT =process.env.PORT;
const URI = process.env.URI;

const { connectToMongoDb } = require("./connect");

connectToMongoDb(URI)

    .then(() => {

        console.log("MongoDb Connected Sucessfully");

    }).catch((err) => {

        console.log("error", err);

    });

app.set("view engine", "ejs");

app.set("views", path.resolve("./views"));

app.use(express.json());

app.use(express.urlencoded({ extended: false }))

app.use(cookieParser());

app.use("/url", restrictToLoggedInUserOnly, URLRoute);

app.use("/user", UserRoute);

app.use("/", checkAuth, staticRoute);

app.get("/:shortId", async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate(
            {
                shortId,
            },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            }
        );

        if (!entry) {
            // If entry is not found, send a 404 Not Found response
            return res.status(404).send("URL not found");
        }

        // Redirect to the original URL
        res.redirect(entry.redirectURL);
    } catch (error) {
        // Handle any errors that occur during the execution of the route
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(PORT, () => {
    console.log(`Server is Running at ${PORT}`);
})