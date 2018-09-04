import {Component} from "@angular/core";
import {MediaChange, ObservableMedia} from "@angular/flex-layout";
import {Subscription} from "rxjs";
import {LoginService} from "./services/login.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    watcher: Subscription;
    menuIsOpen = false;

    constructor(public media: ObservableMedia, private loginService: LoginService) {
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

}
