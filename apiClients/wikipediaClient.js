import request from "request-promise";
import {RemoteApiError} from "../errorDefinitions";

const WIKIPEDIA_BASE_URL = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=";

/**
 * Receives information about an artist from Wikipedia
 * @param wikiArtistId - unique wikipedia API artist id
 * @returns complete wikipedia response or error object
 */
export async function retrieveArtistInformation(wikiArtistId) {
    let requestUri = WIKIPEDIA_BASE_URL + wikiArtistId;

    console.log(new Date() + ": Making request to Wikipedia API for wikiArtistId=" + wikiArtistId);

    try{
        const value = request({
            "method": "GET",
            "uri": requestUri,
            "json": true
        });

        console.log(new Date() + ": Successfully received data from Wikipedia for wikiArtistId=" + wikiArtistId);

        return {type: "success", data: value};
    }catch (e) {
        console.log(new Date() + ": Error while retrieving data from Wikipedia with wikiArtistId" + wikiArtistId);
        console.log(error);

        return new RemoteApiError(error, "Could not retrieve data from Wikipedia for artist " + wikiArtistId);
    }
}