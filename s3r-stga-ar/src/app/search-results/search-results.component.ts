import {Component, Input, OnInit, SimpleChanges} from "@angular/core";
import {Router} from "@angular/router";

export interface Data {
    key: string;
    value: string;
}

@Component({
    selector: "app-search-results",
    templateUrl: "./search-results.component.html",
    styleUrls: ["./search-results.component.css"]
})
export class SearchResultsComponent implements OnInit {
    @Input() resultsOfSearch: any;
    @Input() sort: string;
    @Input() filter: string;

    sortParameterList: Data[] = [
        {key: "title", value: "Titel"},
        {key: "creator", value: "Urheberin/ Urheber"},
        {key: "date_start", value: "Jahr"},
        {key: "identifier", value: "Identifikator"},
        {key: "description", value: "Beschreibung"}
    ];

    authorList: any[];
    filetypeList: any[];
    yearList: any[];
    searchword: string;
    sortSelected: string;
    sortedFilteredResults: any;

    constructor(private router: Router) {
    }

    ngOnInit() {
        console.log(this.sort, this.filter);

        if (this.sort) {
            this.sortSelected = this.sort;
        } else {
            this.sortSelected = "title";
        }

        this.applyFilter();
        this.applySort(this.sortSelected);

    }

    getAmountResults() {
        const results = (this.sortedFilteredResults.length === 1) ? "Resultat" : "Resultate" ;
        return `${this.sortedFilteredResults.length} ${results} sortieren nach`;
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log("ngOnChange", this.resultsOfSearch, this.sortedFilteredResults);
        if (changes["resultsOfSearch"]) {
            console.log("change before resultsOfSearch", this.resultsOfSearch, this.sortedFilteredResults);
            this.sortedFilteredResults = this.resultsOfSearch.slice();
            this.filterAuthorUpdate();
            this.filterFileTypeUpdate();
            this.filterYearUpdate();
            console.log("change after resultsOfSearch", this.resultsOfSearch, this.sortedFilteredResults);
            this.applySort(this.sort);
        }

        if (changes["sort"]) {
            console.log("change of sort");
            this.applySort(this.sort);
        }

        if (changes["filter"]) {
            console.log("change filter", this.filter);
            this.applyFilter();
        }
    }

    filterAuthorUpdate() {
        const author = this.resultsOfSearch.reduce(
            (totals, p) => ({...totals, [p.creator]: (totals[p.creator] || 0) + 1 }), {}
        );
        this.authorList = Object.entries(author);
        this.authorList.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
    }

    filterFileTypeUpdate() {
        const filetype = this.resultsOfSearch.reduce(
            (totals, p) => ({...totals, [p.mimetype]: (totals[p.mimetype] || 0) + 1 }), {}
        );
        this.filetypeList = Object.entries(filetype);
        this.filetypeList.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
    }

    filterYearUpdate() {
        const year = this.resultsOfSearch.reduce(
            (totals, p) => {
                console.log(p.date_start, p.date_end);
                if (p.date_start !== p.date_end) {
                    return ({...totals, "Zeitperiode" : (totals["Zeitperiode"] || 0) + 1 });
                } else {
                    return ({...totals, [p.date_start]: (totals[p.date_start] || 0) + 1 });
                }
            }, {}
        );
        this.yearList = Object.entries(year);
        this.yearList.sort((a, b) => a[0] > b[0] ? -1 : a[0] < b[0] ? 1 : 0);
    }

    applyFilter() {
        if (this.filter) {
            console.log("change of filter");
            const arr = this.filter.split("_");
            switch (arr[0]) {
                case ("type"): {
                    this.filterFileTyp(arr[1]);
                    break;
                }
                case "author": {
                    this.filterAuthor(arr[1]);
                    break;
                }
                case "year": {
                    this.filterYear(arr[1]);
                    break;
                }
            }
        } else {
            this.abortFilter();
        }
    }

    getPicturePath(resulttype: string) {
        switch (resulttype) {
            case "application/pdf": {
                return "./assets/files/pdf.png";
            }
            case "image/jpeg": {
                return "./assets/files/jpg.png";
            }
            case "image/tiff": {
                return "./assets/files/tiff.png";
            }
            default: {
                return "./assets/files/png.png";
            }
        }
    }

    convertDate(start: number, end: number) {
        return (start === end) ? start : `${start}-${end}`;
    }

    applySort(value: string) {
        console.log("apply sort");
        if (value === "date") {
            // neues datum zuerst, deshalb andere sortierung
            this.sortedFilteredResults.sort((a, b) => a[this.sortSelected] > b[this.sortSelected] ? -1 : a[this.sortSelected] < b[this.sortSelected] ? 1 : 0);
        } else {
            this.sortedFilteredResults.sort((a, b) => a[this.sortSelected] < b[this.sortSelected] ? -1 : a[this.sortSelected] > b[this.sortSelected] ? 1 : 0);
        }
    }

    sorting() {
        this.router.navigate([], {queryParams: {sort : `${this.sortSelected}`}, queryParamsHandling : "merge" });
    }

    filterYear(year: string) {
        this.abortFilter();
        if (year === "Zeitperiode") {
            console.log("Zeitperiode");
            this.sortedFilteredResults = this.sortedFilteredResults.filter((element) => element["date_start"] !== element["date_end"]);
        } else {
            console.log("keine Zeitperiode");
            this.sortedFilteredResults = this.sortedFilteredResults.filter((element) => element["date_start"] === parseInt(year));
        }
        this.applySort(this.sortSelected);
    }

    filterFileTyp(filetype: string) {
        this.abortFilter();
        this.sortedFilteredResults = this.sortedFilteredResults.filter((element) => element["mimetype"] === filetype);
        this.applySort(this.sortSelected);
    }

    filterAuthor(author: string) {
        this.abortFilter();
        this.sortedFilteredResults = this.sortedFilteredResults.filter((element) => element["creator"] === author);
        this.applySort(this.sortSelected);
    }

    abortFilter() {
        this.sortedFilteredResults = this.resultsOfSearch.slice();
        this.applySort(this.sortSelected);
    }

    revertFilter() {
        this.router.navigate([], {queryParams: {filter : null}, queryParamsHandling : "merge" });
    }
}