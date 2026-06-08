import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopColumns4Component } from './shop-columns4.component';

describe('ShopColumns4Component', () => {
  let component: ShopColumns4Component;
  let fixture: ComponentFixture<ShopColumns4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopColumns4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopColumns4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
