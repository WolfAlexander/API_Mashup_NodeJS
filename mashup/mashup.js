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
    let musicBrainzData = await fetchMusicBrainzData(mbid);
    let artistDescription = null;
    let albums = [];

    await Promise.all([getArtistDescription(musicBrainzData), getAlbums(musicBrainzData)])
        .then(responses => {
            artistDescription = responses[0];
            albums = responses[1];
        });

    return new MashupResponse(mbid, artistDescription, albums);
}

async function getArtistDescription(musicBrainzData){
    let wikipediaArtistId = await fetchWikipediaArtistId(musicBrainzData);

    return await fetchArtistDescription(wikipediaArtistId);
}

async function fetchWikipediaArtistId(musicBrainzData){
    let wikipediaArtistId = musicBrainzData.wikipediaArtistId;

    if(wikipediaArtistId === null){
        wikipediaArtistId = await fetchWikipediaArtistKey(musicBrainzData.wikidataArtistId);
    }

    return wikipediaArtistId;
}

async function getAlbums(musicBrainzData){
    let albums = new HashMap();
    let listOfAlbumIds = [];

    for (let albumDataKey in musicBrainzData.albums){
        let albumMusicBrainzData = musicBrainzData.albums[albumDataKey];

        let album = {title: albumMusicBrainzData.albumTitle, id: albumMusicBrainzData.albumId, image: null};
        albums.set(albumMusicBrainzData.albumId, album);
        listOfAlbumIds.push(albumMusicBrainzData.albumId);
    }

    let covers = await fetchAlbumCovers(listOfAlbumIds);

    for (let cover of covers) {
        let album = albums.get(cover.albumId);
        album.image = cover.coverImage;
    }

    return albums.values();
}
