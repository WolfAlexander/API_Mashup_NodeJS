import {retrieveMusicBrainzData} from "../apiClients/musicBrainzClient";

/**
 * Get data from MusicBrainz API
 * @param mbid - music brainz id for the data that needed to be fetched
 * @returns {Promise<{albums, wikidataArtistId, wikipediaArtistId}>}
 */
export async function fetchMusicBrainzData(mbid) {
    const musicBrainzOriginalResponse =  await retrieveMusicBrainzData(mbid);;

    return convertToLocalFormat(musicBrainzOriginalResponse);
}

function convertToLocalFormat(musicBrainzOriginalResponse) {
    return {
        wikipediaArtistId: getArtistIdForRelationType(musicBrainzOriginalResponse, "wikipedia"),
        wikidataArtistId: getArtistIdForRelationType(musicBrainzOriginalResponse, "wikidata"),
        albums: getAlbumData(musicBrainzOriginalResponse)
    };
}

function getArtistIdForRelationType(musicBrainsOriginalResponse, desiredRelationName) {
    return musicBrainsOriginalResponse.relations
        .filter(relation => relation.type === desiredRelationName)
        .map(relation => relation.url.resource)
        .map(url => {
            const indexOfArtistId = url.lastIndexOf("/") + 1;

            return url.substr(indexOfArtistId);
        }).find(value => value);
}

function getAlbumData(musicBrainsOriginalResponse) {
    return musicBrainsOriginalResponse["release-groups"]
        .map(releaseGroup => {
            return {albumId: releaseGroup.id, albumTitle: releaseGroup.title};
        });
}