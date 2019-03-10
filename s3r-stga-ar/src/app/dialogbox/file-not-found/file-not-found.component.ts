import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
    selector: "app-file-not-found",
    templateUrl: "./file-not-found.component.html",
    styleUrls: ["./file-not-found.component.css"]
})
export class FileNotFoundComponent implements OnInit {
    message: string;

    constructor(private dialogRef: MatDialogRef<FileNotFoundComponent>, @Inject(MAT_DIALOG_DATA) data) {
        this.message = data.message;
    }

    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }

}
