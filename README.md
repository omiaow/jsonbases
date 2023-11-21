<h1 align="center">
  JsonBases
</h1>

<p align="center">
  <a href="https://github.com/omiaow/jsonbases/blob/main/LICENSE" target="blank">
    <img src="https://img.shields.io/github/license/omiaow/smart-journey?style=flat-square" alt="jsonbases" />
  </a>
</p>

#### Jsonbases - NPM package to manage JSON-based database in Node.js. It provides functions to create, read, update, and delete records in a JSON file, following a specified data format.

## Installation
```
npm install jsonbases
```

## Get started
```javascript
import jsonbases from 'jsonbases';

// Define user data format giving types, optionally specify required and unique values.
const format = {
    types: {
        name: 'string',
        age: 'number',
    },
    requireds: ['name', 'age'],
    uniques: ['name'],
};

// Create user table named "users".
const users = jsonbases('users', format);

//Optionally specify the path, by default it's './jsonbases'
const usersTemp = jsonbases('users-temp', format, './path/to/your/database');
```

- **createItem()** Creates a new item with properties initialized to null based on the defined data format.

```javascript
// Create a new item with default values
const newItem = users.createItem(); // returns object ex: { name: null, age: null, _id: 'ad5sad132' }
```

- **createItem(number)** Creates multiple items with properties initialized to null based on the defined data format.

```javascript
// Create a new item with default values
const itemList = users.createItem(100); // returns object
// ex: [{ name: null, age: null, _id: 'ad5sad132' },...]
```

- **add(item)** Adds a new item into the database if it conforms to the specified data format.

```javascript
// Add a new item to the database
newItem.name = 'John';
newItem.age = 25;
const added = users.add(newItem); // returns boolean
```

- **find(item)** Finds and returns an item in the database based on the provided criteria. Input should contain at least one unique value.

```javascript
// Find an item by unique values
const foundItem = users.find({ name: 'John' }); // returns object
```

- **findAll(item)** Finds and returns an array of items in the database based on the provided criteria.

```javascript
// Find all items matching certain criteria
const allItems = users.findAll({ age: 25 }); // returns list
```

- **update(item)** Updates an existing item in the database with the provided data, including original ID.

```javascript
// Update an existing item
newItem.age = 26;
const updated = users.update(newItem); // returns boolean
```

- **remove(item)** Removes an item from the database based on the provided criteria. Input should contain only unique value.

```javascript
// Remove an item by unique values
const removed = users.remove({ name: 'John' }); // returns boolean
```

- **removeAll(item)** Removes all items from the database that match the provided criteria. Input can be any data.

```javascript
// Remove all items matching certain criteria
const removedAll = users.removeAll({ age: 26 }); // returns boolean
```

- **addFromList(list)** Adds all items in a list to the database if it conforms to the specified data format.

```javascript
// Add list of items to the database
const addedFromList = users.addFromList(itemList); // returns boolean
```

- **updateFromList(list)** Updates multiple items in database as provided list, including original ID.

```javascript
// Update multiple items
const updatedFromList = users.updateFromList(itemList); // returns boolean
```

- **removeFromList(list)** Removes multiple items from the database based on the provided list of criteria. Input should contain only unique values.

```javascript
// Remove multiple items
const removedFromList = users.removeFromList([{ name: 'John' }, { name: 'Maria' }]); // returns boolean
```

- **getAll()** Returns an array containing all items in the database.

```javascript
// Get all items in the database
const allData = users.getAll(); // returns list
```

- **reset()** Resets the entire table, removing all items.

```javascript
// Reset the database (remove all items)
users.reset();
```

## Features

- **Saves your time** - no need to learn, install, create connections, sign up for other databases.

- **Easy to use** - simple intuitive functions to manage with your tables.

- **Fast to work** - simplicity of this tool makes your work more faster.

- **List control** - manipulate large amount of data faster.

<hr>
<p align="center">
  Developed with ❤️ in Budapest
</p>
