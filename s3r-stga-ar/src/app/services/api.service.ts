import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Params} from "@angular/router";

@Injectable({
    providedIn: "root"
})

export class ApiService {

    // public static readonly API_URL = "http://localhost:1024/api";
    public static readonly API_URL = "http://sipi.langzeitarchivierung.ch:80/api";

    constructor(private httpClient: HttpClient) {
    }

    getLanguages(): Observable<any> {
        return this.httpClient.get(`${ApiService.API_URL}/languages`);
    }

    getResources(): Observable<any> {
        return this.httpClient.get(`${ApiService.API_URL}/resources`);
    }

    getResource(id: number): Observable<any> {
        return this.httpClient.get(`${ApiService.API_URL}/resources/${id}`);
    }

    getMetaDataXML(id: number): Observable<any> {
        return this.httpClient.get(`${ApiService.API_URL}/resources/${id}/metadata/xml`, {responseType: "blob", observe: "response"});
    }

    getResourceFile(id: number) {
        return this.httpClient.get(`${ApiService.API_URL}/resources/${id}/content`, {responseType: "blob", observe: "response"});
    }

    getResourceFileURL(id: number): string {
        return `${ApiService.API_URL}/resources/${id}/content`;
    }

    getResourcePreview(id: number) {
        return this.httpClient.get(`${ApiService.API_URL}/resources/${id}/preview/content`, {responseType: "blob", observe: "response"})
    }

    getResPreviewURL(id: number): string {
        return `${ApiService.API_URL}/resources/${id}/preview/content`;
    }

    getResThumbnail(id: number, size: string) {
        return this.httpClient.get(`${ApiService.API_URL}/resources/${id}/thumbnail/${size}/content`, {responseType: "blob", observe: "response"});
    }

    getResThumbnailURL(id: number, size: string) {
        return `${ApiService.API_URL}/resources/${id}/thumbnail/${size}/content`;
    }

    createResource(formData: FormData) {
        return this.httpClient.post(`${ApiService.API_URL}/resources`, formData );
    }

    updateResource(id: number, formData: FormData) {
        return this.httpClient.put(`${ApiService.API_URL}/resources/${id}`, formData);
    }

    deleteResource(id: number) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        return this.httpClient.delete(`${ApiService.API_URL}/resources/${id}`, httpOptions);
    }

    getCollections(): Observable<any> {
        return this.httpClient.get(`${ApiService.API_URL}/collections`);
    }

    getCollection(id: number): Observable<any> {
        return this.httpClient.get(`${ApiService.API_URL}/collections/${id}`);
    }

    getCollectionResources(id: number) {
        return this.httpClient.get(`${ApiService.API_URL}/collections/${id}/resources`);
    }

    getCollectionResource(colID: number, resID: number): Observable<any> {
        return this.httpClient.get(`${ApiService.API_URL}/collections/${colID}/resources/${resID}`);
    }

    getCollectionResourceBinary(colID: number, resID: number) {
        return this.httpClient.get(`${ApiService.API_URL}/collections/${colID}/resources/${resID}/file`, {responseType: "blob", observe: "response"});
    }

    getCollectionCollections(id: number): Observable<any> {
        return this.httpClient.get(`${ApiService.API_URL}/collections/${id}/collections`);
    }

    createCollection(formData: FormData) {
        return this.httpClient.post(`${ApiService.API_URL}/collections`, formData);
    }

    updateCollection(id: number, formData: FormData) {
        return this.httpClient.put(`${ApiService.API_URL}/collections/${id}`, formData);
    }

    deleteCollection(id: number) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        return this.httpClient.delete(`${ApiService.API_URL}/collections/${id}`, httpOptions);
    }

    fullSearch(searchWord: string): Observable<any> {
        const params = { "searchword" : searchWord};
        return this.httpClient.get(`${ApiService.API_URL}/search/full`, {params: params});
    }

    extendedSearch(params: Params): Observable<any> {
        return this.httpClient.get(`${ApiService.API_URL}/search/extended`, {params: params});
    }


}
