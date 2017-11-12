import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from "@angular/core/src/animation/dsl";
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from "@angular/forms";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

@Component({
  selector: 'register-form',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  public regForm: FormGroup;
  success: boolean;
  error: Error;
  constructor(
    private _fb: FormBuilder,
    private http: Http
  ) { }

  ngOnInit() {
    this.success = false;
    this.error = null;
    this.regForm = this._fb.group({
      firstname : ['', [Validators.required]],
      lastname : ['', [Validators.required]],
      email : ['', [Validators.required, Validators.email]],
      gender : '',
      hobbies : '',
      street : this._fb.array([
        new FormControl('', Validators.required),
        new FormControl('')
      ]),
      city : ['', [Validators.required]],
      country : ['', [Validators.required]],
      region : '',
      username: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9]*$")]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]]
    }, {validator: this.checkPasswords});
  }

  checkPasswords(regForm) {
    let pass = regForm.controls.password.value;
    let confirmPass = regForm.controls.confirm_password.value;
  
    return pass === confirmPass ? null : { notSame: true }
  }

  fadeInOut(field) {
    if(this.regForm.value[field] != "") {
      return 'fadeIn';
    }
    return 'fadeOut';
  }

  errorClass(field) {
    let formField = this.regForm.controls[field];
    if(formField.dirty && formField.invalid) {
      return "has-error";
    }
    if(this.regForm.controls['confirm_password'].dirty && this.regForm.hasError('notSame') && (field == "password" || field == "confirm_password")){
      return "has-error";
    }
    return '';
  }

  toggleHobby(hobby) {
    let hobbies = this.regForm.value.hobbies.split(",");
    if(hobbies[0] == "") {
      hobbies = [];
    }
    if(hobbies.indexOf(hobby) === -1) {
      hobbies.push(hobby);
    } else {
      hobbies.splice(hobbies.indexOf(hobby), 1);
    }
    this.regForm.patchValue({hobbies : hobbies.join(",")});
  }

  getHobbyclass(hobby) {
    let hobbies = this.regForm.value.hobbies.split(",");
    if(hobbies.indexOf(hobby) !== -1) {
      return 'active';
    }
    return '';
  }

  setGender(gender) {
    this.regForm.patchValue({gender : gender});
  }

  getGenderclass(gender) {
    return gender && this.regForm.value.gender == gender?"active":"";
  }

  saveUser() {
    this.success = false;
    this.error = null;
    if(!this.regForm || !this.regForm.valid) {
      return;
    }
    delete this.regForm.value.confirm_password;
    this.regForm.value.password = btoa(this.regForm.value.password);
    this.doSaveUser(this.regForm.value).subscribe(res=>{
      this.success = true;
      window.scrollTo(0,0);
      return;
    }, err => {
      this.error = err;
      window.scrollTo(0,0);
      return;
    }); 
  }

  doSaveUser(sendData) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({headers: headers});
    return this.http.post('/api/users', sendData, options);
  }
}
