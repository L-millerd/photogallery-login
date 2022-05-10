import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '../interfaces/photos.interface';
import { PhotoserviceService } from '../services/photoservice.service';

@Component({
  selector: 'app-photo-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.scss']
})
export class PhotoDetailsComponent implements OnInit {

  photo:Photo;


  constructor(private route: ActivatedRoute, private ps:PhotoserviceService) { }

  ngOnInit(): void {
    let id:any = this.route.snapshot.paramMap.get("id");

    this.ps.getPhotosById(id).subscribe( photo => {
      this.photo = photo;
      console.log(photo);
    });
  }
}
