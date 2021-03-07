import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/api.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: "app-create-col",
    templateUrl: "./create-col.component.html",
    styleUrls: ["./create-col.component.css"]
})
export class CreateColComponent implements OnInit {
    collectionID: string;
    form: FormGroup;

    constructor(private dialogRef: MatDialogRef<CreateColComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.collectionID = data["colID"];
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl("", [Validators.required, Validators.pattern(/^\w+/)])
        });
    }

    create() {
        const fd = new FormData();
        fd.append("collection_id", this.collectionID);
        fd.append("name", this.form.get("name").value);

        this.apiService.createCollection(fd)
            .subscribe((result) => console.log(result));
        this.dialogRef.close();
    }

    cancel() {
        this.dialogRef.close();
    }

    getErrorName(): string {
        return this.form.get("name").hasError("required") ? "Bitte Namen eingeben" :
            this.form.get("name").hasError("pattern") ? "Ungültiger Name" : "";
    }
}
