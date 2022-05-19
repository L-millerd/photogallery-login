import { Component, OnInit } from '@angular/core';
import { css } from 'jquery';
import { PostsService } from '../services/posts.service';
import { Post } from '../interfaces/posts.interface'

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  posts:Post[] = [];
  newpost:string = '';

  imageFormData:any;
  imgname:string = '';
  thumbnail: string = '';

  constructor(private ps:PostsService) { }


  uploadImage(){
    this.ps.uploadFile(this.imageFormData).subscribe(response =>{
      console.log(response)
    })
  }

  onChange(event:any){
    let file:File = event.target.files[0];
    this.imgname = file.name
    console.log(file);
    const formData = new FormData();

    formData.append('file', file);
    // console.log(formData);
    this.imageFormData = formData;
  }


  getPosts(){
    this.ps.getPosts().subscribe(posts=>{
      this.posts = posts.data;
      console.log(posts.data);
    })
  }


  //this one returns the data as well
  addNewPost(){
    //post new post to the database
    this.ps.newPost(this.newpost, this.imgname, this.thumbnail).subscribe( insertedPost => {
      console.log(insertedPost.newpost[0][0]);
      let newPost = insertedPost.newpost[0][0];
      //once the image is uploaded, then push the information to the array
      this.ps.uploadFile(this.imageFormData).subscribe(response =>{
        // this.posts.push(insertedPost.newpost[0][0]);
        this.posts.push(this.newpost);
      })
    })
  }

//find the index of the element based on it's id
//because these are objects within an array, so you need to
//target the index
  deletePost(id:number){
    this.ps.deletePost(id).subscribe (deleteSuccess => {
      if(deleteSuccess.deleteSuccess === 1){
        //finds the index number for that id value
        let index = this.posts.findIndex(postid => postid.id === id);
        //deletes that one index
        this.posts.splice(index, 1);
      }
    })
  }






  ngOnInit(): void {
    this.getPosts();
  }

}
