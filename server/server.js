import express from 'express';
import { readyException } from 'jquery';
import cors from 'cors';
// import mysql from 'mysql';
import mysql from 'mysql2';
import multer from 'multer';
//file system for deleting files (no install required)
import fs from 'fs';
import 'dotenv/config';

const db = mysql.createConnection({
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBDATABASE
});

//Virtual Machine
// const db = mysql.createConnection({
//   host: '165.232.136.63',
//   port: 3306,
//   user: 'myadmin',
//   password: 'RainbowKat7149!',
//   database: 'photogallery'
// });

//Locally Hosted 
// const db = mysql.createConnection({
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: '',

//   database: 'photogallery'
// });

const server = express();
server.use(cors(corsOption));
server.use(express.json())
server.use(express.static('uploads'))

var corsOption={
  origin: ["http://localhost:4200"],
  optionSuccessStatus: 200
}

db.connect(error =>{
  if(error)
    console.log("sorry, cannot connect to db", error);
  else
    console.log ("connected to mysql db");
});

server.listen(4400, function(){
  console.log('server is successfully running on port 4400')
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


////////////////////////////////////Uploading////////////////////

//ADD THIS BACK WHEN NOT TESTING
server.get('/photos', (req, res)=>{
  let query = "CALL `getPhotos`()";
  db.query(query, (error, allphotos) =>{
    if(error){
      res.json({ allphotos: false, message: error})
    }
    else{
      res.json({allphotos: allphotos[0], message: "returned photos"});
    }
  })
})

// server.get('/photos', (req, res)=>{
//   let query = "SELECT * FROM photos";
//   db.query(query, (error, allphotos) =>{
//     if(error){
//       res.json({ allphotos: false, message: error})
//     }
//     else{
//       res.json({allphotos: allphotos[0], message: "returned photos"});
//     }
//   })
// })

server.post('/photos', (req,res) => {
  let query = "CALL `addPhoto`(?, ?, ?, ?)";
  db.query(query, [req.body.albumId_fromC, req.body.title_fromC, req.body.url_fromC, req.body.tn_fromC], (error, newphoto)=>{
    if(error){
      res.json({newphoto: false, message: error});
    }
    else{
      res.json({newphoto: newphoto[0], message: "Photo added to the database"})
    }
  })
})

////Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})

//create instance of multer in a variable
const fileupload = multer({ storage: storage})

///Use in an API
server.post('/upload', fileupload.single("file_fromC"), (req, res)=>{
  res.json({fileupload: true});
});


// ///Gets photos by ID
server.get('/photos/:photoid', (req, res) =>{
  let query = "CALL `getPhotoByID`(?)";
  db.query( query, [req.params.photoid], (error, photo) =>{
    if(error){
      res.json({photo: false, message: error});
    }
    else{
      res.json({ photo: photo[0][0], message: "returned photo by ID"});
    }
  })
})

server.delete('/photos/:id', (req, res) =>{
  let query = "CALL `deletePhoto`(?)";
  let getFilename = "CALL `getPhotoByID`(?)";

  db.query(getFilename, [req.params.id], (error, data)=>{
   // res.json(data[0][0].url);
   if(error){
     res.json(error);
   }
   else{
    let file_to_be_deleted = data[0][0].url;
    fs.unlink('./uploads/' + file_to_be_deleted, (error)=>{
      if (error){
        res.json({deleteStatus: false, message:error});
      }
      else{
        //if deleted from uploads, now delete from DB
        db.query( query, [req.params.id], (error, deleteStatus) =>{
          if(error){
            res.json({ delStatus: false, message: error });
          }
          else{
            let del_success = deleteStatus[0][0].DEL_SUCCESS;
            if(del_success === 1){
              res.json({delStatus: del_success, message: "Successfully Deleted"});
            }
            else{
              res.json({delStatus: del_success, message: "ID not found"});
            }
          }
        })      
      }
    })
   }
  })
})

//Deletes from DB ONLY

// server.delete('/photos/:id', (req, res) =>{
//   let query = "CALL `deletePhoto`(?)";
//   db.query( query, [req.params.id], (error, deleteStatus) =>{
//     if(error){
//       res.json({ delStatus: false, message: error });
//     }
//     else{
//       let del_success = deleteStatus[0][0].DEL_SUCCESS;
//       if(del_success === 1){
//         res.json({delStatus: del_success, message: "Successfully Deleted"});
//       }
//       else{
//         res.json({delStatus: del_success, message: "ID not found"});
//       }
//     }
//   })
// })