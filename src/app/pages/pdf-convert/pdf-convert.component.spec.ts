/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PdfConvertComponent } from './pdf-convert.component';

describe('PdfConvertComponent', () => {
  let component: PdfConvertComponent;
  let fixture: ComponentFixture<PdfConvertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfConvertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
