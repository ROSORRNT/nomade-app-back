class HttpError extends Error {
  constructor(message, errorCode) {
    // Add a "message" prop herited from the parent constructor
    super(message)
    // Add a "code" property
    this.code = errorCode
  }
}

module.exports = HttpError
