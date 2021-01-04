import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/api.service";
import {File} from "../../model/file";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: "app-create-res",
    templateUrl: "./create-res.component.html",
    styleUrls: ["./create-res.component.css"]
})
export class CreateResComponent implements OnInit {
    selectedFile = null;
    selectedFileSize: string;
    fileTypeList: string[];
    languageList: {name: string, id: number}[];
    data: string;
    form: FormGroup;
    submitted: boolean;
    fileUploadBorder: any;
    existingObject: boolean;
    existingObjectMessage: string = "Dieses Objekt existiert bereits! Ändern Sie den Titel, Autor oder die Jahreszahlen";
    private static readonly DEFAULT_RIGHTS = "CC-BY-NC";

    constructor(private dialogRef: MatDialogRef<CreateResComponent>, @Inject(MAT_DIALOG_DATA) data,
                private apiService: ApiService,
                private file: File) {
        this.data = data;
        this.fileTypeList = this.file.getAllSimpleForms();
    }

    ngOnInit() {
        this.resetExistingObject();
        this.apiService.getLanguages()
            .subscribe((data) => {
                this.languageList = data.data;
        });
        this.fileUploadBorder = "2px dashed darkgray";
        this.form = new FormGroup({
            file: new FormControl(),
            title: new FormControl("", [Validators.required, Validators.pattern(/^\w+/)]),
            creator: new FormControl("", []),
            subject: new FormControl("", []),
            description: new FormControl("", []),
            publisher: new FormControl("", []),
            contributor: new FormControl("", []),
            dateStart: new FormControl("", [Validators.required, Validators.min(1000), Validators.max(9999)]),
            dateEnd: new FormControl("", [Validators.required, Validators.min(1000), Validators.max(9999)]),
            format: new FormControl("", [Validators.required]),
            identifier: new FormControl("", [Validators.required]),
            language: new FormControl("", []),
            rights: new FormControl(CreateResComponent.DEFAULT_RIGHTS, [Validators.required]),
            signature: new FormControl("", []),
            isbn: new FormControl("", [])

            // Dublin Core Fields which are not used
            // source: new FormControl("", []),
            // relation: new FormControl("", []),
            // coverage: new FormControl("", []),
        });
    }

    create() {
        this.resetExistingObject();
        this.submitted = true;

        if (this.form.invalid) {
            if (this.selectedFile == null) {
                this.fileUploadBorder = "2px dashed red";
            }
            return;
        }

        if (this.selectedFile == null) {
            this.fileUploadBorder = "2px dashed red";
            return;
        }

        const fd = new FormData();
        fd.append("image", this.selectedFile, this.selectedFile.name);
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
        fd.append("collection_id", this.data["colID"]);

        // Dublin Core Fields which are not used
        fd.append("source", null);
        fd.append("relation", null);
        fd.append("coverage", null);

        this.apiService.createResource(fd)
            .subscribe((result) => {
                this.dialogRef.close();
            }, (error) => {
                if (error.status === 409) {
                    this.existingObject = true;
                } else {
                    console.log("failed");
                }
            });
    }

    cancel() {
        this.dialogRef.close();
    }

    resetExistingObject() {
        this.existingObject = false;
    }

    onFileSelect(event) {
        const fileType = this.file.mimeTypeToSimpleForm(event.target.files[0].type);
        if (fileType !== null) {
            this.selectedFile = event.target.files[0];
            this.selectedFileSize = this.file.evaluateFileSize(this.selectedFile.size);
            this.fileUploadBorder = "2px dashed darkgray";
        } else {
            this.selectedFile = null;
            console.log("Wrong mime type");
        }
    }

    getErrorTitle(): string {
        return this.form.get("title").hasError("required") ? "Titel muss eingegeben werden":
            this.form.get("title").hasError("pattern") ? "Ungültiger Titel":
                "";
    }

    getErrorDateStart(): string {
        return this.form.get("dateStart").hasError("required") ? "Ungültiges Anfangsjahr":
            this.form.get("dateStart").hasError("min") ? "Mindestjahr ist 1000":
                this.form.get("dateStart").hasError("max") ? "Ungültiges Anfangsjahr":
                    "";
    }

    getErrorDateEnd(): string {
        return this.form.get("dateEnd").hasError("required") ? "Ungültiges Endjahr":
                this.form.get("dateEnd").hasError("min") ? "Mindestjahr ist 1000":
                    this.form.get("dateEnd").hasError("max") ? "Ungültiges Endjahr":
                        "";
    }

    getErrorFormat(): string {
        return this.form.get("format").hasError("required") ? "Bitte Format auswählen":
                "";
    }

    getErrorIdentifier(): string {
        return this.form.get("identifier").hasError("required") ? "Identifikator muss eingegeben werden":
                "";
    }

    getErrorRights(): string {
        return this.form.get("rights").hasError("required") ? "Rechte muss eingegeben werden":
            "";
    }


}
