import {retrieveMusicBrainzData} from "../apiClients/musicBrainzClient";

/**
 * Get data from MusicBrainz API
 * @param mbid - music brainz id for the data that needed to be fetched
 * @returns {Promise<{albums, wikidataArtistId, wikipediaArtistId}>}
 */
export async function fetchMusicBrainzData(mbid) {
    let musicBrainzOriginalResponse =  await retrieveMusicBrainzData(mbid).then(musicBrainzResponse => musicBrainzResponse.data);

    return convertToLocalFormat(musicBrainzOriginalResponse);
}

function convertToLocalFormat(musicBrainzOriginalResponse) {
    let wikipediaArtistId = getArtistIdForRelationType(musicBrainzOriginalResponse, "wikipedia");
    let wikidataArtistId = getArtistIdForRelationType(musicBrainzOriginalResponse, "wikidata");
    let albums = getAlbumData(musicBrainzOriginalResponse);

    return {wikipediaArtistId: wikipediaArtistId, wikidataArtistId: wikidataArtistId, albums: albums};
}

function getArtistIdForRelationType(musicBrainsOriginalResponse, desiredRelationName) {
    for (let relationsKey in musicBrainsOriginalResponse.relations) {
        let node = musicBrainsOriginalResponse.relations[relationsKey];

        if(node.type === desiredRelationName){
            let url = node.url.resource;
            let indexOf = url.lastIndexOf("/") + 1;

            return url.substr(indexOf);
        }
    }

    return null;
}

function getAlbumData(musicBrainsOriginalResponse) {
    let albums = [];
    let releaseGroups = musicBrainsOriginalResponse["release-groups"];

    for (let releaseGroupKey in releaseGroups){
        let releaseGroup = releaseGroups[releaseGroupKey];

        albums.push({albumId: releaseGroup.id, albumTitle: releaseGroup.title})
    }

    return albums;
}