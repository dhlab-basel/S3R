import {Component, OnInit} from "@angular/core";
import {ApiService} from "../services/api.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

export interface Dublincore {
    value: string;
    viewValue: string;
    disabled: boolean;
}

export interface ComparisonOp {
    value: string;
    viewValue: string;
    show: boolean;
}

@Component({
    selector: "app-extended-search",
    templateUrl: "./extended-search.component.html",
    styleUrls: ["./extended-search.component.css"]
})
export class ExtendedSearchComponent implements OnInit {
    dublinCoreList: Dublincore[] = [
        {value: "title", viewValue: "Titel", disabled: false},
        {value: "creator", viewValue: "Autor/Autorin", disabled: false},
        {value: "contributor", viewValue: "Beteiligte", disabled: false},
        {value: "date", viewValue: "Jahr", disabled: false},
        {value: "publisher", viewValue: "Ort: Verlag", disabled: false},
        {value: "isbn", viewValue: "ISBN", disabled: false},
        {value: "signature", viewValue: "Signature", disabled: false},
        {value: "language", viewValue: "Sprache", disabled: false},
        {value: "subject", viewValue: "Thema", disabled: false},
        {value: "description", viewValue: "Beschreibung", disabled: false},
        {value: "rights", viewValue: "Rechte", disabled: false},

        // Dublin Core Fields which are not used
        // {value: "type", viewValue: "Typ", disabled: false},
        // {value: "format", viewValue: "Format", disabled: false},
        // {value: "identifier", viewValue: "Identifikator", disabled: false},
        // {value: "source", viewValue: "Quelle", disabled: false},
        // {value: "relation", viewValue: "Beziehung", disabled: false},
        // {value: "coverage", viewValue: "Geltungsbereich", disabled: false},
        // {value: "collection", viewValue: "Collection", disabled: false}
    ];

    comparisonOp1: ComparisonOp[] = [
        {value: "eq", viewValue: "ist exakt", show: true},
        {value: "like", viewValue: "enthält", show: true},
        {value: "!like", viewValue: "enthält nicht", show: true},
        {value: "gt", viewValue: "später als", show: false},
        {value: "lt", viewValue: "früher als", show: false},
        {value: "between", viewValue: "zwischen", show: false},
    ];

    comparisonOp2: ComparisonOp[] = [
        {value: "eq", viewValue: "ist exakt", show: true},
        {value: "like", viewValue: "enthält", show: true},
        {value: "!like", viewValue: "enthält nicht", show: true},
        {value: "gt", viewValue: "später als", show: false},
        {value: "lt", viewValue: "früher als", show: false},
        {value: "between", viewValue: "zwischen", show: false},
    ];

    comparisonOp3: ComparisonOp[] = [
        {value: "eq", viewValue: "ist exakt", show: true},
        {value: "like", viewValue: "enthält", show: true},
        {value: "!like", viewValue: "enthält nicht", show: true},
        {value: "gt", viewValue: "später als", show: false},
        {value: "lt", viewValue: "früher als", show: false},
        {value: "between", viewValue: "zwischen", show: false},
    ];

    dublinField1: string;
    dublinField2: string;
    dublinField3: string;
    compare1: string;
    compare2: string;
    compare3: string;
    searchWord1: string;
    searchWord2: string;
    searchWord3: string;
    field1Year1: string;
    field1Year2: string;
    field2Year1: string;
    field2Year2: string;
    field3Year1: string;
    field3Year2: string;

    sort: string;
    filter: string;
    data: any[];
    noResult: boolean;

