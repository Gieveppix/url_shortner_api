import Randomstring from "randomstring"

export const appendToBaseUrl = (url: string) => {
  return `https://www.${url}`
}

export const generateShortUrl = (payload: any) => { //TODO: Remove any pls
  if (!payload.shortUrl) {
    return appendToBaseUrl(
      Randomstring.generate({
        length: payload.urlLength || 4,
        charset: payload.urlCharset || "alphanumeric",
        capitalization: payload.urlCapitalization || null,
    })) + ".com" // TODO: do something else here
  } else {
    return appendToBaseUrl(payload.shortUrl) + ".com" // TODO: do something else here
  }
}