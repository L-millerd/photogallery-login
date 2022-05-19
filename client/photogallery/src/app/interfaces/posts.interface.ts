export interface Post{
  id: number;
  post: string;
  thumbnail:string;
}

export interface GetPost{
  data: Post[];
  message:any;
  thumbnail:string;
}

export interface NewPost{
  newpost: [[{ id: number, post: string}]]; //might need another set of brackets
  message: any;
  thumbnail:string;
}

export interface DeletePost{
  deleteSuccess:any;
  message:any;
}
