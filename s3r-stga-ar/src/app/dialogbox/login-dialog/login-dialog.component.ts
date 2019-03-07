import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {LoginService} from "../../services/login.service";

@Component({
    selector: "app-login-dialog",
    templateUrl: "./login-dialog.component.html",
    styleUrls: ["./login-dialog.component.css"]
})
export class LoginDialogComponent implements OnInit {
    name: string;
    pw: string;
    loginFailed: boolean;
    loginFailedMessage: string;
    logoutSuccess: boolean;
    logoutSuccessMessage: string;

    constructor(private dialogRef: MatDialogRef<LoginDialogComponent>, @Inject(MAT_DIALOG_DATA) data, private loginService: LoginService) {
    }

    ngOnInit() {
        this.resetLoginFailed();
    }

    login() {
        this.resetLoginFailed();
        this.loginService.login(this.name, this.pw)
            .subscribe(data => {
                this.dialogRef.close();
            }, error => {
                if (error.status === 401) {
                    this.loginFailed = true;
                    this.loginFailedMessage = "Falscher Name bzw. Passwort";
                } else {
                    this.loginFailed = true;
                    this.loginFailedMessage = 'Fehler mit dem Server!';
                }
            });
    }

    resetLoginFailed() {
        this.loginFailed = false;
        this.logoutSuccess = false;
    }

    cancel() {
        this.dialogRef.close();
    }

    logout() {
        this.loginService.logout();
        this.logoutSuccess = true;
        this.logoutSuccessMessage = "Sie haben sich erfolgreich ausgeloggt!"
    }


    isLoggedIn(): boolean {
        return this.loginService.isLoggedIn();
    }

    loggedInAs(): string {
        return this.loginService.loggedInAs();
    }

}
