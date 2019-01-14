/**
 * Definition of error message that should be used when catching exception from
 * remote API
 * @param error - original error object
 * @param customErrorMessage - custom error messages, will be sent to the user
 * @constructor
 */
export function RemoteApiError(error, customErrorMessage) {
    this.error = error;
    this.customErrorMessage = customErrorMessage;
}