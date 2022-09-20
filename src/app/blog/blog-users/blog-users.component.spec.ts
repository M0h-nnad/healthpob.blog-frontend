import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogUsersComponent } from './blog-users.component';

describe('BlogUsersComponent', () => {
  let component: BlogUsersComponent;
  let fixture: ComponentFixture<BlogUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
