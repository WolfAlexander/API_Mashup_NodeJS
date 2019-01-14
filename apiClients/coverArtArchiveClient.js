import request from "request-promise";

const COVER_ART_ARCHIVE_BASE_URL = "http://coverartarchive.org/release-group/";

/**
 * Retrieves multiple album covers from Cover Art API
 * @param listOfAlbumIds - list of unique Cover Art album ids
 * @returns {Promise<any[]>}
 */
export async function retrieveAlbumCovers(listOfAlbumIds) {
    let listOfRequestUrls = [];
    let numberOfUnsuccessfulRequests = 0;

    console.log(new Date() + ": Creating Album Cover API request URLs for " + listOfAlbumIds.length + " album ids")

    listOfAlbumIds.forEach((albumId) => {
        let requestUrl = COVER_ART_ARCHIVE_BASE_URL + albumId;
        listOfRequestUrls.push(requestUrl);
    });

    console.log(new Date() + ": Requesting album covers for given album ids: " + listOfAlbumIds)
    return Promise.all(
        listOfRequestUrls
            .map(requestAsync)
            .map(p => p.catch(error => {
                numberOfUnsuccessfulRequests++;
                return null;
            }))
    ).finally(() => console.log("All requests to Art Cover API are done: " + (listOfAlbumIds.length - numberOfUnsuccessfulRequests) + " successful responses of " + listOfAlbumIds.length));
}

const requestAsync = function(url){
    return new Promise((resolve, reject) => {
        request(url, (err, response, body) => {
            if(err || 200 !== response.statusCode){
                reject(response.statusCode);
            }else{
                let albumCoverInformation = JSON.parse(body);
                albumCoverInformation.album_id = url.substring(url.lastIndexOf("/")+1);

                resolve(albumCoverInformation);
            }
        }).catch(error => {
            console.log(new Date() + ": Failed request for album cover, url=" + url);
            console.log(error.message);
        });
    });
};