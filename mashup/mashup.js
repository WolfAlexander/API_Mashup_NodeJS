import {MashupResponse} from "../MashupResponse";
import {fetchMusicBrainzData} from "../apiServices/musicBrainzService";
import {fetchWikipediaArtistKey} from "../apiServices/wikidataService";
import {fetchArtistDescription} from "../apiServices/wikipediaService";
import {fetchAlbumCovers} from "../apiServices/coverArtArchiveService";

/**
 * Putting together information about an artist from
 * different sources
 * @param mbid - MusicBrainz artist id
 * @returns {Promise<MashupResponse>}
 */
export async function mashupArtistData(mbid) {
    const musicBrainzData = await fetchMusicBrainzData(mbid);
    const apiResponses = await Promise.all([getArtistDescription(musicBrainzData), getAlbums(musicBrainzData)]);

    return new MashupResponse({mbid, description: apiResponses[0], albums: apiResponses[1]});
}

async function getArtistDescription(musicBrainzData){
    const wikipediaArtistId = await fetchWikipediaArtistId(musicBrainzData);

    return fetchArtistDescription(wikipediaArtistId);
}

async function fetchWikipediaArtistId(musicBrainzData){
    return  musicBrainzData.wikipediaArtistId || await fetchWikipediaArtistKey(musicBrainzData.wikidataArtistId);
}

async function getAlbums(musicBrainzData){
    const albums = getAlbumsWithoutCovers(musicBrainzData);
    const covers = await fetchAlbumCovers(Object.keys(albums));

    covers.forEach(cover => {
        albums[cover.albumId].image = cover.coverImage;
    });

    return albums;
}

function getAlbumsWithoutCovers(musicBrainzData) {
    return musicBrainzData.albums
        .map(albumMusicBrainzData => {
            return {title: albumMusicBrainzData.albumTitle, id: albumMusicBrainzData.albumId, image: null};
        }).reduce((accum, currentVal) => {
            accum[currentVal.id] = currentVal;
            return accum;
        }, {});
}
