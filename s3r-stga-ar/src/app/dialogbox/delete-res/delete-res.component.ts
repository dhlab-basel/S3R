import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/api.service";
import {Location} from "@angular/common";

@Component({
    selector: "app-delete-res",
    templateUrl: "./delete-res.component.html",
    styleUrls: ["./delete-res.component.css"]
})
export class DeleteResComponent implements OnInit {
    resID: number;

    constructor(private dialogRef: MatDialogRef<DeleteResComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService, private location: Location) {
        this.resID = data["resID"];
        console.log(this.resID);
    }

    ngOnInit() {
    }

    delete() {
        this.apiService.deleteResource(this.resID)
            .subscribe((data) => {
                console.log(data);
                this.dialogRef.close();
                this.location.back();
            }, (error) => console.log(error));
    }

    abort() {
        this.dialogRef.close();
    }
}
