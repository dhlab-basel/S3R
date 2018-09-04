import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/api.service";

@Component({
    selector: "app-delete-col",
    templateUrl: "./delete-col.component.html",
    styleUrls: ["./delete-col.component.css"]
})

export class DeleteColComponent implements OnInit {
    collection: any;

    constructor(private dialogRef: MatDialogRef<DeleteColComponent>, @Inject(MAT_DIALOG_DATA) data,
                private apiService: ApiService) {
        this.collection = data;
    }

    ngOnInit() {

    }

    delete() {
        this.apiService.deleteCollection(this.collection["id"])
            .subscribe((data) => {
                console.log(data);
            });
        this.dialogRef.close();
    }

    abort() {
        console.log("abbrechen");
        this.dialogRef.close();
    }
}