    constructor(private apiService: ApiService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.noResult = false;

        this.route.queryParams
            .subscribe((queryParams: Params) => {
                console.log("change query params 1", queryParams["sw1"], queryParams["dc1"], queryParams["cp1"], this.searchWord1, this.sort, this.filter);
                console.log("change query params 1", queryParams["sw2"], queryParams["dc2"], queryParams["cp2"], this.searchWord2, this.sort, this.filter);

                let parSet1 = false;
                let parSet2 = false;
                let parSet3 = false;

                if ((queryParams["dc1"]) && (queryParams["cp1"])) {
                    this.dublinField1 = queryParams["dc1"];
                    this.compare1 = queryParams["cp1"];

                    if ((queryParams["cp1"] === "null") || (queryParams["cp1"] === "!null")) {
                        parSet1 = true;
                    }

                    if (queryParams["cp1"] === "between") {
                        // Checken ob sw1 so aussieht: "2006:2008" -> falsch ist "2006"
                        const years = queryParams["sw1"].split(":");
                        this.field1Year1 = years[0];
                        this.field1Year2 = years[1];
                        parSet1 = true;
                    }

                    if ((queryParams["dc1"] === "date") && (queryParams["cp1"] !== "between")) {
                        this.field1Year1 = queryParams["sw1"];
                        this.field1Year2 = null;
                        parSet1 = true;
                    }

                    if ((queryParams["sw1"]) && (queryParams["dc1"] !== "date")) {
                        this.searchWord1 = queryParams["sw1"];
                        parSet1 = true;
                    }
                } else {
                    parSet1 = false;
                    this.dublinField1 = "title";
                    this.compare1 = "like";
                }

                if ((queryParams["dc2"]) && (queryParams["cp2"])) {
                    this.dublinField2 = queryParams["dc2"];
                    this.compare2 = queryParams["cp2"];

                    if ((queryParams["cp2"] === "null") || (queryParams["cp2"] === "!null")) {
                        parSet2 = true;
                    }

                    if (queryParams["cp2"] === "between") {
                        // Checken ob sw1 so aussieht: "2006:2008" -> falsch ist "2006"
                        const years = queryParams["sw2"].split(":");
                        this.field2Year1 = years[0];
                        this.field2Year2 = years[1];
                        parSet2 = true;
                    }

                    if ((queryParams["dc2"] === "date") && (queryParams["cp2"] !== "between")) {
                        this.field2Year1 = queryParams["sw2"];
                        this.field2Year2 = null;
                        parSet2 = true;
                    }

                    if ((queryParams["sw2"]) && (queryParams["dc2"] !== "date")) {
                        this.searchWord2 = queryParams["sw2"];
                        parSet2 = true;
                    }
                } else {
                    parSet2 = false;
                    this.dublinField2 = "creator";
                    this.compare2 = "like";
                }

                if ((queryParams["dc3"]) && (queryParams["cp3"])) {
                    this.dublinField3 = queryParams["dc3"];
                    this.compare3 = queryParams["cp3"];

                    if ((queryParams["cp3"] === "null") || (queryParams["cp3"] === "!null")) {
                        parSet3 = true;
                    }

                    if (queryParams["cp3"] === "between") {
                        // Checken ob sw1 so aussieht: "2006:2008" -> falsch ist "2006"
                        const years = queryParams["sw3"].split(":");
                        this.field3Year1 = years[0];
                        this.field3Year2 = years[1];
                        parSet3 = true;
                    }

                    if ((queryParams["dc3"] === "date") && (queryParams["cp3"] !== "between")) {
                        this.field3Year1 = queryParams["sw3"];
                        this.field3Year2 = null;
                        parSet3 = true;
                    }

                    if ((queryParams["sw1"]) && (queryParams["dc1"] !== "date")) {
                        this.searchWord3 = queryParams["sw3"];
                        parSet3 = true;
                    }
                } else {
                    parSet3 = false;
                    this.dublinField3 = "subject";
                    this.compare3 = "like";
                }

                this.updateSelection("");

                if ((parSet1) || (parSet2) || (parSet3)) {
                    this.startRequest(queryParams);
                }

            });
    }

    // hasChangedParameters(queryParams: Params): boolean {
    //     return (
    //         (queryParams["dc1"] !== this.dublinField1) || (queryParams["cp1"] !== this.compare1) || (queryParams["sw1"] !== this.searchWord1) ||
    //         (queryParams["dc2"] !== this.dublinField2) || (queryParams["cp2"] !== this.compare2) || (queryParams["sw2"] !== this.searchWord2) ||
    //         (queryParams["dc3"] !== this.dublinField3) || (queryParams["cp3"] !== this.compare3) || (queryParams["sw3"] !== this.searchWord3));
    // }

