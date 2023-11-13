// src/service/url.service.ts
// import { Url, IUrl } from '../types/models/url.model';
// import { IUser } from '../types/models/user.model';

// export async function createShortUrl(originalUrl: string, shortCode: string, user: IUser): Promise<IUrl> {
//   const url = new Url({ originalUrl, shortCode, user: user._id });
//   await url.save();
//   return url;
// }

// export async function findUrlByShortCode(shortCode: string): Promise<IUrl | null> {
//   const url = await Url.findOne({ shortCode, isDeleted: false });
//   if (url) {
//     url.accessCount += 1;
//     await url.save();
//   }
//   return url;
// }

// export async function getUserUrls(user: IUser): Promise<IUrl[]> {
//   return Url.find({ user: user._id, isDeleted: false });
// }

// export async function deleteUrl(id: string, user: IUser): Promise<void> {
//   const url = await Url.findOne({ _id: id, user: user._id });
//   if (url) {
//     url.isDeleted = true;
//     await url.save();
//   }
// }