import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Params} from "@angular/router";

@Injectable({
    providedIn: "root"
})

export class ApiService {

    // private static readonly apiURL = "http://localhost:1024/api";
    private static readonly apiURL = "http://sipi.langzeitarchivierung.ch:80/api";

    constructor(private httpClient: HttpClient) {
    }

    login(name: string, pw: string): Observable<any> {
        const fd = new FormData();
        fd.append("name", name);
        fd.append("password", pw);
        return this.httpClient.post(`${ApiService.apiURL}/login`, fd, {observe: "response"});
    }

    getResources(): Observable<any> {
        return this.httpClient.get(`${ApiService.apiURL}/resources`);
    }

    getResource(id: number): Observable<any> {
        return this.httpClient.get(`${ApiService.apiURL}/resources/${id}`);
    }

    getMetaDataXML(id: number): Observable<any> {
        return this.httpClient.get(`${ApiService.apiURL}/resources/${id}/metadata/xml`, {responseType: "blob", observe: "response"});
    }

    getResourceFile(id: number) {
        return this.httpClient.get(`${ApiService.apiURL}/resources/${id}/content`, {responseType: "blob", observe: "response"});
    }

    getResourceFileURL(id: number): string {
        return `${ApiService.apiURL}/resources/${id}/content`;
    }

    getResourcePreview(id: number) {
        return this.httpClient.get(`${ApiService.apiURL}/resources/${id}/preview/content`, {responseType: "blob", observe: "response"})
    }

    getResPreviewURL(id: number): string {
        return `${ApiService.apiURL}/resources/${id}/preview/content`;
    }

    getResThumbnail(id: number, size: string) {
        let thumbnailSize = ((size !== "small") && (size !== "medium") && (size !== "large")) ? "small" : size;
        return this.httpClient.get(`${ApiService.apiURL}/resources/${id}/thumbnail/${thumbnailSize}/content`, {responseType: "blob", observe: "response"});
    }

    getResThumbnailURL(id: number, size: string) {
        let thumbnailSize = ((size !== "small") && (size !== "medium") && (size !== "large")) ? "small" : size;
        return `${ApiService.apiURL}/resources/${id}/thumbnail/${thumbnailSize}/content`;
    }

    createResource(formData: FormData) {
        return this.httpClient.post(`${ApiService.apiURL}/resources`, formData );
    }

    updateResource(id: number, formData: FormData) {
        return this.httpClient.put(`${ApiService.apiURL}/resources/${id}`, formData);
    }

    deleteResource(id: number) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        return this.httpClient.delete(`${ApiService.apiURL}/resources/${id}`, httpOptions);
    }

    getCollections(): Observable<any> {
        return this.httpClient.get(`${ApiService.apiURL}/collections`);
    }

    getCollection(id: number): Observable<any> {
        return this.httpClient.get(`${ApiService.apiURL}/collections/${id}`);
    }

    getCollectionResources(id: number) {
        return this.httpClient.get(`${ApiService.apiURL}/collections/${id}/resources`);
    }

    getCollectionResource(colID: number, resID: number): Observable<any> {
        return this.httpClient.get(`${ApiService.apiURL}/collections/${colID}/resources/${resID}`);
    }

    getCollectionResourceBinary(colID: number, resID: number) {
        return this.httpClient.get(`${ApiService.apiURL}/collections/${colID}/resources/${resID}/file`, {responseType: "blob", observe: "response"});
    }

    getCollectionCollections(id: number): Observable<any> {
        return this.httpClient.get(`${ApiService.apiURL}/collections/${id}/collections`);
    }

    createCollection(formData: FormData) {
        return this.httpClient.post(`${ApiService.apiURL}/collections`, formData);
    }

    updateCollection(id: number, formData: FormData) {
        return this.httpClient.put(`${ApiService.apiURL}/collections/${id}`, formData);
    }

    deleteCollection(id: number) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        return this.httpClient.delete(`${ApiService.apiURL}/collections/${id}`, httpOptions);
    }

    fullSearch(searchword: string): Observable<any> {
        const params = { "searchword" : searchword};
        return this.httpClient.get(`${ApiService.apiURL}/search/full`, {params: params});
    }

    extendedSearch(params: Params): Observable<any> {
        return this.httpClient.get(`${ApiService.apiURL}/search/extended`, {params: params});
    }


}
