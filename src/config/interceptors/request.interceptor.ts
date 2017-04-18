import { Injectable } from '@angular/core';
import { RequestOptionsArgs } from '@angular/http';
import { IHttpInterceptor } from '@covalent/http';
import { GlobalService } from "../../app/core/services/global.service";

@Injectable()
export class RequestInterceptor implements IHttpInterceptor {

  constructor(private global: GlobalService) {}

  onRequest(requestOptions: RequestOptionsArgs): RequestOptionsArgs {
    // you add headers or do something before a request here.
    
    requestOptions.headers.append('Authentication', this.global.accessToken);
    
    return requestOptions;
  }

  onRequestError(requestOptions: RequestOptionsArgs) {
    console.log('There was an error' + requestOptions);

    return requestOptions;
  }

 
}
