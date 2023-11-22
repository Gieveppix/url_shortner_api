import { Document } from 'mongoose';
import { GenerateOptions  } from 'randomstring';
import { IUser } from './user';

export interface IUrl extends Document {
  urlName?: string;
  originalUrl: string;
  shortUrl: string;
  accessCount?: number;
  createdBy: IUser['_id'];
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

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