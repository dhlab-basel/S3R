import {Component, OnInit} from "@angular/core";
import {LoginService} from "../services/login.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
    isLoggedIn: boolean;
    name: string;
    password: string;

    constructor(private loginService: LoginService) {
        this.isLoggedIn = this.loginService.isLoggedIn();
    }

    ngOnInit() {
    }


    login() {
        console.log(this.name, this.password);
        console.log(this.isLoggedIn, this.loginService.isLoggedIn());
        this.loginService.login(this.name, this.password);
        this.isLoggedIn = this.loginService.isLoggedIn();
    }

    logout() {
        this.loginService.logout();
        this.isLoggedIn = this.loginService.isLoggedIn();
    }
}
