import express from "express";
import cors from "cors";
import bootstrap from "./src/bootstrap.js";
import fs from "fs"

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

bootstrap(app, express);


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

