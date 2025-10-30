require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./config/passport");

const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:3000", 
            "https://image-search-app-client.vercel.app",
            process.env.CLIENT_ORIGIN
        ].filter(Boolean),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    })
);

app.use(
    cookieSession({
        name: "session",
        keys: [process.env.SESSION_SECRET || "secretkey"],
        maxAge: 24 * 60 * 60 * 1000,
        // sameSite: "none",
        // secure: false, 
    })
);

app.use((req, res, next) => {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb) => cb();
        req.session.save = (cb) => cb();
    }
    next();
});

app.use(passport.initialize());
app.use(passport.session());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo connected"))
    .catch((err) => console.error(err));

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));