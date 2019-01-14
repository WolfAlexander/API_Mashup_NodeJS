import {retrieveWikidataData} from "../apiClients/wikidataClient";

/**
 * Retrives wikipedia artist id using wikidata API
 * @param wikidataArtistId
 * @returns {Promise<*>}
 */
export async function fetchWikipediaArtistKey(wikidataArtistId) {
    let wikidataOriginalResponse = await retrieveWikidataData(wikidataArtistId)
        .then(wikidataResponse => {return wikidataResponse.data;});

    let title = wikidataOriginalResponse.entities[wikidataArtistId].sitelinks.enwiki.title;

    return convertToWikipediaKey(title);
}

function convertToWikipediaKey(wikipediaTitle){
    return wikipediaTitle.replace(" ", "_");
}