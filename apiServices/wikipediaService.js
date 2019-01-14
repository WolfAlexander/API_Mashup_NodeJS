import {retrieveArtistInformation} from "../apiClients/wikipediaClient";

/**
 * Retrieve artist description from Wikipedia
 * @param wikipediaArtistId - artist id acceptable at Wikipedia API
 * @returns {Promise<*>}
 */
export async function fetchArtistDescription(wikipediaArtistId) {
    let wikipediaData = await retrieveArtistInformation(wikipediaArtistId)
        .then(value => {return value.data;});

    return Object.values(wikipediaData.query.pages)[0].extract;
}