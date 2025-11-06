import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseConfirmComponent } from './purchase-confirm.component';

describe('PurchaseConfirmComponent', () => {
  let component: PurchaseConfirmComponent;
  let fixture: ComponentFixture<PurchaseConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
