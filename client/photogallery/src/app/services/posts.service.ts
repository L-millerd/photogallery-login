import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { identifierName } from '@angular/compiler';
import { Post, DeletePost, GetPost, NewPost } from '../interfaces/posts.interface';


@Injectable({
  providedIn: 'root'
})
export class PostsService {
private url = 'http://localhost:4400/posts';
  constructor(private http:HttpClient) { }

  getPosts(){
    return this.http.get<GetPost>(this.url);
  }

  newPost(newpost:string, imgname:string, thumbnail:string){
    let newPostObj ={
      newpost: newpost,
      imgname: imgname,
      thumbnail: thumbnail
    }
    return this.http.post<NewPost>(this.url, newPostObj)
  }

  uploadFile(filedata:any){
    return this.http.post('http://localhost:4400/upload', filedata);
  }

  // editPost(editPost:string){
  //   let editBody ={
  //     "post": editPost
  //   }
  // }

  deletePost(id:number){
    return this.http.delete<DeletePost>(this.url + "/" + id)
  }
}
