require('dotenv').config()
const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe('Shopping list service object', () => {
  let db
  let testShoppingList = [
    {
      id: 1,
      name: 'test item 1',
      price: '1.00',
      date_added: new Date('2019-12-22T16:28:32.615Z'),
      checked: false,
      category: 'Main'
    },
    {
      id: 2,
      name: 'test item 2',
      price: '2.00',
      date_added: new Date('2019-11-22T16:28:32.615Z'),
      checked: false,
      category: 'Snack'
    },
    {
      id: 3,
      name: 'test item 3',
      price: '3.00',
      date_added: new Date('2019-10-22T16:28:32.615Z'),
      checked: true,
      category: 'Lunch'
    },
  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
  })

  before(() => db('shopping_list').truncate())

  after(() => db.destroy())

  afterEach(() => db('shopping_list').truncate())

  context(`Given 'shopping_list' table has data`, () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testShoppingList)
    })

    it(`getAllListItems() should resolve all articles from 'shopping_list' table`, () => {
      return ShoppingListService.getAllListItems(db)
        .then(actual => {
          expect(actual).to.eql(testShoppingList)
        })
    })

    it(`getById() resolves an article from 'shopping_list' table with the matching id`, () => {
      const thirdId = 3
      const thirdListItem = testShoppingList[thirdId - 1]

      return ShoppingListService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            name: thirdListItem.name,
            price: thirdListItem.price,
            date_added: new Date(thirdListItem.date_added),
            checked: thirdListItem.checked,
            category: thirdListItem.category
          })
        })
    })
  })

  context(`Given 'shopping_list' table has no data`, () => {

    it(`getAllListItems() should resolve to an empty array`, () => {
      return ShoppingListService.getAllListItems(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })

    it(`addListItem() inserts new list item and resolves the new item with an id`, () => {
      const newItem = {
        name: 'test new Item',
        price: '4.00',
        date_added: new Date('2019-12-25T16:28:32.615Z'),
        checked: false,
        category: 'Breakfast'
      }
      return ShoppingListService.addListItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            name: newItem.name,
            price: newItem.price,
            date_added: new Date(newItem.date_added),
            checked: newItem.checked,
            category: newItem.category
          })
        })
    })
  })
})