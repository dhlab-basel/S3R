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
    data: string;
    form: FormGroup;

    constructor(private dialogRef: MatDialogRef<CreateResComponent>, @Inject(MAT_DIALOG_DATA) data,
                private apiService: ApiService,
                private file: File) {
        this.data = data;
        this.fileTypeList = this.file.getAllSimpleForms();
    }

    ngOnInit() {
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
            rights: new FormControl("", [])

            // Dublin Core Fields which are not used
            // source: new FormControl("", []),
            // relation: new FormControl("", []),
            // coverage: new FormControl("", []),
        });
    }

    create() {
        if (this.selectedFile == null) {
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
        fd.append("format", this.file.simpleFormTomimeType(this.form.get("format").value));
        fd.append("identifier", this.form.get("identifier").value);
        fd.append("language", this.form.get("language").value);
        fd.append("rights", this.form.get("rights").value);
        fd.append("collection_id", this.data["colID"]);

        // Dublin Core Fields which are not used
        // fd.append("source", this.form.get("source").value);
        // fd.append("relation", this.form.get("relation").value);
        // fd.append("coverage", this.form.get("coverage").value);

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
        const fileType = this.file.mimeTypeToSimpleForm(event.target.files[0].type);
        if (fileType !== null) {
            this.selectedFile = event.target.files[0];
            this.selectedFileSize = this.file.evaluateFileSize(this.selectedFile.size);
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
        return this.form.get("identifier").hasError("required") ? "Signatur muss eingegeben werden":
                "";
    }


}
