import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators, FormArray, FormGroup, FormControl } from "@angular/forms";
import { Http } from "@angular/http";

import { fakeBackendProvider } from './helpers/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { BrowserModule } from "@angular/platform-browser";

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule, FormsModule, ReactiveFormsModule, HttpModule
      ],
      declarations: [
        AppComponent, RegisterComponent
      ],
      providers: [
        fakeBackendProvider, MockBackend, BaseRequestOptions
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have the register form component', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('register-form')).not.toBe(null);
  }));
});
