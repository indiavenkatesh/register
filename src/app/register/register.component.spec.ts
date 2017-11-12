import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators, FormArray, FormGroup, FormControl } from "@angular/forms";
import { Http } from "@angular/http";

import { fakeBackendProvider } from '../helpers/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { BrowserModule } from "@angular/platform-browser";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  localStorage.removeItem('users');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule, FormsModule, ReactiveFormsModule, HttpModule
      ],
      declarations: [
        RegisterComponent
      ],
      providers: [
        fakeBackendProvider, MockBackend, BaseRequestOptions
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('firstname invalid when empty', () => {
    let firstname = component.regForm.controls['firstname']; 
    expect(firstname.valid).toBeFalsy(); 
  });

  it('firstname valid when set content', () => {
    let firstname = component.regForm.controls['firstname'];
    component.regForm.patchValue({firstname : 'John'}); 
    expect(firstname.valid).toBeTruthy(); 
  });

  it('firstname label class will be fadeOut when firstname is empty', () => {
    let firstname = component.regForm.controls['firstname'];
    component.regForm.patchValue({firstname : ''});
    expect(component.fadeInOut('firstname')).toBe('fadeOut');
  })

  it('firstname label class will be fadeIn when firstname is not empty', () => {
    let firstname = component.regForm.controls['firstname'];
    component.regForm.patchValue({firstname : 'John'});
    expect(component.fadeInOut('firstname')).toBe('fadeIn');
  })

  it('firstname field class will be \'has-error\' when firstname is empty and dirty', () => {
    let firstname = component.regForm.controls['firstname'];
    component.regForm.patchValue({firstname : ''});
    firstname.markAsDirty();
    expect(component.errorClass('firstname')).toBe('has-error');
  }) 

  it('firstname field class will be \'has-error\' when firstname is empty and not dirty', () => {
    let firstname = component.regForm.controls['firstname'];
    component.regForm.patchValue({firstname : ''});
    expect(component.errorClass('firstname')).toBe('');
  })

  it('email will be valid only when correct email format given', () => {
    let email = component.regForm.controls['email'];
    component.regForm.patchValue({email : 'test@domain.com'});
    expect(email.valid).toBeTruthy();
  })

  it('email will not be valid when in-correct email format given', () => {
    let email = component.regForm.controls['email'];
    component.regForm.patchValue({email : 'testdomain.com'});
    expect(email.valid).toBeFalsy();
  })

  it('hobby will be added if not exists', () =>{
    component.toggleHobby('sports');
    component.toggleHobby('cook');
    expect(component.regForm.value.hobbies).toContain('sports,cook');
  });

  it('hobby will be removed if exists', () =>{
    component.toggleHobby('sports');
    component.toggleHobby('cook');
    component.toggleHobby('sports');
    expect(component.regForm.value.hobbies).toBe('cook');
  });

  it('hobby class will be active for the \'Sports\' button, when hobby was selected \'sports\'', () =>{
    component.toggleHobby('sports');
    expect(component.getHobbyclass('sports')).toBe('active');
  });

  it('hobby class will not be active for the \'Cooking\' button, when hobby was selected \'sports\'', () =>{
    component.toggleHobby('sports');
    expect(component.getHobbyclass('cook')).toBe('');
  });

  it('set gender male', () =>{
    component.setGender('M');
    expect(component.regForm.value.gender).toBe('M');
  });

  it('set gender female', () =>{
    component.setGender('F');
    expect(component.regForm.value.gender).toBe('F');
  });

  it('check gender "Male" button class will be active, if gender is male', () =>{
    component.setGender('M');    
    expect(component.getGenderclass('M')).toBe('active');
  });

  it('check gender "Male" button class will be empty, if gender is female', () =>{
    component.setGender('F');    
    expect(component.getGenderclass('M')).toBe('');
  });

  it('check gender "Female" button class will be empty, if gender is male', () =>{
    component.setGender('M');    
    expect(component.getGenderclass('F')).toBe('');
  });

  it('check gender "Female" button class will be active, if gender is female', () =>{
    component.setGender('F');    
    expect(component.getGenderclass('F')).toBe('active');
  });

  it('form invalid when empty', () => {
    expect(component.regForm.valid).toBeFalsy();
  });

  it('check if all fields are entered, form will be valid', () => {
    let formData = {
      firstname : 'John',
      lastname : 'Doe',
      email : 'john.doe@hcl.in',
      gender : 'M',
      hobbies : 'sports,cook',
      street : ['Willam street', ''],
      city : 'NY',
      country : 'US',
      region : 'NY',
      username: 'johndoe',
      password: 'Test1234',
      confirm_password: 'Test1234',
    };
    component.regForm.setValue(formData);
    expect(component.regForm.valid).toBeTruthy();
  })

  it('check if all fields are entered to save, return will be true', (done) => {
    let formData = {
      firstname : 'John',
      lastname : 'Doe',
      email : 'john.doe1@hcl.in',
      gender : 'M',
      hobbies : 'sports,cook',
      street : ['Willam street', ''],
      city : 'NY',
      country : 'US',
      region : 'NY',
      username: 'johndoe1',
      password: 'Test1234',
      confirm_password: 'Test1234',
    };
    component.regForm.setValue(formData);
    delete formData.confirm_password;
    formData.password = btoa(formData.password);    
    component.doSaveUser(formData).subscribe((res)=> {            
      expect(true).toBeTruthy();
      done();
    }, (err) => {
      expect(false).toBeTruthy();
      done();
    });
  })

  it('check if some fields are empty on save, form will be invalid', () => {    
    let formData = {
      firstname : '',
      lastname : 'Doe',
      email : 'john.doe@hcl.in',
      gender : 'M',
      hobbies : 'sports,cook',
      street : ['', ''],
      city : 'NY',
      country : 'US',
      region : 'NY',
      username: '',
      password: 'Test1234',
      confirm_password: 'Test1234',
    };
    component.regForm.setValue(formData);
    expect(component.regForm.valid).toBeFalsy();
  })

  it('check if username duplicated, error will be thrown', (done) => {
    let formData = {
      firstname : 'John',
      lastname : 'Doe',
      email : 'john.doe2@hcl.in',
      gender : 'M',
      hobbies : 'sports,cook',
      street : ['Willam street', ''],
      city : 'NY',
      country : 'US',
      region : 'NY',
      username: 'johndoe2',
      password: 'Test1234',
      confirm_password: 'Test1234',
    };
    component.regForm.setValue(formData);
    delete formData.confirm_password;
    formData.password = btoa(formData.password);
    component.doSaveUser(formData).subscribe((res)=> { 
      let formData1 = component.regForm.value;
      formData1.email += "1";
      setTimeout(() => {
        component.regForm.setValue(formData1);
        component.doSaveUser(formData1).subscribe((res)=> {
          expect(false).toBeTruthy();
          done();
        }, (err)=> {
          console.log(err);
          expect(true).toBeTruthy();
          done();
        });
      }, 1000);            
    }, (err) => {
      console.log(err);
      expect(false).toBeTruthy();
      done();
    });
  })

  it('check if email duplicated, error will be thrown', (done) => {
    let formData = {
      firstname : 'John',
      lastname : 'Doe',
      email : 'john.doe3@hcl.in',
      gender : 'M',
      hobbies : 'sports,cook',
      street : ['Willam street', ''],
      city : 'NY',
      country : 'US',
      region : 'NY',
      username: 'johndoe3',
      password: 'Test1234',
      confirm_password: 'Test1234',
    };
    component.regForm.setValue(formData);
    delete formData.confirm_password;
    formData.password = btoa(formData.password);
    component.doSaveUser(formData).subscribe((res)=> { 
      let formData1 = component.regForm.value;
      formData1.username += "1";
      setTimeout(() => {
        component.regForm.setValue(formData1);
        component.doSaveUser(formData1).subscribe((res)=> {
          expect(false).toBeTruthy();
          done();
        }, (err)=> {
          console.log(err);
          expect(true).toBeTruthy();
          done();
        });
      }, 1000)     
    }, (err) => {
      console.log(err);
      expect(false).toBeTruthy();
      done();
    });
  })
});