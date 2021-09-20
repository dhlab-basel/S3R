import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateColComponent } from "./create-col.component";

describe("CreateColComponent", () => {
  let component: CreateColComponent;
  let fixture: ComponentFixture<CreateColComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateColComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
