import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PastordashboardPage } from './pastordashboard.page';

describe('PastordashboardPage', () => {
  let component: PastordashboardPage;
  let fixture: ComponentFixture<PastordashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PastordashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
