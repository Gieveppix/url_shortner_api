import Randomstring from "randomstring"
import { IUser, IUrl, ApiResponse, HttpStatusCode, CreateUrl, GetUrlQuery, GetUrlQueryWithPagination, PaginatedUrlPayload, PaginatedUrlResult } from '../types';
import { Url } from '../models';
import { Document, FilterQuery } from 'mongoose';
import { HandleService } from "../utils";

// TODO: Check causes and messages
class UrlService {
  @HandleService
  async create(payload: CreateUrl): Promise<ApiResponse> {
    const data: CreateUrl = payload
    data.originalUrl = this.formatUrl(data.originalUrl)
    data.shortUrl = this.generateShortUrl(data)
    
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
    const { results, page, perPage, total } = await this.queryAndPaginateResults<IUrl>(Url, payload || {})
  
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
    const { results, page, perPage, total } = await this.queryAndPaginateResults<IUrl>(
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
    
    if(!existingUrl) {
      throw "URL_NOT_FOUND"
    }

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

  // TODO: Validate the page and per page that they have to be positive and not equal to 0
  async queryAndPaginateResults<T extends Document>(
    model: any,
    payload: PaginatedUrlPayload<T>,
  ): Promise<PaginatedUrlResult> {
    const { page, perPage, userId, ...rest } = payload;

    const query: FilterQuery<T> = {};

    Object.entries(rest).forEach(([key, value]) => {
      if (value) {
        query[key as keyof FilterQuery<T>] = { $regex: new RegExp(value as string, "i") };
      }
    });

    if (userId) {
      query['createdBy' as keyof FilterQuery<T>] = userId;
    }

    let results, total;

    total = await model.countDocuments(query, {});

    if (page !== undefined && perPage !== undefined) {
      results = await model.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage);
    } else {
      results = await model.find(query);
    }

    return { results, page: Number(page) || null, perPage: Number(perPage) || null, total };
  }



  // TODO: Remove any
  generateShortUrl = (payload: any) => { // TODO: Remove any, use specific types
    if (!payload.shortUrl) {
      // If shortUrl is not provided, generate a random string
      const randomString = Randomstring.generate({
        length: payload.length || 4,
        charset: payload.charset || "alphanumeric",
        capitalization: payload.capitalization || null,
      });
  
      // Append the default extension .com
      return `https://www.${randomString}` + ".com";
    } else {
      // If shortUrl is provided, format it using the helper function
      return this.formatUrl(payload.shortUrl);
    }
  }

  formatUrl(shortUrl: string): string {
    let formattedUrl = shortUrl.trim(); // Trim any leading/trailing whitespace
  
    // Check if the URL contains a protocol (http:// or https://)
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      // Check if the URL has a valid domain extension (e.g., .com, .co)
      if (!/\.[a-z]{2,}$/i.test(formattedUrl)) {
        formattedUrl += ".com";
      }
  
      // Check if the URL contains a www prefix
      if (!formattedUrl.startsWith('www.')) {
        // Prepend the protocol and www prefix
        formattedUrl = `https://www.${formattedUrl}`;
      }
    }
  
    return formattedUrl;
  }
}

export default new UrlService();
