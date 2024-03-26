/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*
*  * Name: Roma Malla Thakuri
     Student ID: 133791236
*  * Date: 2024-03-25  
*
********************************************************************************/ 


const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const exphbs = require('express-handlebars');
const path = require("path");
const collegeData = require("./modules/collegeData");

const app = express();
app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  helpers: {
    navLink: function(url, options){
      return "<li " +
      ((url == app.locals.activeRoute) ? 'class="nav-item active"' : 'class="nav-item"') +
      '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function(lvalue, rvalue, options){
      debugger;
      if(arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if(lvalue != rvalue){
        console.log(options.inverse(this))
        return options.inverse(this);
      }
      else{
        console.log(options.fn(this))
        return options.fn(this);
      }
    }
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Initialize collegeData
collegeData.initialize()
  .then(() => {
    // Routes
    app.use(function(req, res, next){
      let route = req.path.substring(1);
      app.locals.activeRoute = '/' + (isNaN(route.split('/')[1])? route.replace(/\/(?!.*)/,""):route.replace(/\/(.*)/,""));
      next();
    })


    app.get("/students", (req, res) => {
     collegeData.getAllStudents()
     .then(data => res.render("students", {students: data}))
     .catch(() => res.render("students",{message: "No Results"}))
      
    });

   
    app.post("/student/update", (req, res) => {
      debugger;
      console.log(req.body);
      collegeData.updateStudent(req.body)
      .then(() => res.redirect("/students"))
      .catch(() => res.send(JSON.stringify({message:"Error while updating"})))
      
    });

    app.get("/courses", (req, res) => {
      collegeData.getCourses()
        .then(courses => res.render("courses", {courses: courses}))
        .catch(() => res.render("courses",{message: "No Results"}));
    });

    app.get("/student/:num", (req, res) => {
      const num = req.params.num;
      collegeData.getStudentByNum(num)
        .then(student => res.render("student", {student:student}))
        .catch(() => res.render("student",{ message: "Query returned 0 results" }));
    });

    app.get("/course/:num", (req, res) => {
      const num = req.params.num;
      collegeData.getCourseById(num)
        .then(course => res.render("course", {course:course}))
        .catch(() => res.render("course",{ message: "no results" }));
    });
    // app.get("/", (req, res) => {
    //   res.sendFile(path.join(__dirname, "/views/home.html"));
    // });
    app.get("/", (req, res) => {
      res.render("home"); 
    });

    app.get("/about", (req, res) => {
      res.render("about");
    });

    app.get("/htmlDemo", (req, res) => {
      res.render("htmlDemo");
    });

    app.get("/students/add", (req, res) => {
        res.render("addStudent");
    });
    
    app.post("/students/add", (req,res) => {
        collegeData.addStudent(req.body).then(success=>{
            res.redirect("/students")
        }).catch(error=>{
                res.send(JSON.stringify({message:"No Results"}))
        })
      });
    

    app.use((req, res) => {
      res.status(404).send("Page Not Found");
    });

    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port: " + HTTP_PORT);
    });
  })
  .catch(err => {
    console.error("Error initializing collegeData:", err);
  });

