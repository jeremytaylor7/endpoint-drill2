
const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { ShoppingList, Recipes } = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

// we're going to add some items to ShoppingList
// so there's some data to look at
ShoppingList.create('beans', 2);
ShoppingList.create('tomatoes', 3);
ShoppingList.create('peppers', 4);

// adding some recipes to `Recipes` so there's something
// to retrieve.
Recipes.create(
  'boiled white rice', ['1 cup white rice', '2 cups water', 'pinch of salt']);
Recipes.create(
  'milkshake', ['2 tbsp cocoa', '2 cups vanilla ice cream', '1 cup milk']);

// when the root of this router is called with GET, return
// all current ShoppingList items
app.get('/shopping-list', (req, res) => {
  res.json(ShoppingList.get());
});

createShoppingList = (input) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'budget'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in input)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return {
        status: 400, message: message) 
      }
      //res.status(400).send(message);
    }
    // create shopping list item
    return { status: 201 };
  }
}
expect(createShoppingList({ name: 'bla', budget: 1000 })).toEqual({ status: 201 })

app.post('/shopping-list', jsonParser, createShoppingList);

app.post('/recipes', jsonParser, (req, res) => {

  const required = ['recipe', 'ingredients'];
  for (let i = 0; i < required.length; i++) {
    const field = required[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);

    }
  }
  const item = Recipes.create(req.body.recipe, req.body.ingredients)
  res.status(201).json(item);
});


app.get('/recipes', (req, res) => {
  res.json(Recipes.get());
})

routes = app._router.stack.map(function (item) {
  if (item.route !== undefined) {
    console.log(item.route.path, item.route.methods);
  }

})
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});

