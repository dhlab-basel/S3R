import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../services/api.service";
import {forEach} from "@angular/router/src/utils/collection";

export interface FilterOptions {
    key: string;
    value: string;
}

@Component({
    selector: "app-search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit {
    data: any[];
    noResult: boolean;
    sort: string;
    filter: string;
    searchword: string;

    private static readonly SEARCH_SEPARATORS = [" ", "+", ",", ";"];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private apiService: ApiService) {
    }

    ngOnInit() {
        this.noResult = false;
        this.searchword = "";

        this.route.paramMap.subscribe(params => {
            console.log("change param", params);
            if (typeof(params["params"]["word"]) !== "undefined") {
                this.searchword = params.get("word");
            }

            this.startRequest(this.searchword);
        });

        this.route.queryParams
            .subscribe((queries) => {
                this.sort = queries["sort"];
                this.filter = queries["filter"];
            });
    }

    startSearch() {
        this.searchword = this.replaceSeparators(this.searchword);
        this.router.navigate(["search", this.searchword], { queryParams: {filter: null} , queryParamsHandling : "merge"});
    }

    replaceSeparators(searchword: string): string {
        let correctedSearchWord = searchword;
        for(let separator of SearchComponent.SEARCH_SEPARATORS) {
            correctedSearchWord = correctedSearchWord.split(separator).join(" ");
        }
        return correctedSearchWord;
    }

    startRequest(searchword: string) {
        this.apiService.fullSearch(`${searchword}`).subscribe((data) => {
            console.log("api search", data);
            this.noResult = false;

            if (data["data"].length === 0) {
                this.data = null;
                this.noResult = true;
                console.log(this.data);
            } else {
                this.data = data["data"];
                console.log("found more than 1 resutlt");
            }
        }, (error) => console.log(error));

    }

}
