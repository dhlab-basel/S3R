import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
    selector: "app-file-not-found",
    templateUrl: "./file-not-found.component.html",
    styleUrls: ["./file-not-found.component.css"]
})
export class FileNotFoundComponent implements OnInit {
    static readonly FILE_NOT_FOUND_MESSAGE = "Die Datei wurde nicht gefunden!";

    constructor(private dialogRef: MatDialogRef<FileNotFoundComponent>, @Inject(MAT_DIALOG_DATA) data) {
    }

    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }

    getMessage(): string {
        return FileNotFoundComponent.FILE_NOT_FOUND_MESSAGE;
    }

}
