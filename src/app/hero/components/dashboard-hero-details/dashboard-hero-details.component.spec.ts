import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHeroDetailsComponent } from './dashboard-hero-details.component';

describe('DashboardHeroDetailsComponent', () => {
  let component: DashboardHeroDetailsComponent;
  let fixture: ComponentFixture<DashboardHeroDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHeroDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardHeroDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
