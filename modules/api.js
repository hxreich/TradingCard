import https from "https";
import config from "./config.js";

let lastfmKey = config.lastfmKey;

const apiFunctions = {
    async fetchLastfmTopTracks(userName, period) {
        // Last.fm API URL
        console.log("in fetchLastfmTopTracks function");
        console.log(userName, period);
        const lastfmURLGetTopTracks = `https://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=${userName}&api_key=${lastfmKey}&period=${period}&format=json&limit=5`;
    
        // Return a Promise from the API request
        return new Promise((resolve, reject) => {
            // Send an HTTP GET request to the Last.fm API
            https.get(lastfmURLGetTopTracks, (response) => {
                let data = '';
                // listen for incoming data
                response.on('data', (chunk) => {
                    data += chunk;
                });
    
                // Handle the end of the reponse
                response.on('end', () => {
                    try {
                        const apiResponse = JSON.parse(data);
                        console.log(apiResponse);
                        resolve(apiResponse);
                    } catch (error) {
                        reject(error);
                    }
                });
            }).on('error', (error) => {
                reject(error);
            });
        })
    },
};


export default apiFunctions;