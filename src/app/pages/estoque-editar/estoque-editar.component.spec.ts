import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoqueEditarComponent } from './estoque-editar.component';

describe('EstoqueEditarComponent', () => {
  let component: EstoqueEditarComponent;
  let fixture: ComponentFixture<EstoqueEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstoqueEditarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstoqueEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
