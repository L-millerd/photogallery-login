import express from 'express';
import { readyException } from 'jquery';
import cors from 'cors';
import mysql from 'mysql';
import multer from 'multer';

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'Employees'
});

db.connect(error =>{
  if(error)
    console.log("sorry, cannot connect to db", error);
  else
    console.log ("connected to mysql db");
});


const server = express();

server.use(cors(corsOption));

var corsOption={
  origin: ["http://localhost:4200"],
  optionSuccessStatus: 200
}

server.use(express.json())


/////IMAGE UPLOADS
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const fileupload = multer({ storage: storage });


//File upload API
server.post('/upload', fileupload.single("file") , (req, res) => {
  console.log(req.file);
})

/////END IMAGE UPLOADS





server.get('/employeesapi', (req, res) => {
  let allEmpSP = "SELECT * FROM Employee";
  let query = db.query(allEmpSP, (error, data) => {
    if (error){
      res.json({ErrorMessage:error});
      // console.log(error);
    }
    else {
      res.json(data);
       // console.log(data);
    }1
  })
})

server.get('/employeesapi/:id', (req, res) => {
  let emp_id = req.params.id;
  //put a question mark for each parameter
  let empSP = "CALL `One_emp_data`(?)";
  db.query(empSP, [emp_id], (error, data, fields) => {
    if (error){
      res.json({ ErrorMessage: error });
    }
    else{
      res.json(data[0]);
    }
  })
})

server.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let loginQuery = 'CALL `login`(?, ?)';
  db.query(loginQuery, [email, password], (error, data, fields) => {
    if(error){
      res.json({ ErrorMessage: error});
    }
    else{
      if(data[0].length === 0){
        res.json({ data: data[0], login: false, message: "Sorry, you have provided wrong credentials"})
      }
      else{
        res.json({ 
            UserID: data[0].UserID, 
            email: data[0].email,
            data: data[0],
            login: true, 
            message: "Login successful"});
            //create auth key 
      }   
    }
  })
})

//SIGNUP stored proceedure not created yet - incorrect format, would need first_name and last_name too
server.post('/signup', (req, res)=>{
  let email = req.body.email;
  let password = req.body.password;
  let query = "CALL `signup`(?,?)";
  db.query(query, [email, password], (error, data)=> {
    if(error){
      res.json({newuser: false, message: error})
    }
    else{
      res.json({newuser: true, message: "New user added to the db"});
    }
  })
})

//working register
server.post('/register', (req,res) => {
  let email = req.body.email;
  let password = req.body.password;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;

  let registerQuery = 'CALL `register`(?, ?, ?, ?)';
  db.query(registerQuery, [email, password, first_name, last_name], (error, data, fields) => {
    if(error){
      res.json({ ErrorMessage: error});
    }
    else{
      res.json({
        registration: true,
        message: "Registration Successful"
      })
    }
  })

})

server.put('/updateUser', (req,res) =>{
  let userID = req.body.userID;
  let email = req.body.email;
  let password = req.body.password;
  let query = "CALL `updateUser`(?, ?, ?)";
  db.query(query, [userID, email, password], (error, data, fields)=>{
    if(error){
      res.json({update: false, message: error});
    }
    else{
      res.json({update: true, message: "User info successfully updated"})
    }
  })
})

server.get('/user/:id', (req, res) =>{
  let userID = req.params.id;
  let query = "CALL `getUser`(?)";
  db.query(query, [userID], (error, data, fields) =>{
    if(error){
      res.json({user: false, message:error})
    }
    else{
      if(data[0].length === 0){
        res.json({user: false, message: "No user with that id exists"})
      }
      else{
        res.json({user:true, message: "User found", userData: data[0]});
      }
    }
  })
})

server.delete('/deleteuser/:id', (req, res) => {
  let userID = req.params.id; //params because it comes from the URL
  let query = "CALL `deleteUser` (?)";
  db.query(query, [userID], (error, data) => {
    if(error){
      res.json({deleteUser: false, message: error})
    }
    else{
      res.json({ deleteUser: true, message: "User deleted successfully"});
    }
  })
})

//req is is data from client to server
//res is data from server to the client 
server.get('/photosapi', (req, res) => {
    res.json(jsonData);
})

server.get('/photosapi/:photoid', (req, res) => {
    let id_from_client = req.params.photoid;
    //x becomes object of jsonData and then you find x.id and make that = to your property
    res.json(jsonData.find( x => x.id == id_from_client))
})

server.listen(4400, function(){
    console.log('server is successfully running on port 4400')
})

///////////////////////////////// Server Box /////////////////////////////////////////

server.get('/posts', (req, res) => {
  let query = "CALL `GetPost`()";
  db.query(query, (error, data) =>{
    if(error){
      res.json({data: false, message: error});
    }
    else{
      res.json({data: data[0], message: "Success"});
    }
  })
});
 
server.post('/posts', (req, res)=>{
  let query = "CALL `NewPost`(?, ?)";
  db.query(query, [req.body.newpost, req.body.thumbnail], (error, newpostfromSQL) => {
    if(error){
      res.json({newpost: false, message: error})
    }
    else{
      res.json({newpost: newpostfromSQL, message: "new post inserted"});
    }
  })
})

//this SP sends DEL_SUCESS as 0 or 1, we store it in 'delete success'
//delete does not take any req.body, HAS to be req.params
server.delete('/posts/:id', (req,res) =>{
  let query = "CALL `DeletePost`(?)";
  db.query(query, [req.params.id], (error, deleteSuccess) => {
    ///if SP doesn't work 
    if(error){
      res.json({deleteSuccess: false, message: error});
    }
    //If it does work, but id is not found vs found
    else{
      if(deleteSuccess[0][0].DEL_SUCCESS == 0){
        res.json({ deleteSuccess: deleteSuccess[0][0].DEL_SUCCESS, message: "ID not Found"})
      }
      else{
        res.json({ deleteSuccess: deleteSuccess[0][0].DEL_SUCCESS, message: "deleted successfully"});
      }
    }
  })
})



//file upload API
server.post('/upload', fileupload.single("file"), (req, res) =>{
  console.log(req.file.filename);
})


// server.put('/posts', (req, res)=>{
//   let query = "CALL `UpdatePost`(?, ?)";
//   let postID = req.query.id;
//   let updatePost = req.body.updatePost;
//   db.query(query, [postID, updatePost], (error, data)=>{
//     if(error){
//       res.json({editPost: false, message: error});
//     }
//     else{
//       res.json({editPost: true, message: "Post successfully edited"});
//     }
//   })
// })


