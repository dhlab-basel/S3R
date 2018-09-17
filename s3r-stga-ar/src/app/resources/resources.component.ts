import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {EditResComponent} from "../dialogbox/edit-res/edit-res.component";
import {DeleteResComponent} from "../dialogbox/delete-res/delete-res.component";
import {ApiService} from "../services/api.service";
import {Location} from "@angular/common";
import {saveAs} from "file-saver";
import {File} from "../model/file";
import {LoginService} from "../services/login.service";
import {LoginDialogComponent} from "../dialogbox/login-dialog/login-dialog.component";

@Component({
    selector: "app-resources",
    templateUrl: "./resources.component.html",
    styleUrls: ["./resources.component.css"]
})
export class ResourcesComponent implements OnInit {
    id: number;
    data: any;
    collection: string;
    picturePath: string;
    fileSize: string;
    isLoggedIn: boolean;

    constructor(private route: ActivatedRoute,
                private editDialog: MatDialog,
                private deleteDialog: MatDialog,
                private loginDialog: MatDialog,
                private apiService: ApiService,
                private location: Location,
                private fileService: File,
                private loginService: LoginService) {
        route.params.subscribe(params => {
            this.id = params["id"];
            this.setResourceData();
            console.log(`The ID is: ${this.id}`);
        });
        this.isLoggedIn = this.loginService.isLoggedIn();
    }

    ngOnInit() {
    }

    setResourceData() {
        this.apiService.getResource(this.id).subscribe( (data) => {
            this.data = data["data"];
            this.picturePath = this.fileService.evaluateMimeType(this.data.mimetype);
            this.fileSize = this.fileService.evaluateFileSize(this.data.filesize);
            this.apiService.getCollection(data["data"]["collection_id"]["id"])
                .subscribe((collection) => {
                    this.collection = collection["data"]["name"];
                    console.log(collection["data"]);
                });
        });
    }

    openEditDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = this.data;
        this.editDialog.open(EditResComponent, dialogConfig);
        this.editDialog.afterAllClosed
            .subscribe((data) => {
                this.setResourceData();
            });
    }

    openDeleteDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            resID: this.id
        };
        this.deleteDialog.open(DeleteResComponent, dialogConfig);
    }

    openLoginDialog() {
        console.log("open login");
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        this.loginDialog.open( LoginDialogComponent, dialogConfig);
        this.loginDialog.afterAllClosed
            .subscribe((data) => {
                this.isLoggedIn = this.loginService.isLoggedIn();
            });
    }

    convertDate(start: number, end: number) {
        return (start === end) ? start : `${start}-${end}`;
    }

    downloadFile() {
        this.apiService.getResourceBinary(this.id).subscribe((data) => {
            const contDis = data.headers.get("Content-Disposition");
            saveAs(data.body, contDis.substring(contDis.indexOf("filename=") + 9));
        });
    }

    xmlExport() {
        this.apiService.getResourceMetaData(this.id).subscribe((data) => {
            const contDis = data.headers.get("Content-Disposition");
            saveAs(data.body, contDis.substring(contDis.indexOf("filename=") + 9));
        });
    }

    showPicture() {
        console.log("show picture");
        this.apiService.getResourceBinary(this.id).subscribe((data) => {
            const fileURL = URL.createObjectURL(data.body);
            window.open(fileURL, "_blank");
        });
    }

    goBack() {
        this.location.back();
    }

}
