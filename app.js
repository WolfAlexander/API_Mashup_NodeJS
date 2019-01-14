import express from 'express';
import {mashupArtistData} from "./mashup/mashup";

const app =  express();
const SERVER_PORT = 8080;

/**
 * Listen to certain port
 */
app.listen(SERVER_PORT, () => {
   console.log(new Date() + ": Server listening on port " + SERVER_PORT);
});

/**
 * Get artist and album information by MBID
 */
app.get("/api/v1/artist", (req, res) => {
    let mbid = req.query.mbid;
    console.log(new Date() + ": Received request to /api/v1/artist with MBID" + mbid)

    mashupArtistData(mbid)
        .then(value => {
            console.log(new Date() + ": Successful response to user for request MBID=" + mbid);
            res.status(200).send(value)
        })
        .catch(error => {
            console.log(new Date() + " " + error);
            res.status(500).send(error);
        });
});