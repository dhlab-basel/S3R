import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/api.service";

@Component({
    selector: "app-create-col",
    templateUrl: "./create-col.component.html",
    styleUrls: ["./create-col.component.css"]
})
export class CreateColComponent implements OnInit {
    collectionID: string;
    name: string;

    constructor(private dialogRef: MatDialogRef<CreateColComponent>, @Inject(MAT_DIALOG_DATA) data,
                private apiService: ApiService) {
        this.collectionID = data["colID"];
    }

    ngOnInit() {
    }

    create() {
        const fd = new FormData();
        fd.append("collection_id", this.collectionID);
        fd.append("name", this.name);
        this.apiService.createCollection(fd)
            .subscribe((result) => console.log(result));
        this.dialogRef.close();
    }

    cancel() {
        this.dialogRef.close();
    }

}
