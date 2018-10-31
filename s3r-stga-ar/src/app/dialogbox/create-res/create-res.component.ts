import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/api.service";
import {File} from "../../model/file";

@Component({
    selector: "app-create-res",
    templateUrl: "./create-res.component.html",
    styleUrls: ["./create-res.component.css"]
})
export class CreateResComponent implements OnInit {
    selectedFile = null;
    selectedFileSize: string;

    data: string;

    // Dublin Core Fields
    title: string;
    creator: string;
    subject: string;
    description: string;
    publisher: string;
    contributor: string;
    date_start: string;
    date_end: string;
    format: string;
    identifier: string;
    source: string;
    language: string;
    relation: string;
    coverage: string;
    rights: string;

    constructor(private dialogRef: MatDialogRef<CreateResComponent>, @Inject(MAT_DIALOG_DATA) data,
                private apiService: ApiService,
                private file: File) {
        this.data = data;
    }

    ngOnInit() {
    }

    create() {
        if (this.selectedFile == null) {
            return;
        }

        if ((this.title == null) || (this.title === "")) {
            console.log("title missing");
            return;
        }

        if ((this.identifier == null) || (this.identifier === "")) {
            console.log("identifier missing");
            return;
        }

        if (!/^\d{4}$/.test(this.date_start)) {
            console.log("date_start is invalid");
            return;
        }

        if (!/^\d{4}$/.test(this.date_end)) {
            console.log("date_end is invalid");
            return;
        }

        const fd = new FormData();
        fd.append("image", this.selectedFile, this.selectedFile.name);
        fd.append("dump", "");
        fd.append("title", this.title);
        fd.append("creator", this.creator);
        fd.append("subject", this.subject);
        fd.append("description", this.description);
        fd.append("publisher", this.publisher);
        fd.append("contributor", this.contributor);
        fd.append("date_start", this.date_start);
        fd.append("date_end", this.date_end);
        fd.append("format", this.format);
        fd.append("identifier", this.identifier);
        fd.append("source", this.source);
        fd.append("language", this.language);
        fd.append("relation", this.relation);
        fd.append("coverage", this.coverage);
        fd.append("rights", this.rights);
        fd.append("collection_id", this.data["colID"]);
        this.apiService.createResource(fd)
            .subscribe((result) => {
                console.log(result);
            });
        this.dialogRef.close();
    }

    cancel() {
        this.dialogRef.close();
    }

    onFileSelect(event) {
        if (this.file.isRightMimeType(event.target.files[0].type)) {
            this.selectedFile = event.target.files[0];
            this.selectedFileSize = this.file.evaluateFileSize(this.selectedFile.size);
        } else {
            console.log("Wrong mime type");
        }
    }
}