    startExtendedSearch() {
        console.log("hier");
        let queryParams: Params;
        queryParams = {filter: null};

        // Wichtig die Reihenfolge
        if ((this.compare1 === "null") || (this.compare1 === "!null")) {
            queryParams["dc1"] = this.dublinField1;
            queryParams["cp1"] = this.compare1;
            queryParams["sw1"] = null;
        } else if (this.searchWord1) {
            queryParams["dc1"] = this.dublinField1;
            queryParams["cp1"] = this.compare1;
            queryParams["sw1"] = this.searchWord1;
        } else if ((this.dublinField1 === "date") && ((this.compare1 === "null") || (this.compare1 === "!null"))) {
            queryParams["dc1"] = this.dublinField1;
            queryParams["cp1"] = this.compare1;
        } else if ((this.dublinField1 === "date") && (this.compare1 !== "between") && (this.field1Year1)) {
            queryParams["dc1"] = this.dublinField1;
            queryParams["cp1"] = this.compare1;
            queryParams["sw1"] = this.field1Year1;
        } else if ((this.dublinField1 === "date") && (this.compare1 === "between") && (this.field1Year1) && (this.field1Year2)) {
            queryParams["dc1"] = this.dublinField1;
            queryParams["cp1"] = this.compare1;
            queryParams["sw1"] = `${this.field1Year1}:${this.field1Year2}`;
        }

        // Wichtig die Reihenfolge
        if ((this.compare2 === "null") || (this.compare2 === "!null")) {
            queryParams["dc2"] = this.dublinField2;
            queryParams["cp2"] = this.compare2;
            queryParams["sw2"] = null;
        } else if (this.searchWord2) {
            queryParams["dc2"] = this.dublinField2;
            queryParams["cp2"] = this.compare2;
            queryParams["sw2"] = this.searchWord2;
        } else if ((this.dublinField2 === "date") && ((this.compare2 === "null") || (this.compare2 === "!null"))) {
            queryParams["dc2"] = this.dublinField2;
            queryParams["cp2"] = this.compare2;
        } else if ((this.dublinField2 === "date") && (this.compare2 !== "between") && (this.field2Year1)) {
            queryParams["dc2"] = this.dublinField2;
            queryParams["cp2"] = this.compare2;
            queryParams["sw2"] = this.field2Year1;
        } else if ((this.dublinField2 === "date") && (this.compare2 === "between") && (this.field2Year1) && (this.field2Year2)) {
            queryParams["dc2"] = this.dublinField2;
            queryParams["cp2"] = this.compare2;
            queryParams["sw2"] = `${this.field2Year1}:${this.field2Year2}`;
        }

        // Wichtig die Reihenfolge
        if ((this.compare3 === "null") || (this.compare3 === "!null")) {
            queryParams["dc3"] = this.dublinField3;
            queryParams["cp3"] = this.compare3;
            queryParams["sw3"] = null;
        } else if (this.searchWord3) {
            queryParams["dc3"] = this.dublinField3;
            queryParams["cp3"] = this.compare3;
            queryParams["sw3"] = this.searchWord3;
        } else if ((this.dublinField3 === "date") && ((this.compare3 === "null") || (this.compare3 === "!null"))) {
            queryParams["dc3"] = this.dublinField3;
            queryParams["cp3"] = this.compare3;
        } else if ((this.dublinField3 === "date") && (this.compare3 !== "between") && (this.field3Year1)) {
            queryParams["dc3"] = this.dublinField3;
            queryParams["cp3"] = this.compare3;
            queryParams["sw3"] = this.field3Year1;
        } else if ((this.dublinField3 === "date") && (this.compare3 === "between") && (this.field3Year1) && (this.field3Year2)) {
            queryParams["dc3"] = this.dublinField3;
            queryParams["cp3"] = this.compare3;
            queryParams["sw3"] = `${this.field3Year1}:${this.field3Year2}`;
        }

        this.router.navigate([], { queryParams: queryParams})
            .catch((error) => console.log(error));
    }

