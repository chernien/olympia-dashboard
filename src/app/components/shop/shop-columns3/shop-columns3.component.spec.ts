import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopColumns3Component } from './shop-columns3.component';

describe('ShopColumns3Component', () => {
  let component: ShopColumns3Component;
  let fixture: ComponentFixture<ShopColumns3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopColumns3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopColumns3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
