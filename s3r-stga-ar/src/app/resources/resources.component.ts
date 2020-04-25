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
import {FileNotFoundComponent} from "../dialogbox/file-not-found/file-not-found.component";
import {ArkService} from "../services/ark.service";

@Component({
    selector: "app-resources",
    templateUrl: "./resources.component.html",
    styleUrls: ["./resources.component.css"]
})
export class ResourcesComponent implements OnInit {
    id: number;
    data: any;
    arkUrl: string;
    collection: string;
    path: {id: number, name: string} [];
    fileSize: string;
    isLoggedIn: boolean;

    constructor(private route: ActivatedRoute,
                private editDialog: MatDialog,
                private deleteDialog: MatDialog,
                private loginDialog: MatDialog,
                private fileNotFound: MatDialog,
                private apiService: ApiService,
                private location: Location,
                public fileService: File,
                private loginService: LoginService,
                private arkService: ArkService) {
        route.params.subscribe(params => {
            this.id = params["id"];
            this.setResourceData();
            console.log(`The ID is: ${this.id}`);
        });
        this.loginService.sub().subscribe(data => this.isLoggedIn = data);
    }

    ngOnInit() {
      this.getArkUrl();
    }

    setResourceData() {
        this.apiService.getResource(this.id).subscribe( (data) => {
            this.data = data["data"];
            this.fileSize = this.fileService.evaluateFileSize(this.data.filesize);
            this.apiService.getCollection(data["data"]["collection_id"]["id"])
                .subscribe((collection) => {
                    this.collection = collection["data"]["name"];
                    this.path = collection["data"]["path"].reverse();
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
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        this.apiService.getResourceFile(this.id).subscribe((data) => {
            const contDis = data.headers.get("Content-Disposition");
            saveAs(data.body, contDis.substring(contDis.indexOf("filename=") + 9));
        }, (error) => {
            dialogConfig.data = {
                message: "Die Datei wurde nicht gefunden!"
            };
            this.fileNotFound.open(FileNotFoundComponent, dialogConfig);
        });
    }

    xmlExport() {
        this.apiService.getMetaDataXML(this.id).subscribe((data) => {
            const contDis = data.headers.get("Content-Disposition");
            saveAs(data.body, contDis.substring(contDis.indexOf("filename=") + 9));
        });
    }

    showPicture() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        this.apiService.getResourcePreview(this.id).subscribe((data) => {
            const fileURL = URL.createObjectURL(data.body);
            window.open(fileURL, "_blank");
        }, (error) => {
            dialogConfig.data = {
                message: "Die Datei wurde nicht gefunden!"
            };
            this.fileNotFound.open(FileNotFoundComponent, dialogConfig);
        })
    }

    createQuoteString(): string {
        return `${this.data.creator}: ${this.data.title}. ${this.data.publisher}, ${this.convertDate(this.data.date_start, this.data.date_end)}. ${this.data.identifier}`;
    }

    getThumbnail(): string {
        return this.apiService.getResThumbnailURL(this.id, "medium");
    }

    goBack() {
        this.location.back();
    }

    getArkUrl(): void {
      this.arkService.getArkId(this.id).subscribe(
        ark_url_str => {
          console.log('ARK:', ark_url_str);
          this.arkUrl = ark_url_str;
        }
      );

    }
}
