import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface Login{
  login: boolean;
  message: string;
  data: [{
    userID:number;
    email:string;
    password:string;
  }];
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private server = environment.server;
private loginURL=this.server + "login";
private signupURL=this.server + "signup";
private userURL=this.server + "user";
private updateURL=this.server + "updateUser";
private deleteURL=this.server + "deleteUser"

// private loginURL="http://localhost:4400/login";
// private signupURL="http://localhost:4400/signup";
// private userURL="http://localhost:4400/user";
// private updateURL="http://localhost:4400/updateUser";
// private deleteURL="http://localhost:4400/deleteUser"

  constructor(private http:HttpClient) { }

  deleteUser(id:any){
    return this.http.delete<{deleteUser:boolean, message:string}>(this.deleteURL + "/" + id)
    //doesn't need a body because the parameter is being passed through the URL
  }

  loginService(email:string, password:string){
    let loginBody = {
      //same format as request header
      //equates these properties to data entered by user in the parameters
      email: email,
      password: password
    }
    return this.http.post<Login>(this.loginURL, loginBody)
  }

  signupService(email:string, password:string){
    //returns the observable
    let signupBody = {
      "email": email,
      "password": password
  }

    return this.http.post<{ newuser:boolean, message: any }>(this.signupURL, signupBody)
  }

  getUser(id:any){
    return this.http.get<{user:Boolean, message:string, userData: [{UserID:number, email:string, password:string}] }>(this.userURL + "/" + id);
  }

  updateUser(id:any, email:string, password:string){
    let updateBody={
      "userID": id,
      "email": email,
      "password": password
    }
    return this.http.put<{update:boolean, message:any}>(this.updateURL, updateBody);
  }
}


