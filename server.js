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
/*
/ -> route => "Welcome to Facerec"
/signup -> POST user
/login -> POST success/fail ... POST so the password is in the body for security otherwise GET would've sent it as a query string
/profile/:userId -> GET user
/image -> PUT user
*/
//database
const database = {
    users: [
        {
            id: "123",
            username: "Jane",
            email: "jane@gmail.com",
            password: "cookies",
            entries: 0,
            date: new Date()
        },
        {
            id: "124",
            username: "Sam",
            email: "sam@gmail.com",
            password: "milkshake",
            entries: 0,
            date: new Date()
        }
    ]
}
//root
app.get("/", (req, res) => {
    res.json(database.users);
})

//login
app.post("/login", (req, res) => {
    if(req.body.email === database.users[0].email 
        && req.body.password === database.users[0].password){
            res.json(database.users[0])
    }else{
        res.json("email or password incorrect")
    }
})

//signup
app.post("/signup", (req, res) => {
    const { email, password, username } = req.body;
    if(email !== "" && password !== "" && username !== ""){
        knex("users")
        // .returning("*")
        .insert({
            username: username,
            email: email,
            date: new Date()
        }).then(user => {
            res.json(knex(user))
            // res.json(knex('users').where('id', user[0]))
        })
        .catch(err => res.status(400).json(err))
    }
})

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
app.get("/profile/:id", (req, res)=>{
    const {id} = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id){
            found = true;
            return res.json(user)
        }
    })
    if (!found){
        res.status(404).json("profile not found")
    }
    // const user = findUserById(id)
    // if(user){
    //     res.json(user)
    // }else{
    //     res.status(404).json("profile not found")
    // }
})


//image
app.put("/image", (req, res)=>{
    const {id} = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id){
            found = true;
            user.entries++;
            return res.json(user.entries)
        }
    })
    if (!found){
        res.status(404).json("profile not found")
    }
})