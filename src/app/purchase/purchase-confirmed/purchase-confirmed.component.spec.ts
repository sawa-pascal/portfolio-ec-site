import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseConfirmedComponent } from './purchase-confirmed.component';

describe('PurchaseConfirmedComponent', () => {
  let component: PurchaseConfirmedComponent;
  let fixture: ComponentFixture<PurchaseConfirmedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseConfirmedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
