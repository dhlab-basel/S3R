import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DeleteColComponent} from "../delete-col/delete-col.component";
import {ApiService} from "../../services/api.service";

@Component({
    selector: "app-edit-col",
    templateUrl: "./edit-col.component.html",
    styleUrls: ["./edit-col.component.css"]
})
export class EditColComponent implements OnInit {
    id: number;
    parentCol: any;
    form: FormGroup;
    data: any;

    constructor(private dialogRef: MatDialogRef<DeleteColComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.data = data;
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl( this.data["name"], [Validators.required, Validators.pattern(/^\w+/)])
        });
        this.id = this.data["id"];
        this.parentCol = this.data["collection_id"];
    }

    save() {
        const fd = new FormData();
        fd.append("name", this.form.get("name").value);
        fd.append("collection_id", this.parentCol["id"]);

        this.apiService.updateCollection(this.id, fd)
            .subscribe((data) => {
                console.log(data);
            });

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
