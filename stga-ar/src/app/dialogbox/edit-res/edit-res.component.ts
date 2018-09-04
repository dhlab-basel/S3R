import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/api.service";
import {File} from "../../model/file";

@Component({
    selector: "app-edit-res",
    templateUrl: "./edit-res.component.html",
    styleUrls: ["./edit-res.component.css"]
})

export class EditResComponent implements OnInit {
    selectedFile = null;
    selectedFileSize: string;
    picturePath: string;
    fileSize: string;
    resource: string;
    collections: any[];

    title: string;
    creator: string;
    subject: string;
    description: string;
    publisher: string;
    contributor: string;
    date_start: string;
    date_end: string;
    type: string;
    format: string;
    identifier: string;
    source: string;
    language: string;
    relation: string;
    coverage: string;
    rights: string;
    selectedValue: number;

    constructor(private dialogRef: MatDialogRef<EditResComponent>, @Inject(MAT_DIALOG_DATA) resource,
                private apiService: ApiService,
                private file: File) {
        // Übergebene Daten
        this.resource = resource;
        this.picturePath = this.file.evaluateMimeType(this.resource["mimetype"]);
        this.fileSize = this.file.evaluateFileSize(this.resource["filesize"]);
        console.log(this.picturePath);
        this.apiService.getCollections()
            .subscribe((data) => {
            this.collections = data["data"]
                .reduce((acc, curVal) => {
                    if (curVal.isLeaf) {
                        acc.push({value: curVal.id, viewValue: curVal.name});
                    }
                    return acc;
                }, []);
            });

        this.selectedValue = this.resource["collection_id"]["id"];
        this.title = this.resource["title"];
        this.creator = this.resource["creator"];
        this.subject = this.resource["subject"];
        this.description = this.resource["description"];
        this.publisher = this.resource["publisher"];
        this.contributor = this.resource["contributor"];
        this.date_start = this.resource["date_start"];
        this.date_end = this.resource["date_end"];
        this.type = this.resource["type"];
        this.format = this.resource["format"];
        this.identifier = this.resource["identifier"];
        this.source = this.resource["resource"];
        this.language = this.resource["language"];
        this.relation = this.resource["relation"];
        this.coverage = this.resource["coverage"];
        this.rights = this.resource["rights"];
    }

    ngOnInit() {
    }

    save() {

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
        // Reihenfolge von title ändern
        if (this.selectedFile != null) {
            fd.append("image", this.selectedFile, this.selectedFile.name);
        }
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
        fd.append("collection_id", this.selectedValue.toString());

        this.apiService.updateResource(this.resource["id"], fd)
            .subscribe((data) => {
                console.log(data);
            });

        this.dialogRef.close();
    }

    cancel() {
        this.dialogRef.close();
    }

    onFileSelect(event) {
        this.selectedFile = event.target.files[0];
        this.selectedFileSize = this.file.evaluateFileSize(this.selectedFile.size);
    }

}
