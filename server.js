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
    knex.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
        if(isValid){
            knex.select("*").from("users")
            .where("email", "=", req.body.email)
            .then(user => res.json(user[0]))
            .catch(err => res.status(400).json("cannot get user"))
        }else{
            res.status(400).json("user not found")
        }
    })
    .catch(err => res.status(400).json("wrong credentials"))
})

//signup -- chatgpt help bc mysql doesn't have a returning function so that made it difficult
app.post("/signup", (req, res) => {
    const { email, password, username } = req.body;
    const hash = bcrypt.hashSync(password);
    
    if (email !== "" && password !== "" && username !== "") {
        knex.transaction((trx) => {
            trx("users")
                .insert({
                    email: email,
                    hash: hash
                })
                .into("login")
                .then(() => {
                    return trx("users")
                        .insert({
                            username,
                            email,
                            entries: 0,
                            date: new Date()
                        })
                        .then(() => {
                            return trx("users")
                                .select("*")
                                .where("email", email)
                                .then(user => {
                                    res.json(user[0]);
                                });
                        });
                })
                .then(trx.commit)
                .catch(trx.rollback);
        })
        .catch((err) => res.status(400).json(err));
    }
});



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
    knex.select("*").from("users").where("id", id)
    .then(user => {
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json("Not found")
        }
    })
    .catch(err => res.status(400).json("error getting user"))
})


//image
app.put("/image", (req, res)=>{
    const {id} = req.body;
    knex('users')
    .where({id})
    .increment("entries", 1)
    .then(() => knex("users").select("entries").where({id}))
    .then(entry => res.json(entry[0].entries))
})