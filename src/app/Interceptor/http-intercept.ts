import { HttpHandlerFn, HttpRequest } from "@angular/common/http";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const accessToken = localStorage.getItem('aToken');
    req = req.clone({
        setHeaders: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return next(req);
}