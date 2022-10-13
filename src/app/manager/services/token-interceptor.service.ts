import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/utils/constants';
import { AuthService } from '../authentification/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  private modifiedRequest :any;

  constructor(private authService : AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let headers;
    // Authentication
    if(req.url === environment.BACKEND_URL + "/" + Constants.AUTHENTICATE) {
      // this.headers = {
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // }
      headers = req.headers
            .set('Content-Type', 'application/x-www-form-urlencoded')
    }

    // All call 
    if(this.authService.getToken() != null) {

      headers = req.headers
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + this.authService.getToken())
      

      // this.headers = {
      //   'Authorization': 'Bearer ' + this.authService.getToken(),
      //   'Content-Type':'application/json; charset=utf-8',
      //   'Access-Control-Allow-Origin':'*',
      //   'Access-Control-Allow-Headers': '*',
      //   'Access-Control-Allow-Credentials':'true',
      //   'Access-Control-Allow-Methods': 'DELETE GET HEAD POST PUT OPTIONS TRACE'
      // }
    }

    //console.log("Here : " + JSON.stringify(req));
    this.modifiedRequest = req.clone({ headers });

    //console.log("modifiedRequest : " + JSON.stringify(this.modifiedRequest));
    return next.handle(this.modifiedRequest);

  }
}