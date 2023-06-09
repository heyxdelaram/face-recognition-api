const loginController = (req, res, knex, bcrypt) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json("incorrect form submission")
    }
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
}

module.exports = {loginController}