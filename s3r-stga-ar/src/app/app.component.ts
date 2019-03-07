import {Component} from "@angular/core";
import {MediaChange, ObservableMedia} from "@angular/flex-layout";
import {Subscription} from "rxjs";
import {LoginService} from "./services/login.service";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {LoginDialogComponent} from "./dialogbox/login-dialog/login-dialog.component";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    watcher: Subscription;
    menuIsOpen = false;

    constructor(public media: ObservableMedia, private loginService: LoginService, private loginDialog: MatDialog,) {
        this.watcher = media.subscribe((change: MediaChange) => {
            if (change.mqAlias !== "xs") {
                this.menuIsOpen = true;
            } else if (change.mqAlias === "xs") {
                this.menuIsOpen = false;
            }
        });
    }

    ngOnDestroy() {
        this.watcher.unsubscribe();
    }

    actionMenu() {
        this.menuIsOpen = !this.menuIsOpen;
    }

    loggedInAs(): string {
        return this.loginService.loggedInAs();
    }

    openLoginDialog() {
        console.log("open login");
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        this.loginDialog.open( LoginDialogComponent, dialogConfig);
        this.loginDialog.afterAllClosed
            .subscribe((data) => {
                this.loggedInAs();
            });
    }

}
