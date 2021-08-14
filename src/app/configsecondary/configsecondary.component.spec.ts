import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigsecondaryComponent } from './configsecondary.component';

describe('ConfigsecondaryComponent', () => {
  let component: ConfigsecondaryComponent;
  let fixture: ComponentFixture<ConfigsecondaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigsecondaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigsecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
