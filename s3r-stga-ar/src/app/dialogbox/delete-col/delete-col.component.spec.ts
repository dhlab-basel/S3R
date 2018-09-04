import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {DeleteColComponent} from "./delete-col.component";

describe("DeleteColComponent", () => {
    let component: DeleteColComponent;
    let fixture: ComponentFixture<DeleteColComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DeleteColComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DeleteColComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
