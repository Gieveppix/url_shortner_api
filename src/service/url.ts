import { Url, IUrl } from '../models';
import { ApiResponse, HttpStatusCode } from '../types/response';
import { appendToBaseUrl, generateShortUrl } from "../helpers/urlOps";
import { queryAndPaginateResults } from "../helpers/pagination";
import { returnNotFoundIfNull, returnUnauthorizedIfNotEqual } from "../middleware/handleResponse";
import { CreateUrl, GetUrlQuery, GetUrlQueryWithPagination } from '../controller/url';
import { HandleService } from '../middleware/errorCodes';
import { IUser } from '../models';

// TODO: Check causes and messages
class UrlService {
  @HandleService
  async create(payload: CreateUrl): Promise<ApiResponse> {
    //TODO: Give option to either put in with https://....... or without
    const data: CreateUrl = payload
    data.originalUrl = appendToBaseUrl(data.originalUrl)
    data.shortUrl = generateShortUrl(data)
    
    const exists = await Url.findOne({ 
      shortUrl: data.shortUrl
    })

    if (exists) {
      throw "URL_EXISTS"
    }

    const { length, charset, capitalization, ...urlObject } = data
    
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
  }

  @HandleService
  async getAll(payload: GetUrlQueryWithPagination): Promise<ApiResponse> {
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
  }

  @HandleService
  async getByUserId(userId: IUser['id'], payload: GetUrlQueryWithPagination): Promise<ApiResponse> {
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
  }  

  @HandleService
  async getLongUrl(shortUrl: IUrl['shortUrl']): Promise<ApiResponse> {
    const existingUrl = await Url.findOne({ shortUrl });

    //TODO: remove
    const notFound = returnNotFoundIfNull(existingUrl, 'URL not found');
    if (notFound) return notFound

    return {
      status: 'success',
      code: HttpStatusCode.Ok,
      message: "Url added successfully",
      data: {
        originalUrl: existingUrl!.originalUrl
      }
    };       
  }

  @HandleService
  async edit(
    userId: IUser['_id'],
    urlId: IUrl['_id'],
    payload: GetUrlQuery
  ): Promise<ApiResponse> {
    const existingUrl = await Url.findById(urlId);

    if(!existingUrl) {
      throw 'URL_NOT_FOUND'
    }

    if(existingUrl.createdAt !== userId) {
      throw 'PERMISSION_DENIED'
    }

    // Loop through each field in the payload and update if provided
    for (const field in payload) {
      if (payload[field as keyof GetUrlQuery]) {
        // This is probably not good, but hey no ts-errors
        (existingUrl[field as keyof IUrl] as IUrl[keyof IUrl]) = payload[field as keyof GetUrlQuery] as IUrl[keyof IUrl]; 
      }
    }

    await existingUrl.save();

    return {
      status: 'success',
      code: HttpStatusCode.Ok,
      message: 'URL updated successfully',
      data: { updatedUrl: existingUrl },
    };
  }
    
  @HandleService
  async delete(userId: IUser['_id'], urlId: IUrl['_id']): Promise<ApiResponse> {
    const existingUrl = await Url.findById(urlId);
     
    if(!existingUrl) {
      throw 'URL_NOT_FOUND'
    }

    if(existingUrl.createdAt !== userId) {
      throw 'PERMISSION_DENIED'
    }

    existingUrl.deletedAt = new Date();

    await existingUrl.save(); 

    return {
      status: 'success',
      code: HttpStatusCode.Ok,
      message: 'URL deleted successfully',
      data: { deletedUrl: existingUrl },
    };
  } 
}

export default new UrlService();
