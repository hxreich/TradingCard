import bodyParser from "body-parser";
import express from "express";
import https from "https";
import dotenv from "dotenv";
import axios from "axios";


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


let lastfmData1;
let trackDataArrays;

const topTracksArrayofArrays = [];
app.get("/", function(req, res){
    //res.sendFile(__dirname+"/index.html");
    res.render("index.ejs", { lastfm: lastfmData1 });
});

app.post("/card", (req,res) => {
    console.log("Post request received");
    const query = req.body.fmUsername;
    const lastfmURLGetTopTracks = "https://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user="+query+"&api_key="+lastfmKey+"&format=json&limit=5";

    https.get(lastfmURLGetTopTracks, "JSON", function(response){
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
            lastfmData1 = JSON.parse(data);
            console.log(lastfmData1.toptracks.track[0].name);
            console.log(replaceSpacesWithPlus(lastfmData1.toptracks.track[0].name));
            //const track1 = lastfmData.toptracks.track[0].name;
            lastfmData1.toptracks.track.forEach(singleTrack=> {
                console.log("in first for loop!");
                //put artist and trackName in array
                const artist = replaceSpacesWithPlus(singleTrack.artist.name);
                //console.log(artist);
                const trackName = replaceSpacesWithPlus(singleTrack.name);
                //console.log(trackName);
                //enter artist and trackName into topTracksArrayofArrays
                topTracksArrayofArrays.push([trackName, artist]);   
            })
            console.log("finished first loop!");
            
            fetchTracks();

            res.redirect("/"); 
        });
    })
})

function replaceSpacesWithPlus(inputString) {
    return inputString.replace(/ /g, '+');
}

async function fetchDataForTracks(topTracksArrayofArrays) {
    console.log("in fetchDataForTracks!");
    const dataTrackArrays = [];
    for (const innerArry of topTracksArrayofArrays) {
        const trackName = innerArry[0];
        const artist = innerArry[1];
        const options = {
            hostname: "ws.audioscrobbler.com",
            path: "/2.0/?method=track.getInfo&api_key="+lastfmKey+"&artist="+artist+"&track="+trackName+"&format=json",
            method: "GET"
        }
        const data2 = await new Promise((resolve, reject) =>{
            const req = https.get(options, response => {
                let responseData = '';
                response.on("data", function(chunk){
                    if (!responseData) {
                        responseData = chunk;
                    }
                    else {
                        responseData += chunk;
                    }
                })
                response.on("end", function(){
                    resolve(JSON.parse(responseData));
                });
            });
            req.on("error", function(error){
                reject(error);
            });
        });
        dataTrackArrays.push(data2);
    }
    console.log("at the end of the fetch function!");
    return dataTrackArrays;
}

async function fetchTracks() {
    try {
        console.log("in the async function!");
        trackDataArrays = await fetchDataForTracks(topTracksArrayofArrays);
        console.log(trackDataArrays);
        for (const trackData of trackDataArrays) {
            const trackName = trackData.track.name;
            console.log("Track: "+trackName);
            const trackAlbum = trackData.track.album.title;
            console.log("Album: "+trackAlbum);
            const trackPlaycount = trackData.track.playcount;
            console.log("Playcount: "+trackPlaycount);
            const trackArtist = trackData.track.artist.name;
            console.log("Artist: "+trackArtist+"\n");   
        }
    } catch (error) {
        console.error("Error:", error);
    }
}