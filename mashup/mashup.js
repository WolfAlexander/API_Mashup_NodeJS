import {MashupResponse} from "../MashupResponse";
import {HashMap} from "hashmap";
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
    let wikipediaArtistId = musicBrainzData.wikipediaArtistId;

    if(wikipediaArtistId === null){
        wikipediaArtistId = await fetchWikipediaArtistKey(musicBrainzData.wikidataArtistId);
    }

    return wikipediaArtistId;
}

async function getAlbums(musicBrainzData){
    const albums = new HashMap();
    const listOfAlbumIds = [];

    for (let albumDataKey in musicBrainzData.albums){
        const albumMusicBrainzData = musicBrainzData.albums[albumDataKey];

        const album = {title: albumMusicBrainzData.albumTitle, id: albumMusicBrainzData.albumId, image: null};
        albums.set(albumMusicBrainzData.albumId, album);
        listOfAlbumIds.push(albumMusicBrainzData.albumId);
    }

    const covers = await fetchAlbumCovers(listOfAlbumIds);

    for (let cover of covers) {
        const album = albums.get(cover.albumId);
        album.image = cover.coverImage;
    }

    return albums.values();
}
