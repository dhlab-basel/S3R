import {Component, OnInit} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {CreateResComponent} from "../dialogbox/create-res/create-res.component";
import {CreateColComponent} from "../dialogbox/create-col/create-col.component";
import {EditColComponent} from "../dialogbox/edit-col/edit-col.component";
import {DeleteColComponent} from "../dialogbox/delete-col/delete-col.component";
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../services/api.service";
import {LoginService} from "../services/login.service";

export interface Parent {
    url: string;
    id: number;
}

export interface Collection {
    id: number;
    name: string;
    isLeaf: number;
    collection_id: Parent;
    children: Collection[];
}

@Component({
    selector: "app-collection",
    templateUrl: "./collection.component.html",
    styleUrls: ["./collection.component.css"]
})
export class CollectionComponent implements OnInit {
    foundChildren: any[];
    resources: any[];
    collectionName: string;
    collectionID: string;
    isLeaf: boolean;
    containsRes: boolean;
    sort: string;
    filter: string;
    isLoggedIn: boolean;

    constructor(private createResDialog: MatDialog,
                private createColDialog: MatDialog,
                private editColDialog: MatDialog,
                private deleteColDialog: MatDialog,
                private route: ActivatedRoute,
                private apiService: ApiService,
                private loginService: LoginService) {
        this.route.params.subscribe(params => {
            this.collectionID = params["id"];
            // this.foundChildren = this.findChildrenByParent(parseInt(params["id"]), this.collectionList3);
            // console.log(this.foundChildren);
            this.apiService.getCollection(parseInt(params["id"]))
                .subscribe((data) => {
                    this.collectionName = data["data"]["name"];
                    this.isLeaf = data["data"]["isLeaf"];
                });
            this.apiService.getCollectionCollections(parseInt(params["id"]))
                .subscribe((data) => {
                    this.foundChildren = data["data"].sort((a, b) => a.name < b.name ? -1: a.name > b.name ? 1:  0 );
                });
            this.apiService.getCollectionResources(parseInt(params["id"]))
                .subscribe((data) => {
                    this.resources = data["data"];
                    console.log(this.resources);
                    this.containsRes = (this.resources.length !== 0);
                });
        });

        this.isLoggedIn = loginService.isLoggedIn();
    }

    ngOnInit() {
        this.route.queryParams
            .subscribe((queries) => {
                this.sort = queries["sort"];
                this.filter = queries["filter"];
            });
    }

    findChildrenByParent(id: number, children: any[]) {
        let found: any[] = [];
        for (const child of children) {
            if (child.id === id) {
                return child.children;
            } else {
                if (!child.isLeaf) {
                    found = this.findChildrenByParent(id, child.children);
                }
            }
        }
        return found;
    }

    createRes() {
        console.log("create res");
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            "colID": this.collectionID,
            "colName": this.collectionName
        };

        const bla = this.createResDialog.open(CreateResComponent, dialogConfig);
        bla.afterClosed().subscribe(() => {
            this.apiService.getCollectionResources(parseInt(this.collectionID))
                .subscribe((data) => {
                    this.resources = data["data"];
                    this.containsRes = (this.resources.length !== 0);
                });
        });
    }

    createCol() {
        console.log("create col");
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            "colID": this.collectionID
        };

        const d = this.createColDialog.open(CreateColComponent, dialogConfig);
        d.afterClosed().subscribe((data) => {
            this.apiService.getCollection(parseInt(this.collectionID))
                .subscribe((result) => {
                    this.collectionName = result["data"]["name"];
                    this.isLeaf = result["data"]["isLeaf"];
                });
            this.apiService.getCollectionCollections(parseInt(this.collectionID))
                .subscribe((result) => {
                    this.foundChildren = result["data"];
                });
        });
    }

    editCol(collection: any) {
        console.log("edit col");
        console.log(collection);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = collection;

        const bla = this.editColDialog.open(EditColComponent, dialogConfig);
        bla.afterClosed().subscribe(() => {
            this.apiService.getCollectionResources(parseInt(this.collectionID))
                .subscribe((data) => {
                    this.resources = data["data"];
                    console.log(this.resources);
                    this.containsRes = (this.resources.length !== 0);
                });
            this.apiService.getCollectionCollections(parseInt(this.collectionID))
                .subscribe((data) => {
                    this.foundChildren = data["data"];
                });
        });
    }

    deleteCol(collection: any) {
        console.log("delete col");
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = collection;

        const t = this.deleteColDialog.open(DeleteColComponent, dialogConfig);
        t.afterClosed()
            .subscribe((data) => {
                this.apiService.getCollection(parseInt(this.collectionID))
                    .subscribe((result) => {
                        this.collectionName = result["data"]["name"];
                        this.isLeaf = result["data"]["isLeaf"];
                    });
                this.apiService.getCollectionCollections(parseInt(this.collectionID))
                    .subscribe((result) => {
                        this.foundChildren = result["data"];
                    });
                this.apiService.getCollectionResources(parseInt(this.collectionID))
                    .subscribe((result) => {
                        this.resources = result["data"];
                        console.log(this.resources);
                        this.containsRes = (this.resources.length !== 0);
                    });
                console.log(data);
            }, (error) => {
                console.log(error);
            }
        );
    }

}
