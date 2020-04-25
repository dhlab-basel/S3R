import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ArkService {

  constructor(private httpClient: HttpClient) { }

  getArkId(resource_id: number): Observable<string> {
    // https://ark.dasch.swiss/make_php_ark_url?project_id=0825&resource_id=12
    return this.httpClient.get(`https://ark.dasch.swiss/make_php_ark_url?project_id=0825&resource_id=${resource_id}`, { responseType: 'text'}) as Observable<string>;
  }
}
