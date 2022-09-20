import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogUserViewComponent } from './blog-user-view.component';

describe('BlogUserViewComponent', () => {
  let component: BlogUserViewComponent;
  let fixture: ComponentFixture<BlogUserViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogUserViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogUserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
