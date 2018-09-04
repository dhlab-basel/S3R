import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteResComponent } from './delete-res.component';

describe('DeleteResComponent', () => {
  let component: DeleteResComponent;
  let fixture: ComponentFixture<DeleteResComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteResComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteResComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
