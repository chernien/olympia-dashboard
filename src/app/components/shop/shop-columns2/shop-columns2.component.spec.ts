import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopColumns2Component } from './shop-columns2.component';

describe('ShopColumns2Component', () => {
  let component: ShopColumns2Component;
  let fixture: ComponentFixture<ShopColumns2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopColumns2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopColumns2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
