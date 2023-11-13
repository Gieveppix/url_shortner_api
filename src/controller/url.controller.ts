import { Request, Response } from 'express';
import UrlService from '../service/url.service';
import { handleResponse } from '../middleware';

class UrlController {
  async create(req: Request, res: Response): Promise<void> {
    const result = await UrlService.create({
      urlName: req.body.urlName,
      createdBy: req.user?._id,
      originalUrl: req.body.originalUrl, // TODO: Has to contain .{something}/ or end with .{something}
      shortUrl: req.body.shortUrl, // TODO: Has to contain .{something}/ or end with .{something}
      urlLength: req.body.urlLength, 
      urlCharset: req.body.urlCharset, // TODO: Validate so there is no spaces and that the types align
      urlCapitalization: req.body.urlCapitalization
    });
    handleResponse(result, res);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { urlName, originalUrl, shortUrl, page, perPage } = req.query as { 
      urlName?: string, 
      originalUrl?: string, 
      shortUrl?: string
      page?: number
      perPage?: number
    };

    const result = await UrlService.getAll({ urlName, originalUrl, shortUrl, page, perPage });
    handleResponse(result, res);
  }

  async getByUserId(req: Request, res: Response): Promise<void> {
    const userId = req.user?._id;
  
    const { urlName, originalUrl, shortUrl, page, perPage } = req.query as { 
      urlName?: string;
      originalUrl?: string;
      shortUrl?: string;
      page?: number;
      perPage?: number;
    };
  
    const result = await UrlService.getByUserId(userId, { urlName, originalUrl, shortUrl, page, perPage });
    handleResponse(result, res);
  }

  async getLongUrl(req: Request, res: Response): Promise<void> {
    const shortUrl = req.body.shortUrl;
    const result = await UrlService.getLongUrl(shortUrl);
    handleResponse(result, res);
  }

  async edit(req: Request, res: Response): Promise<void> {
    const userId = req.user?._id;
    const urlId = req.params.url_id;
    const { urlName, originalUrl, shortUrl } = req.body;
  
    const result = await UrlService.edit(userId, urlId, { urlName, originalUrl, shortUrl });
    handleResponse(result, res);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const userId = req.user?._id;
    const urlId = req.params.url_id;
  
    const result = await UrlService.delete(userId, urlId);
    handleResponse(result, res);
  }
  
  
}

export default new UrlController();