    startRequest(clientParams: Params) {
        const serverParams = {};

        if ((clientParams["cp1"] === "null") || (clientParams["cp1"] === "!null")) {
            serverParams[clientParams["dc1"]] = `[${clientParams["cp1"]}]`;
        } else if (clientParams["cp1"] === "between") {
            serverParams[clientParams["dc1"]] = `${clientParams["sw1"]}`;
        } else if (clientParams["sw1"]) {
            serverParams[clientParams["dc1"]] = `[${clientParams["cp1"]}]${clientParams["sw1"]}`;
        }

        if ((clientParams["cp2"] === "null") || (clientParams["cp2"] === "!null")) {
            serverParams[clientParams["dc2"]] = `[${clientParams["cp2"]}]`;
        } else if (clientParams["cp2"] === "between") {
            serverParams[clientParams["dc2"]] = `${clientParams["sw2"]}`;
        } else if (clientParams["sw2"]) {
            serverParams[clientParams["dc2"]] = `[${clientParams["cp2"]}]${clientParams["sw2"]}`;
        }

        if ((clientParams["cp3"] === "null") || (clientParams["cp3"] === "!null")) {
            serverParams[clientParams["dc3"]] = `[${clientParams["cp3"]}]`;
        } else if (clientParams["cp3"] === "between") {
            serverParams[clientParams["dc3"]] = `${clientParams["sw3"]}`;
        } else if (clientParams["sw3"]) {
            serverParams[clientParams["dc3"]] = `[${clientParams["cp3"]}]${clientParams["sw3"]}`;
        }

        this.apiService.extendedSearch(serverParams).subscribe((data) => {
             this.noResult = false;
             console.log(data);

            if (data["data"].length === 0) {
                this.data = null;
                this.noResult = true;
            } else {
                this.data = data["data"];
                this.filter = clientParams["filter"];
                this.sort = clientParams["sort"];
            }

        }, (error) => console.log(error));
    }

    updateSelection(dublinField: string) {
        console.log("selection", this.dublinField1, this.dublinField2, this.dublinField3);
        console.log("selection", this.compare1, this.compare2, this.compare3);
        for (const i of this.dublinCoreList) {
            switch (i.value) {
                case (this.dublinField1): {
                    i.disabled = true;
                    break;
                }
                case (this.dublinField2): {
                    i.disabled = true;
                    break;
                }
                case (this.dublinField3): {
                    i.disabled = true;
                    break;
                }
                default: {
                    i.disabled = false;
                    break;
                }
            }
        }

        this.changeComparison(this.dublinField1, this.comparisonOp1);
        this.changeComparison(this.dublinField2, this.comparisonOp2);
        this.changeComparison(this.dublinField3, this.comparisonOp3);

        if ((dublinField === "dc1") && ((this.compare1 === "gt") || (this.compare1 === "lt") || (this.compare1 === "between"))) {
            this.compare1 = "like";
        } else if ((dublinField === "dc2") && ((this.compare2 === "gt") || (this.compare2 === "lt") || (this.compare2 === "between"))) {
            this.compare2 = "like";
        } else if ((dublinField === "dc3") && ((this.compare3 === "gt") || (this.compare3 === "lt") || (this.compare3 === "between"))) {
            this.compare3 = "like";
        }

        if ((dublinField === "dc1") && (this.dublinField1 === "date")) {
            this.searchWord1 = null;
        }

        if ((dublinField === "dc2") && (this.dublinField2 === "date")) {
            this.searchWord2 = null;
        }

        if ((dublinField === "dc3") && (this.dublinField3 === "date")) {
            this.searchWord3 = null;
        }
    }

    private changeComparison(field: string, list: ComparisonOp[]) {
        if (field === "date") {
            for (const i of list) {
                switch (i.value) {
                    case ("eq"): {
                        i.show = false;
                        break;
                    }
                    case ("like"): {
                        i.show = true;
                        break;
                    }
                    case ("!like"): {
                        i.show = false;
                        break;
                    }
                    case ("null"): {
                        i.show = true;
                        break;
                    }
                    case ("!null"): {
                        i.show = true;
                        break;
                    }
                    case ("gt"): {
                        i.show = true;
                        break;
                    }
                    case ("lt"): {
                        i.show = true;
                        break;
                    }
                    case ("between"): {
                        i.show = true;
                        break;
                    }
                }
            }
        } else {
            for (const i of list) {
                switch (i.value) {
                    case ("eq"): {
                        i.show = true;
                        break;
                    }
                    case ("like"): {
                        i.show = true;
                        break;
                    }
                    case ("!like"): {
                        i.show = true;
                        break;
                    }
                    case ("null"): {
                        i.show = true;
                        break;
                    }
                    case ("!null"): {
                        i.show = true;
                        break;
                    }
                    case ("gt"): {
                        i.show = false;
                        break;
                    }
                    case ("lt"): {
                        i.show = false;
                        break;
                    }
                    case ("between"): {
                        i.show = false;
                        break;
                    }
                }
            }

        }
    }

    test() {
        console.log(this.compare2);
    }

}
