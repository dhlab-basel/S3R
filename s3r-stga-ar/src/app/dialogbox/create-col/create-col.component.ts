import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/api.service";
import {NgForm} from "@angular/forms";

@Component({
    selector: "app-create-col",
    templateUrl: "./create-col.component.html",
    styleUrls: ["./create-col.component.css"]
})
export class CreateColComponent implements OnInit {
    collectionID: string;

    constructor(private dialogRef: MatDialogRef<CreateColComponent>, @Inject(MAT_DIALOG_DATA) data,
                private apiService: ApiService) {
        this.collectionID = data["colID"];
    }

    ngOnInit() {
    }

    create(form: NgForm) {
        console.log(form);
        const fd = new FormData();
        fd.append("collection_id", this.collectionID);
        fd.append("name", form.value.name);
        this.apiService.createCollection(fd)
            .subscribe((result) => console.log(result));
        this.dialogRef.close();
    }

    cancel() {
        this.dialogRef.close();
    }

}
