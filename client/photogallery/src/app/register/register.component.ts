import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../services/register.service';
import { Router } from '@angular/router'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email:string ='';
  password: string ='';
  first_name: string ='';
  last_name: string ='';
  registrationStatus = false;

  constructor(private rs: RegisterService, private router: Router) { }

  register(){

    // console.log(this.email);

    this.rs.registerService(this.email, this.password, this.first_name, this.last_name).subscribe( registerData =>{
      //this status is = to the one provided by the server
      console.log(registerData, registerData.message);
      this.registrationStatus = registerData.registration;

      console.log(registerData.registration); ///not returning register status
      console.log(this.registrationStatus); //has not changed from false

      if(registerData.registration){

        // this.router.navigate(['/photos']);
      }
    })
  }
  ngOnInit(): void {
  }

}
