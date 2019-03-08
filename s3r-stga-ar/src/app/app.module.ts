import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {APP_BASE_HREF} from "@angular/common";

import {AppComponent} from "./app.component";
import {SearchComponent} from "./search/search.component";
import {ExtendedSearchComponent} from "./extended-search/extended-search.component";
import {CollectionComponent} from "./collection/collection.component";
import {HelpComponent} from "./help/help.component";
import {ContactComponent} from "./contact/contact.component";
import {CreateResComponent} from "./dialogbox/create-res/create-res.component";
import {EditResComponent} from "./dialogbox/edit-res/edit-res.component";
import {DeleteResComponent} from "./dialogbox/delete-res/delete-res.component";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
    MatCardModule, MatDialogModule, MatDividerModule,
    MatExpansionModule, MatSelectModule, MatButtonModule, MatInputModule, MatListModule, MatIconModule, MatRadioModule,
    MatToolbarModule
} from "@angular/material";

import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {File} from "./model/file";
import {SearchResultsComponent} from "./search-results/search-results.component";
import {ResourcesComponent} from "./resources/resources.component";
import {EditColComponent} from "./dialogbox/edit-col/edit-col.component";
import {DeleteColComponent} from "./dialogbox/delete-col/delete-col.component";
import {CreateColComponent} from "./dialogbox/create-col/create-col.component";
import {HttpClientModule} from "@angular/common/http";
import {LoginDialogComponent} from "./dialogbox/login-dialog/login-dialog.component";
import {LoginService} from "./services/login.service";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
    {path: "search", component: SearchComponent},
    {path: "search/:word", component: SearchComponent},
    {path: "extended-search", component: ExtendedSearchComponent},
    {path: "collections", redirectTo: "collections/1", pathMatch: "full"},
    {path: "collections/:id", component: CollectionComponent},
    {path: "resources/:id", component: ResourcesComponent},
    {path: "help", component: HelpComponent},
    {path: "contact", component: ContactComponent},
    {path: "", redirectTo: "search", pathMatch: "full"},
    {path: "**", component: PageNotFoundComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        CreateResComponent,
        EditResComponent,
        DeleteResComponent,
        SearchComponent,
        CollectionComponent,
        HelpComponent,
        ContactComponent,
        ExtendedSearchComponent,
        SearchResultsComponent,
        ResourcesComponent,
        EditColComponent,
        DeleteColComponent,
        CreateColComponent,
        LoginDialogComponent,
        PageNotFoundComponent
    ],
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatDividerModule,
        MatExpansionModule,
        FlexLayoutModule,
        MatDialogModule,
        MatListModule,
        MatIconModule,
        MatRadioModule,
        MatToolbarModule
    ],
    providers: [
        {provide: APP_BASE_HREF, useValue: "/"},
        File,
        LoginService
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        CreateResComponent,
        EditResComponent,
        DeleteResComponent,
        CreateColComponent,
        EditColComponent,
        DeleteColComponent,
        LoginDialogComponent
    ]
})
export class AppModule {
}
