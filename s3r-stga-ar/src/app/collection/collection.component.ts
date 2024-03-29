import {Component, OnInit} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {CreateResComponent} from "../dialogbox/create-res/create-res.component";
import {CreateColComponent} from "../dialogbox/create-col/create-col.component";
import {EditColComponent} from "../dialogbox/edit-col/edit-col.component";
import {DeleteColComponent} from "../dialogbox/delete-col/delete-col.component";
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../services/api.service";
import {LoginService} from "../services/login.service";
import {FileNotFoundComponent} from "../dialogbox/file-not-found/file-not-found.component";

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
    path: {id: number, name: string} [];

    constructor(private createResDialog: MatDialog,
                private createColDialog: MatDialog,
                private editColDialog: MatDialog,
                private deleteColDialog: MatDialog,
                private deleteFailDialog: MatDialog,
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
                    this.path = data["data"]["path"].reverse();
                });
            this.apiService.getCollectionCollections(parseInt(params["id"]))
                .subscribe((data) => {
                    this.foundChildren = this.sortAlphabetic(data["data"]);
                });
            this.apiService.getCollectionResources(parseInt(params["id"]))
                .subscribe((data) => {
                    this.resources = data["data"];
                    this.containsRes = (this.resources.length !== 0);
                });
        });

        this.loginService.sub().subscribe(data => {
            this.isLoggedIn = data;
        });

    }

    ngOnInit() {
        this.route.queryParams
            .subscribe((queries) => {
                this.sort = queries["sort"];
                this.filter = queries["filter"];
            });
    }

    sortAlphabetic(data: any[]): any[] {
        return data.sort((a, b) => a.name < b.name ? -1: a.name > b.name ? 1:  0 );
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
                    this.foundChildren = this.sortAlphabetic(result["data"]);
                });
        });
    }

    editCol(collection: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = collection;

        const openedDialog = this.editColDialog.open(EditColComponent, dialogConfig);
        openedDialog.afterClosed().subscribe(() => {
            this.apiService.getCollectionResources(parseInt(this.collectionID))
                .subscribe((data) => {
                    this.resources = data["data"];
                    console.log(this.resources);
                    this.containsRes = (this.resources.length !== 0);
                });
            this.apiService.getCollectionCollections(parseInt(this.collectionID))
                .subscribe((data) => {
                    this.foundChildren = this.sortAlphabetic(data["data"]);
                });
        });
    }

    deleteCol(collection: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = collection;

        const t = this.deleteColDialog.open(DeleteColComponent, dialogConfig);
        t.afterClosed()
            .subscribe((data) => {
                if (data.success) {
                    this.apiService.getCollection(parseInt(this.collectionID))
                        .subscribe((result) => {
                            this.collectionName = result["data"]["name"];
                            this.isLeaf = result["data"]["isLeaf"];
                        });
                    this.apiService.getCollectionCollections(parseInt(this.collectionID))
                        .subscribe((result) => {
                            this.foundChildren = this.sortAlphabetic(result["data"]);
                        });
                    this.apiService.getCollectionResources(parseInt(this.collectionID))
                        .subscribe((result) => {
                            this.resources = result["data"];
                            this.containsRes = (this.resources.length !== 0);
                        });
                } else {
                    const dialogConfig2 = new MatDialogConfig();
                    dialogConfig2.disableClose = true;
                    dialogConfig2.autoFocus = true;
                    dialogConfig2.data = {
                        message: "Diese Sammlung kann nicht gelöscht werden, da es mindestens eine Sammlung bzw. ein Objekt beinhaltet"
                    };
                    this.deleteFailDialog.open(FileNotFoundComponent, dialogConfig2);

                }
            }
        );
    }

}
