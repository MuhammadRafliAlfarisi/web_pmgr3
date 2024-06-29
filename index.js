import express from "express";
import configureMiddleware from "./config/middleware.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import auth from "./controller/auth.js";
import genres from "./controller/genres.js";
import books from "./controller/books.js";

import swaggerDocs from "./config/swagger.js";

dotenv.config();

const port = 3000;
const app = express();
configureMiddleware(app);

app.use(cookieParser());

app.use(auth);
app.use(genres);
app.use(books);

swaggerDocs(app, port);

app.listen(port, () => {
    console.log(`running server on port ${port}`);
});
