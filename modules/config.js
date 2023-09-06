import dotenv from "dotenv"
dotenv.config();

const lastfmKey = process.env.LASTFM_API_KEY;

export default { lastfmKey };