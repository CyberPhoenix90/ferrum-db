export enum SuccessResponseCode {
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
    // TIMEOUT_ERROR is returned when the request timed out.
    TIMEOUT_ERROR = 6,
    // NETWORK_ERROR is returned when a network error occurred.
    NETWORK_ERROR = 7,
}

export enum QueryResponseEncoding {
    TEXT_PLAIN = 0,
    TEXT_JSON = 1,
    TEXT_BASE64 = 2,
    NULL = 3,
}

export enum QueryResponsePartType {
    DEBUG_PORT = 0,
    CHUNK = 1,
    FINAL = 2,
}
