import {retrieveArtistInformation} from "../apiClients/wikipediaClient";

/**
 * Retrieve artist description from Wikipedia
 * @param wikipediaArtistId - artist id acceptable at Wikipedia API
 * @returns {Promise<*>}
 */
export async function fetchArtistDescription(wikipediaArtistId) {
    const wikipediaData = await retrieveArtistInformation(wikipediaArtistId);

    return Object.values(wikipediaData.query.pages)[0].extract;
}