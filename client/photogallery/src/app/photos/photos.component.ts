import { Component, OnInit } from '@angular/core';
import { Photo } from '../interfaces/photos.interface';
import {PhotoTB} from '../interfaces/photos.interface';
import { PhotoserviceService } from '../services/photoservice.service';


@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {

  photos:any[] =[];
  myformdata:any;

  albumId:number = 1;
  title:string = '';
  //created when trackfile is triggered and it becomes the filename selected
  filename:string='';

  constructor(private ps:PhotoserviceService) { }

  trackFile(event:any){
    // console.log(event);
    let myFile = event.target.files[0];
    this.filename = myFile.name
    console.log(this.filename);
    //FormData() is predefined, has a method called append
    const formdata = new FormData();
    formdata.append("file_fromC", myFile, myFile.name)
    this.myformdata = formdata;
  }


  addNewPhoto(){
    this.ps.addNewPhoto(this.albumId, this.title, this.filename).subscribe( newphoto => {
      console.log("newphoto", newphoto);
    //once uploaded to database, now upload the file
      this.ps.uploadFile(this.myformdata).subscribe( uploadMessage =>{
         //push adds it to the bottom, unshift pushes it to the top
        this.photos.unshift(newphoto.newphoto[0]);
        // console.log(this.photos);
      });
    })
  }

  deletePhoto(id:number, photocard:HTMLElement){
    if(confirm("Are you sure you want to delete this?")){
      //Delete from DB
      this.ps.deletePhoto(id).subscribe( deleteSuccessMessage =>{
        //Delete from local array
        if(deleteSuccessMessage.delStatus ===1){
          photocard.className = 'fadeout';
          //find the index of the photo with the id you've just clicked on so you can delete it from array
          let index = this.photos.findIndex(photo => photo.id === id);
          setTimeout(() => { this.photos.splice(index, 1); }, 2000);
        }
      })
    }
  }

  ngOnInit(): void {
    //receive data from the server and then bind it to the local property we created here
    this.ps.getAllPhotos().subscribe( photos => {
      this.photos = photos.allphotos;
      console.log("this.photos ngoninit", this.photos);
    })
  }

}
