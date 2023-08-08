import bodyParser from "body-parser";
import express from "express";
import https from "https";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, function() {
    console.log("server is running on port 3000.")
})

app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
})