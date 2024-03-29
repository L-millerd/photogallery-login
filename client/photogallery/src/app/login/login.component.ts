import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email:string ='';
  password:string='';
  loginStatus = false;

  constructor(private cs: CommonService, private router: Router) { }

  login(){
    this.cs.loginService(this.email, this.password).subscribe( loginData  => {
      // console.log("hello", loginData.login);
      this.loginStatus = loginData.login;

      ///if loginStatus is true navigate to photos
      if(loginData.login){
        this.router.navigate(['/photos', 2]);
        //add user details to local storage
        localStorage.setItem("photoUserID", JSON.stringify(loginData.data[0].userID));

      }
    })
  }

  ngOnInit(): void {
  }

}
