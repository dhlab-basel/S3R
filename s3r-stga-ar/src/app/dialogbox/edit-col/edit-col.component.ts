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
    collection: any;
    name: string;
    id: number;
    form: FormGroup;

    constructor(private dialogRef: MatDialogRef<DeleteColComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.collection = data;
        this.name = data["name"];
        this.id = data["id"];
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl('', [Validators.required])
        })
    }

    save() {
        const fd = new FormData();
        fd.append("name", this.name);
        fd.append("collection_id", this.collection["collection_id"]["id"]);

        this.apiService.updateCollection(this.id, fd)
            .subscribe((data) => {
                console.log(data);
            });

        this.dialogRef.close();
    }

    cancel() {
        this.dialogRef.close();
    }

}
