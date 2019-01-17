import request from "request-promise";
import {RemoteApiError} from "../errorDefinitions";

const WIKIDATA_BASE_URL = "https://www.wikidata.org/w/api.php?action=wbgetentities&ids=";
const WIKIDATA_ADDITIONAL_URL_PARAMS = "&format=json&props=sitelinks";

/**
 * Retrieves data from
 * @param itemId
 * @returns {Promise<*>}
 */
export async function retrieveWikidataData(itemId) {
    console.log(new Date() + ": Making request to Wikidata API with itemId=" + itemId);

    try{
        const response = request({
            "method": "GET",
            "uri": WIKIDATA_BASE_URL + itemId + WIKIDATA_ADDITIONAL_URL_PARAMS,
            "json":true
        });

        console.log(new Date() + ": Successfully received data from  Wikidata API for itemId=" + itemId);

       return response;
    }catch (e) {
        console.log(new Date() + ": Error while retrieving data from Wikidata API with itemId=" + itemId);
        console.log(error);

        return new RemoteApiError(error, "Could not retrieve data from Wikidata for itemId=" + itemId);
    }
}