import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class GroqKeyInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url === environment.groqApiUrl) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${environment.groqApiKey}`,
        },
      });

      return next.handle(clonedRequest);
    }

    return next.handle(req);
  }
}
