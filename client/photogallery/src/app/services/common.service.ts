import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

interface Login{
  login: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {
private loginURL="http://localhost:4400/login"

  constructor(private http:HttpClient) { }

  loginService(email:string, password:string){
    let loginBody = {
      //same format as request header
      //equates these properties to data entered by user in the parameters
      email: email,
      password: password
    }
    return this.http.post<Login>(this.loginURL, loginBody)
  }
}
