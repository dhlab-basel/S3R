import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../services/api.service";

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
    private static readonly SEARCH_SEPARATORS = [" ", "+", ",", ";"];
    data: any[];
    noResult: boolean;
    sort: string;
    filter: string;
    searchword: string;

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

    replaceSeparators(searchWord: string): string {
        let correctedSearchWord = searchWord;
        for (const separator of SearchComponent.SEARCH_SEPARATORS) {
            correctedSearchWord = correctedSearchWord.split(separator).join(" ");
        }
        return correctedSearchWord;
    }

    startRequest(searchWord: string) {
        this.apiService.fullSearch(`${searchWord}`).subscribe((data) => {
            this.noResult = false;

            if (data["data"].length === 0) {
                this.data = null;
                this.noResult = true;
            } else {
                this.data = data["data"];
            }
        }, (error) => console.log(error));

    }

}
