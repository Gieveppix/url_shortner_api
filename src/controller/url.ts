import { Request, Response } from 'express';
import UrlService from '../service/url';
import { IUrl, IUser } from '../models';
import { GenerateOptions  } from 'randomstring';
import { ApiResponse } from '../types';
import { HandleController } from '../middleware/errorCodes';

//TODO: move types to types folder
export type CreateUrl = {
  urlName: IUrl['urlName'], 
  originalUrl: IUrl["originalUrl"], 
  createdBy: IUrl['createdBy'], 
  shortUrl?: IUrl['shortUrl'], 
  length?: GenerateOptions['length'], 
  charset?: GenerateOptions['charset'], 
  capitalization?: GenerateOptions['capitalization']
}

export type GetUrlQuery = {
  urlName?: IUrl['urlName'], 
  originalUrl?: IUrl["originalUrl"], 
  shortUrl?: IUrl['shortUrl'],
}

export type GetUrlQueryWithPagination = GetUrlQuery & {
  page?: number,
  perPage?: number
}

class UrlController {
  @HandleController
  async create(req: Request, res: Response): Promise<ApiResponse | void> {
    const url: CreateUrl = {
      urlName: req.body.urlName,
      createdBy: req.user?._id,
      originalUrl: req.body.originalUrl,
      shortUrl: req.body.shortUrl,
      length: req.body.urlLength, 
      charset: req.body.urlCharset,
      capitalization: req.body.urlCapitalization
    }
     // TODO: TEST EVERY CONTROLLER THAT IT RETURNS
     return UrlService.create(url);
  }

  @HandleController
  async getAll(req: Request, res: Response): Promise<ApiResponse | void> {
    const query: GetUrlQueryWithPagination = req.query

    return UrlService.getAll(query);
  }

  @HandleController
  async getByUserId(req: Request, res: Response): Promise<ApiResponse | void> {
    const userId: IUser['_id'] = req.user?._id;
    const body: GetUrlQueryWithPagination = req.body;

    return UrlService.getByUserId(userId, body);
    
  }

  @HandleController
  async getLongUrl(req: Request, res: Response): Promise<ApiResponse | void> {
    const shortUrl: IUrl['shortUrl'] = req.body.shortUrl;

    return UrlService.getLongUrl(shortUrl);
  }

  @HandleController
  async edit(req: Request, res: Response): Promise<ApiResponse | void> {
    const userId: IUser['_id'] = req.user?._id;
    const urlId: IUrl['_id'] = req.params.url_id;

    const body: GetUrlQuery = req.body
  
    return UrlService.edit(userId, urlId, body);
  }

  @HandleController
  async delete(req: Request, res: Response): Promise<ApiResponse | void> {
    const userId = req.user?._id;
    const urlId = req.params.url_id;
  
    return UrlService.delete(userId, urlId);
  }
  
  
}

export default new UrlController();
