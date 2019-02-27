import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {map} from "rxjs/internal/operators";

@Injectable({
    providedIn: "root"
})
export class LoginService {

    constructor(private httpClient: HttpClient) {
    }

    isLoggedIn(): boolean {
        return (localStorage.getItem("token") !== null);
    }

    loggedInAs(): string {
        return this.isLoggedIn() ? localStorage.getItem("name") : "Gast";
    }

    login(name: string, pw: string):Observable<any> {
        const fd = new FormData();
        fd.append("name", name);
        fd.append("password", pw);

        return this.httpClient.post(`${ApiService.API_URL}/login`, fd, {observe: "response"})
            .pipe(map(result => {
                localStorage.setItem("token", result.body["token"]);
                localStorage.setItem("name", name);
                return result;
            }))
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("name")
    }
}
