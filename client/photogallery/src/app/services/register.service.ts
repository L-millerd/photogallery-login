import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

interface Register{
  registration: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
registerURL = "http://localhost:4400/register";

  constructor(private http:HttpClient) { }

  registerService(email:string, password:string, first_name:string, last_name:string){
    let registerBody = {
      email: email,
      password: password,
      first_name: first_name,
      last_name: last_name,
    }

    return this.http.post<Register>(this.registerURL, registerBody)
  }
}
