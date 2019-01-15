import {retrieveMusicBrainzData} from "../apiClients/musicBrainzClient";

/**
 * Get data from MusicBrainz API
 * @param mbid - music brainz id for the data that needed to be fetched
 * @returns {Promise<{albums, wikidataArtistId, wikipediaArtistId}>}
 */
export async function fetchMusicBrainzData(mbid) {
    const musicBrainzOriginalResponse =  await retrieveMusicBrainzData(mbid).then(musicBrainzResponse => musicBrainzResponse.data);

    return convertToLocalFormat(musicBrainzOriginalResponse);
}

function convertToLocalFormat(musicBrainzOriginalResponse) {
    const wikipediaArtistId = getArtistIdForRelationType(musicBrainzOriginalResponse, "wikipedia");
    const wikidataArtistId = getArtistIdForRelationType(musicBrainzOriginalResponse, "wikidata");
    const albums = getAlbumData(musicBrainzOriginalResponse);

    return {wikipediaArtistId: wikipediaArtistId, wikidataArtistId: wikidataArtistId, albums: albums};
}

function getArtistIdForRelationType(musicBrainsOriginalResponse, desiredRelationName) {
    for (let relationsKey in musicBrainsOriginalResponse.relations) {
        const relation = musicBrainsOriginalResponse.relations[relationsKey];

        if(relation.type === desiredRelationName){
            const url = relation.url.resource;
            const indexOfArtistId = url.lastIndexOf("/") + 1;

            return url.substr(indexOfArtistId);
        }
    }

    return null;
}

function getAlbumData(musicBrainsOriginalResponse) {
    const albums = [];
    const releaseGroups = musicBrainsOriginalResponse["release-groups"];

    for (let releaseGroupKey in releaseGroups){
        const releaseGroup = releaseGroups[releaseGroupKey];

        albums.push({albumId: releaseGroup.id, albumTitle: releaseGroup.title})
    }

    return albums;
}