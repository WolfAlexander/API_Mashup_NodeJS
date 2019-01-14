import request from "request-promise";
import {RemoteApiError} from "../errorDefinitions";

const MUSIC_BRAINZ_BASE_URL = "http://musicbrainz.org/ws/2/artist/";
const MUSIC_BRAINZ_ADDITIONAL_PARAMS = "?&fmt=json&inc=url-rels+release-groups";

/**
 * Retrieves information about an artist from
 * MusicBrainz API
 * @param mbid - MusicBrainz artist id
 * @returns {Promise<*>}
 */
export async function retrieveMusicBrainzData(mbid) {
    let musicBrainzUrl = MUSIC_BRAINZ_BASE_URL + mbid + MUSIC_BRAINZ_ADDITIONAL_PARAMS;

    console.log(new Date() + ": Making request to MusicBrainz API with MBID=" + mbid);

    try {
        const value = request({
            "method": "GET",
            "uri": musicBrainzUrl,
            "json":true,
            headers: {
                'User-Agent': 'Request-Promise'
            }
        });

        console.log(new Date() + ": Successfully received data from MusicBrainz API for MBID=" + mbid);

        return {type: "success", data: value};
    } catch (error) {
        console.log(new Date() + ": Error while retrieving data from MusicBrainz API with MBID=" + mbid);
        console.log(error);

        return new RemoteApiError(error, "Could not retrieve data for MBID=" + mbid);
    }
}
