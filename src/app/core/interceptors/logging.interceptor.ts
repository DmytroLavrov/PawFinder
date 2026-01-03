import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();

  console.log(`🚀 HTTP Request: ${req.method} ${req.url}`);

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const duration = Date.now() - startTime;
          console.log(`✅ HTTP Response: ${req.method} ${req.url} (${duration}ms)`, event.body);
        }
      },
      error: (error) => {
        const duration = Date.now() - startTime;
        console.error(`❌ HTTP Error: ${req.method} ${req.url} (${duration}ms)`, error);
      },
    }),
  );
};
