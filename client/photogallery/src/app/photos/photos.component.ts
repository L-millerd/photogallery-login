import { Component, OnInit } from '@angular/core';
import { Photo } from '../interfaces/photos.interface';
import { PhotoserviceService } from '../services/photoservice.service';


@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {

  photos:Photo[] =[];

  constructor(private ps:PhotoserviceService) { }

  ngOnInit(): void {
    // this.photos = this.jsonData;
    //receive data from the server and then bind it to the local property we created here
    this.ps.getAllPhotos().subscribe( photos => {
      this.photos = photos;
    })
  }

}
