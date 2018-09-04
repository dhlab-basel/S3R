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

    constructor(private dialogRef: MatDialogRef<LoginDialogComponent>, @Inject(MAT_DIALOG_DATA) data, private loginService: LoginService) {
    }

    ngOnInit() {
    }

    login() {
        console.log(this.name, this.pw);
        this.loginService.login(this.name, this.pw);
        this.dialogRef.close();
    }

    cancel() {
        this.dialogRef.close();
    }

}
