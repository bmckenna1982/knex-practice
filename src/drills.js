require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

function getAllTextItems(searchTerm) {
  knexInstance
    .select('name', 'price', 'category')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log('getAllTextItems result', result);
    })
}

getAllTextItems('dog')

function paginateItems(pageNumber) {
  const itemsPerPage = 6
  const offset = itemsPerPage * (pageNumber - 1)

  knexInstance
    .select('name', 'price', 'category')
    .from('shopping_list')
    .limit(itemsPerPage)
    .offset(offset)
    .then(result => {
      console.log('paginateItems result', result);
    })
}

paginateItems(1)

function getItemsAddedAfterDate(daysAgo) {
  knexInstance
    .select('name', 'price', 'category', 'date_added')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then(result => {
      console.log('getItemsAddedAfterDate result', result);
    })
}

getItemsAddedAfterDate(5)

function getTotalCostofCategory() {
  knexInstance
    .select('category')
    .from('shopping_list')
    .sum('price as total')
    .groupBy('category')
    .then(result => {
      console.log('Cost per category result', result);
    })
}

getTotalCostofCategory()