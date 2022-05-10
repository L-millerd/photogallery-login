import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Photo } from '../interfaces/photos.interface'

@Injectable({
  providedIn: 'root'
})
export class PhotoserviceService {

  private url = "http://localhost:4400/photosapi"


  constructor(private http:HttpClient) { }

  getAllPhotos(){
    return this.http.get<Photo[]>(this.url);

  }

  getPhotosById(id:number){
    return this.http.get<Photo>(this.url + '/' + id);
  }
}
