import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";

@Injectable({
    providedIn: "root"
})
export class LoginService {
    private loginSuccessful: boolean;

    constructor(private apiService: ApiService) {
        this.loginSuccessful = false;
    }

    isLoggedIn(): boolean {
        return this.loginSuccessful;
    }

    loggedInAs(): string {
        return this.loginSuccessful ? "Admin" : "Gast";
    }

    login(name: string, password: string) {
        // this.apiService.login(name, password)
        //     .subscribe((data) => {
        //     console.log(data);
        //         if (data["status"] === 200) {
        //             this.loginSuccessful = true;
        //         }
        //     });

        this.loginSuccessful = true;
    }

    logout() {
        this.loginSuccessful = false;
    }
}
