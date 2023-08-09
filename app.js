import bodyParser from "body-parser";
import express from "express";
import https from "https";
import dotenv from "dotenv";


import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
dotenv.config();
app.use(express.static("public"));
const lastfmKey = process.env.LASTFM_API_KEY;


app.use(bodyParser.urlencoded({extended: true}));


app.listen(3000, function() {
    console.log("server is running on port 3000.")
})

let lastfmData;
app.get("/", function(req, res){
    //res.sendFile(__dirname+"/index.html");
    res.render("index.ejs", { lastfm: lastfmData });
});

app.post("/card", (req,res) => {
    console.log("Post request received");
    const query = req.body.fmUsername;
    const lastfmURL = "https://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user="+query+"&api_key="+lastfmKey+"&format=json&limit=5";
    https.get(lastfmURL, "JSON", function(response){
        console.log(response.statusCode);
        var data;
        response.on("data", function(chunk){
            if (!data) {
                data = chunk;
            }
            else {
                data += chunk;
            }
        });
        response.on("end", function() {
            lastfmData = JSON.parse(data);
            console.log(lastfmData);
            //const track1 = lastfmData.toptracks.track[0].name;
            //res.write("<p> The number one track is "+track1+".</p>");
            res.redirect("/"); 
        });
    })
})