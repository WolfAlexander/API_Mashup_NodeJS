import {retrieveAlbumCovers} from "../apiClients/coverArtArchiveClient";

/**
 * Retrieves cover images for given albums
 * @param listOfAlbumIds - album ids that are accepted by Art Achive API
 * @returns {Promise<Array>}
 */
export async function fetchAlbumCovers(listOfAlbumIds) {
    const covers = await retrieveAlbumCovers(listOfAlbumIds);

    return convertToCustomFormat(covers);
}

function convertToCustomFormat(covers) {
    const customCoverts = [];

    covers.forEach(function (cover) {
        if(cover !== null){
            customCoverts.push({albumId: cover.album_id, coverImage: cover.images[0].image});
        }
    });

    return customCoverts;
}