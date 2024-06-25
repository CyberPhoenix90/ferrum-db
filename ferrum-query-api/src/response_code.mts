export enum ResponseCode {
    // OK is returned when the request was successful.
    OK = 0,
    // NO_ACTION_TAKEN is returned when the request was successful but no action was taken/needed.
    NO_ACTION_TAKEN = 1,
    // NOT_FOUND is returned when the requested resource was not found.
    NOT_FOUND = 2,
    // ALREADY_EXISTS is returned when the creation of a resource failed because it already exists.
    ALREADY_EXISTS = 3,
    // INTERNAL_SERVER_ERROR is returned when an internal server error occurred.
    SERVER_ERROR = 4,
    // BAD_REQUEST_ERROR is returned when the request was malformed.
    REQUEST_ERROR = 5,
}
