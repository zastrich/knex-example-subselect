const express = require('express')
const PORT = process.env.PORT || 3001
const knex = require('./knex/knex.js')
const app = express()

app.get('/store/:id', async (req, res) => {
  const { id } = req.params

  const QUERY = await knex('store') // points table
    .select('store.store_code') // get code from main table
    .select('store.store_name') // get name from main table
    .select(knex.raw('count(store_skus.store_code) as store_skus_count')) // get count of crossing left table
    .select( // starts sub-select
      knex('store_experiences') // points sub-select table
        .select(knex.raw('GROUP_CONCAT(store_experiences.exp_id)')) // get an concat data from sub-select table
        .where('store_experiences.store_code', knex.raw('??', 'store.store_code')) // treat return of specific data
        .groupBy('store_experiences.store_code') // group data
        .as('store_experiences') // Apply alias - IMPORTANT - Ever use alias to showing sub-select query
    )
    .leftJoin('store_skus', 'store_skus.store_code', 'store.store_code') // Crossing with other table to count data
    .groupBy('store.store_code') // Group data to corrects count - OPTIONAL when use COUNT on selects data
    .where('store.store_code', '=', id) // Filter results by specific store code

  res.json(QUERY.map(el => (
    { 
      ...el, 
      ...{ store_experiences: (el.store_experiences ? el.store_experiences.split(',') : []) } // Treat return of string array to JSON array
    }
  )))
})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})