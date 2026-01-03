import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl: string = environment.dogApiUrl;
  const apiKey: string = environment.dogApiKey;

  if (req.url.includes(apiUrl)) {
    const clonedReq = req.clone({
      setHeaders: { 'x-api-key': apiKey },
    });

    return next(clonedReq);
  }

  return next(req);
};
