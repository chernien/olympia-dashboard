import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountClientComponent } from './account-client.component';

describe('AccountClientComponent', () => {
  let component: AccountClientComponent;
  let fixture: ComponentFixture<AccountClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
