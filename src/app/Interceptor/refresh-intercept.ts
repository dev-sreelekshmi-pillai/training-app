import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { Observable, switchMap, throwError, catchError } from 'rxjs';

export function refreshTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authService = inject(AuthService);
    const router = inject(Router);
    let isRefreshing = false;

    return next(req).pipe(
        catchError((error) => {
            if (error.status === 401 && !isRefreshing) {
                console.log("error in refresh interceptor");

                isRefreshing = true;
                return refreshToken(authService, router).pipe(
                    switchMap((newToken) => {
                        isRefreshing = false;
                        const clonedRequest = req.clone({
                            setHeaders: { Authorization: `Bearer ${newToken}` }
                        });
                        return next(clonedRequest);
                    }),
                    catchError((err) => {
                        isRefreshing = false;
                        authService.clearTokens();
                        router.navigate(['/login']);
                        return throwError(() => err);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};

const refreshToken = (authService: AuthService, router: Router) => {
    const refreshToken = authService.refreshTokenValue;
    if (!refreshToken) {
        authService.clearTokens();
        router.navigate(['/login']);
        return throwError(() => new Error('No refresh token'));
    }
    console.log(authService.refreshAccessToken());

    return authService.refreshAccessToken();
};
