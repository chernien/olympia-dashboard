import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductExtendedComponent } from './product-extended.component';

describe('ProductExtendedComponent', () => {
  let component: ProductExtendedComponent;
  let fixture: ComponentFixture<ProductExtendedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductExtendedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductExtendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
