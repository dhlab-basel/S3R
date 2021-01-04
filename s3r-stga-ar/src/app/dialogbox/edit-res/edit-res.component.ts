import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/api.service";
import {File} from "../../model/file";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: "app-edit-res",
    templateUrl: "./edit-res.component.html",
    styleUrls: ["./edit-res.component.css"]
})
export class EditResComponent implements OnInit {
    private static readonly MIN_YEAR = 1;
    private static readonly MAX_YEAR = 9999;
    id: number;
    selectedFile = null;
    selectedFileSize: string;
    fileSize: string;
    resource: any;
    collections: any[];
    fileTypeList: string[];
    form: FormGroup;
    submitted: boolean;
    choseFile: boolean;
    existingObject: boolean;
    existingObjectMessage = "Dieses Objekt existiert bereits! Ändern Sie den Titel, Autor oder die Jahreszahlen";

    constructor(private dialogRef: MatDialogRef<EditResComponent>, @Inject(MAT_DIALOG_DATA) data,
                private apiService: ApiService,
                private file: File) {
        // Übergebene Daten
        this.resource = data;
        this.apiService.getCollections()
            .subscribe((data2) => {
            this.collections = data2["data"]
                .reduce((acc, curVal) => {
                    if (curVal.isLeaf) {
                        acc.push({value: curVal.id, viewValue: curVal.name});
                    }
                    return acc;
                }, []);
            });
    }

    ngOnInit() {
        this.resetExistingObject();
        this.submitted = false;
        this.choseFile = false;
        this.id = this.resource["id"];
        this.fileTypeList = this.file.getAllSimpleForms();
        this.fileSize = this.file.evaluateFileSize(this.resource["filesize"]);

        this.form = new FormGroup({
            file: new FormControl(),
            collectionID: new FormControl(this.resource["collection_id"]["id"], [Validators.required]),
            title: new FormControl(this.resource["title"], [Validators.required, Validators.pattern(/^\w+/)]),
            creator: new FormControl(this.resource["creator"] ? this.resource["creator"] : "", []),
            subject: new FormControl(this.resource["subject"] ? this.resource["subject"] : "", []),
            description: new FormControl(this.resource["description"] ? this.resource["description"] : "", []),
            publisher: new FormControl(this.resource["publisher"] ? this.resource["publisher"] : "", []),
            contributor: new FormControl(this.resource["contributor"] ? this.resource["contributor"] : "", []),
            dateStart: new FormControl(this.resource["date_start"], [Validators.required, Validators.min(EditResComponent.MIN_YEAR), Validators.max(EditResComponent.MAX_YEAR)]),
            dateEnd: new FormControl(this.resource["date_end"], [Validators.required, Validators.min(EditResComponent.MIN_YEAR), Validators.max(EditResComponent.MAX_YEAR)]),
            format: new FormControl(this.file.mimeTypeToSimpleForm(this.resource["format"]), [Validators.required]),
            identifier: new FormControl(this.resource["identifier"], [Validators.required]),
            language: new FormControl(this.resource["language"] ? this.resource["language"] : "", []),
            rights: new FormControl(this.resource["rights"] ? this.resource["rights"] : "", [Validators.required]),
            signature: new FormControl(this.resource["signature"] ? this.resource["signature"] : "", []),
            isbn: new FormControl(this.resource["isbn"] ? this.resource["isbn"] : "", [])

            // Dublin Core Fields which are not used
            // source: new FormControl("", []),
            // relation: new FormControl("", []),
            // coverage: new FormControl("", []),
        });
    }

    save() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        const fd = new FormData();
        // Reihenfolge von title ändern
        if (this.selectedFile != null) {
            fd.append("image", this.selectedFile, this.selectedFile.name);
        }

        fd.append("dump", "");
        fd.append("title", this.form.get("title").value);
        fd.append("creator", this.form.get("creator").value);
        fd.append("subject", this.form.get("subject").value);
        fd.append("description", this.form.get("description").value);
        fd.append("publisher", this.form.get("publisher").value);
        fd.append("contributor", this.form.get("contributor").value);
        fd.append("date_start", this.form.get("dateStart").value);
        fd.append("date_end", this.form.get("dateEnd").value);
        fd.append("format", this.file.simpleFormToMimeType(this.form.get("format").value));
        fd.append("identifier", this.form.get("identifier").value);
        fd.append("language", this.form.get("language").value);
        fd.append("rights", this.form.get("rights").value);
        fd.append("signature", this.form.get("signature").value);
        fd.append("isbn", this.form.get("isbn").value);
        fd.append("collection_id", this.form.get("collectionID").value);

        // Dublin Core Fields which are not used
        fd.append("source", null);
        fd.append("relation", null);
        fd.append("coverage", null);


        this.apiService.updateResource(this.resource["id"], fd)
            .subscribe((data) => {
                this.dialogRef.close();
            }, (error) => {
                if (error.status === 409) {
                    this.existingObject = true;
                } else {
                    console.log("failed");
                }
            });
    }

    resetExistingObject() {
        this.existingObject = false;
    }

    cancel() {
        this.dialogRef.close();
    }

    onFileSelect(event) {
        this.choseFile = false;
        const fileType = this.file.mimeTypeToSimpleForm(event.target.files[0].type);
        if (fileType !== null) {
            this.selectedFile = event.target.files[0];
            this.selectedFileSize = this.file.evaluateFileSize(this.selectedFile.size);
        } else {
            this.choseFile = true;
            this.selectedFile = null;
            console.log("Wrong mime type");
        }
    }

    getThumbnail(): string {
        return this.apiService.getResThumbnailURL(this.id, "small");
    }

    getErrorColID(): string {
        return this.form.get("collectionID").hasError("required") ? "Sammlung muss ausgewählt werden" :
            "";
    }

    getErrorTitle(): string {
        return this.form.get("title").hasError("required") ? "Titel muss eingegeben werden" :
            this.form.get("title").hasError("pattern") ? "Ungültiger Titel" :
                "";
    }

    getErrorDateStart(): string {
        return this.form.get("dateStart").hasError("required") ? "Ungültiges Anfangsjahr" :
            this.form.get("dateStart").hasError("min") ? `Mindestjahr ist ${EditResComponent.MIN_YEAR}` :
                this.form.get("dateStart").hasError("max") ? "Ungültiges Anfangsjahr" :
                    "";
    }

    getErrorDateEnd(): string {
        return this.form.get("dateEnd").hasError("required") ? "Ungültiges Endjahr" :
            this.form.get("dateEnd").hasError("min") ? `Mindestjahr ist ${EditResComponent.MIN_YEAR}` :
                this.form.get("dateEnd").hasError("max") ? "Ungültiges Endjahr" :
                    "";
    }

    getErrorFormat(): string {
        return this.form.get("format").hasError("required") ? "Bitte Format auswählen" :
            "";
    }

    getErrorIdentifier(): string {
        return this.form.get("identifier").hasError("required") ? "Identifikator muss eingegeben werden" :
            "";
    }


    getErrorRights(): string {
        return this.form.get("rights").hasError("required") ? "Rechte muss eingegeben werden" :
            "";
    }

}
