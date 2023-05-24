const login = require("./controllers/login");
const signup = require("./controllers/signup");
const profile = require("./controllers/profile");
const imageInput = require("./controllers/imageInput")


const express = require("express");
const bcrypt = require("bcrypt-nodejs")
const cors = require("cors")
const knex = require("knex")({
    client: 'mysql',
    connection: {
    host : '127.0.0.1',
    port : 3306,
    user : 'root',
    password : '1073',
    database : 'facerec'
    }
});

const app = express();


app.listen(3000, () => console.log("app is working"))

//adding bodyparser-- so we can parse the request body so js can understand
app.use(express.json())

app.use(cors())

/*ROUTE PLANNING
/ -> route => "Welcome to Facerec"
/signup -> POST user
/login -> POST success/fail ... POST so the password is in the body for security otherwise GET would've sent it as a query string
/profile/:userId -> GET user
/image -> PUT user
*/


//database- before real db
// const database = {
//     users: [
//         {
//             id: "123",
//             username: "Jane",
//             email: "jane@gmail.com",
//             password: "cookies",
//             entries: 0,
//             date: new Date()
//         },
//         {
//             id: "124",
//             username: "Sam",
//             email: "sam@gmail.com",
//             password: "milkshake",
//             entries: 0,
//             date: new Date()
//         }
//     ]
// }


//root
app.get("/", (req, res) => {
    res.json("Welcome to Facerec");
})

//login
app.post("/login", (req, res) => {login.loginController(req, res, knex, bcrypt)})

//signup -- chatgpt help bc mysql doesn't have a returning function so that made it difficult
app.post("/signup", (req, res) => {signup.signupController(req, res, knex, bcrypt)});



// function findUserById(id){
//     let user;
//     database.users.forEach(user => {
//         if (user.id === id){
//             user = user;
//         }
//     })
//     console.log(user)
//     return user;
// }

//profile
app.get("/profile/:id", (req, res)=>{profile.profileController(req, res, knex)})


//image
app.put("/image", (req, res)=>{imageInput.imageController(req, res, knex)})