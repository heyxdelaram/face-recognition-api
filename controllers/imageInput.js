const imageController = (req, res, knex) => {
    const {id} = req.body;
    knex('users')
    .where({id})
    .increment("entries", 1)
    .then(() => knex("users").select("entries").where({id}))
    .then(entry => res.json(entry[0].entries))
}

module.exports= {imageController}