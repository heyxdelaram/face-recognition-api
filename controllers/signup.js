const signupController = (req, res, knex, bcrypt) => {
    const { email, password, username } = req.body;
    const hash = bcrypt.hashSync(password);
    if(!email || !password || !username){
        return res.status(400).json("incorrect form submission")
    }
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
}

module.exports = {signupController}