import {HttpHeaders} from "@angular/common/http";

export const REFRESH_TOKEN = 'accessToken';
export const ACCESS_TOKEN = 'currentUser';
export const USER_DATA = 'userData';
export const SECRET_KEY = 'my-secret-key';
export const headersAuth = new HttpHeaders({
    'Authorization': 'Token f47ac10b-58cc-4372-a567-0e02b2c3d479'
});