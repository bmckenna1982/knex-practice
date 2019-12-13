const ShoppingListService = {
  getAllListItems(knex) {
    return knex.select('*').from('shopping_list')
  },
  getById(knex, id) {
    return knex
      .select('*')
      .from('shopping_list')
      .where('id', id)
      .first()
  },
  addListItem(knex, item) {
    return knex
      .insert(item)
      .into('shopping_list')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  }
}

module.exports = ShoppingListService