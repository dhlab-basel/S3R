import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs/index";
import {map} from "rxjs/internal/operators";

@Injectable({
    providedIn: "root"
})
export class LoginService {
    private loggedIn: BehaviorSubject<boolean>;

    constructor(private httpClient: HttpClient) {
        this.loggedIn = new BehaviorSubject(this.isLoggedIn());
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
                this.loggedIn.next(true);
                return result;
            }))
    }

    sub() {
        return this.loggedIn.asObservable();
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        this.loggedIn.next(false);
    }
}
