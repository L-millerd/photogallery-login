import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  email: string = '';
  password1: string = '';
  password2: string='';
  signupstatus:boolean = false;
  signupmessage:any = '';

  constructor(private cs:CommonService) { }

  ngOnInit(): void {
  }

  signup(email:any){
    // this.cs.signupService(this.email, this.password).subscribe(signupdata =>{
    //   this.signupstatus = signupdata.newuser;
    //   this.signupmessage = signupdata.message;
    // })
  }

}
