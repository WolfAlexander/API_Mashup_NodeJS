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
    return covers
        .filter(cover => cover) //removes undefined
        .map(cover => {
        return {albumId: cover.album_id, coverImage: cover.images[0].image};
    });
}