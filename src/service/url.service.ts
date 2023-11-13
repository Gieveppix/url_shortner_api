// import type { ApiResponse } from '../types/response.type';
import Randomstring from "randomstring"
import { Url, IUrl } from '../types/models';
import { ApiResponse, HttpStatusCode } from '../types/response.type';
import { appendToBaseUrl, generateShortUrl } from "../helpers/urlOps";
import { queryAndPaginateResults } from "../helpers/pagination";
import { returnNotFoundIfNull, returnUnauthorizedIfNotEqual } from "../middleware/handleResponse";

// TODO: Check causes and messages
class UrlService {
  async getAll(payload: {
    urlName?: IUrl['urlName'], 
    originalUrl?: IUrl["originalUrl"], 
    shortUrl?: IUrl['shortUrl'],
    page?: number
    perPage?: number 
  }): Promise<ApiResponse> {
    try {
      const { results, page, perPage, total } = await queryAndPaginateResults<IUrl>(Url, payload || {})
    
      return {
        status: 'success',
        code: HttpStatusCode.Ok,
        message: "Url retrieved successfully",
        data: {
          url: results,
          page,
          perPage,
          total
        }
      };
    } catch (error) {
      return {
        status: 'error',
        code: HttpStatusCode.InternalServerError,
        message: 'Internal server error',
        cause: 'server-error'
      };
    }
  }

  async getByUserId(
    userId: string | undefined,
    payload: { 
      urlName?: string;
      originalUrl?: string;
      shortUrl?: string;
      page?: number;
      perPage?: number;
    }
  ): Promise<ApiResponse> {
    try {
      const { results, page, perPage, total } = await queryAndPaginateResults<IUrl>(
        Url,
        { createdBy: userId, ...payload }
      );
  
      return {
        status: 'success',
        code: HttpStatusCode.Ok,
        message: "Urls retrieved successfully",
        data: {
          urls: results,
          page,
          perPage,
          total
        }
      };
    } catch (error) {
      return {
        status: 'error',
        code: HttpStatusCode.InternalServerError,
        message: 'Internal server error',
        cause: 'server-error'
      };
    }
  }  

  async getLongUrl(shortUrl: string): Promise<ApiResponse> {
    try {
      const existingUrl = await Url.findOne({ shortUrl });
  
      const notFound = returnNotFoundIfNull(existingUrl);
      if (notFound) return notFound

      return {
        status: 'success',
        code: HttpStatusCode.Ok,
        message: "Url added successfully",
        data: {
          originaUrl: existingUrl!.originalUrl
        }
      };      
    } catch (error) {
      return {
        status: 'error',
        code: HttpStatusCode.InternalServerError,
        message: 'Internal server error',
        cause: 'server-error',
      };
    }
  }

  async create(payload: {
    urlName: IUrl['urlName'], 
    createdBy: IUrl['createdBy'], 
    originalUrl: IUrl["originalUrl"], 
    shortUrl: IUrl['shortUrl'], 
    urlLength: number, 
    urlCharset: Randomstring.Charset, 
    urlCapitalization: Randomstring.Capitalization
  }): Promise<ApiResponse> {
    try {
      //TODO: Give option to either put in with https://....... or without
      payload.originalUrl = appendToBaseUrl(payload.originalUrl)
      payload.shortUrl = generateShortUrl(payload)
      
      const exists = await Url.findOne({ 
        shortUrl: payload.shortUrl
      })

      if (exists) {
        return {
          status: 'success',
          code: HttpStatusCode.Ok,
          message: 'Url with that short name already exists',
        };
      }

      const { urlLength, urlCharset, urlCapitalization, ...urlObject } = payload
      
      const url = new Url(urlObject)      
      
      await url.save()
      
      return {
        status: 'success',
        code: HttpStatusCode.Ok,
        message: "Url added successfully",
        data: {
          url: urlObject
        }
      };
    } catch (error) {
      return {
        status: 'error',
        code: HttpStatusCode.InternalServerError,
        message: 'Internal server error',
        cause: 'server-error'
      };
    }
  }

  async edit(
    userId: string | undefined,
    urlId: string,
    payload: Partial<IUrl>
  ): Promise<ApiResponse> {
    try {
      const existingUrl = await Url.findById(urlId);


      const notFound = returnNotFoundIfNull(existingUrl);
      if (notFound) return notFound

      // Check if the url was created by the user that wants to modify it
      // ! because the null case is handled in the function above
      const unauthorized = returnUnauthorizedIfNotEqual(existingUrl!.createdBy, userId)
      if (unauthorized) return unauthorized;

      // Loop through each field in the payload and update if provided
      for (const field in payload) {
        if (payload[field as keyof IUrl]) {
          // This is probably not good, but hey no ts-errors
          (existingUrl![field as keyof IUrl] as IUrl[keyof IUrl]) = payload[field as keyof IUrl] as IUrl[keyof IUrl]; 
        }
      }
  
      await existingUrl!.save();
  
      return {
        status: 'success',
        code: HttpStatusCode.Ok,
        message: 'URL updated successfully',
        data: { updatedUrl: existingUrl },
      };
    } catch (error) {
      return {
        status: 'error',
        code: HttpStatusCode.InternalServerError,
        message: 'Internal server error',
        cause: 'server-error',
      };
    }
  }

  async delete(userId: string | undefined, urlId: string): Promise<ApiResponse> {
    try {
      const existingUrl = await Url.findById(urlId);
  
      const notFound = returnNotFoundIfNull(existingUrl);
      if (notFound) return notFound;

      // Check if the url was created by the user that wants to delete it
      // ! because the null case is handled in the function above
      const unauthorized = returnUnauthorizedIfNotEqual(existingUrl!.createdBy, userId)
      if (unauthorized) return unauthorized;
  
      existingUrl!.deletedAt = new Date();
      await existingUrl!.save(); 

      return {
        status: 'success',
        code: HttpStatusCode.Ok,
        message: 'URL deleted successfully',
        data: { deletedUrl: existingUrl },
      };
    } catch (error) {
      return {
        status: 'error',
        code: HttpStatusCode.InternalServerError,
        message: 'Internal server error',
        cause: 'server-error',
      };
    }
  } 
}

export default new UrlService();
