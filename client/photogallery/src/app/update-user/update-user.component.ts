import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  email:string =''; //two way bound from client
  password:string =''; //two way bound from client
  updateStatus = false; //gets data from server bc = updateConfirmation.update
  showMessage ="none";

  constructor(private cs:CommonService, private router:Router) { }

  deleteUser(){
    if(confirm("Are you sure?")){
      let userID = localStorage.getItem("photoUserID");
      this.cs.deleteUser(userID).subscribe(response =>{
        console.log(response); //to find out what data looks like
        if(response.deleteUser){
          localStorage.setItem("photoUserID", "0");
          this.router.navigate(['/signup']);
        }
      })
    }
  }

  updateUser(){
    let id= localStorage.getItem("photoUserID");
    console.log(this.updateStatus);

    this.cs.updateUser(id, this.email, this.password).subscribe( updateConfirmation => {
      console.log(updateConfirmation.update);
      this.showMessage = "block";
      this.updateStatus = updateConfirmation.update;
    })
  }

  ngOnInit(): void {
    //load user data into the inputs when page loads
    let userID = localStorage.getItem("photoUserID");
    this.cs.getUser(userID).subscribe( userDetails => {
      // console.log(userDetails);
      this.email=userDetails.userData[0].email;
      this.password=userDetails.userData[0].password;
    })
  }


}
