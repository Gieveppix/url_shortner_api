import express from "express";
import UrlController from "../controller/url";
import UrlValidation from "../validation/url"
import { authenticate } from "../middleware";

export const urlRoute = express.Router({ mergeParams: true });

urlRoute.post('/urls', authenticate, UrlValidation.create, UrlController.create);

urlRoute.get('/urls', authenticate, UrlController.getAll)

urlRoute.get('/urls/user', authenticate, UrlController.getByUserId);

urlRoute.get('/urls/long_url', UrlController.getLongUrl)

urlRoute.patch('/urls/:url_id', authenticate, UrlValidation.edit, UrlController.edit);

urlRoute.delete('/urls/:url_id', authenticate, UrlController.delete);
