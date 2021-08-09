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
                this.dialogRef.close({
                    success: true,
                    status: null
                });
            }, (error) => {
                this.dialogRef.close({
                    success: false,
                    status: error.status
                });
            });
    }

    abort() {
        this.dialogRef.close();
    }
}
