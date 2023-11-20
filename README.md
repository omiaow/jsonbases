<h1 align="center">
  JsonBases
</h1>

<p align="center">
  <a href="https://github.com/omiaow/jsonbases/blob/main/LICENSE" target="blank">
    <img src="https://img.shields.io/github/license/omiaow/smart-journey?style=flat-square" alt="jsonbases" />
  </a>
</p>

#### Jsonbases - simple package to manage JSON-based database in Node.js. It provides functions to create, read, update, and delete records in a JSON file, following a specified data format.

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
const users1 = jsonbases('users-1', format);

//Optionally specify the path, by default it's './jsonbases'
const users2 = jsonbases('users-2', format, './path/to/your/database');
```

- **createItem()** Creates a new item with properties initialized to null based on the defined data format.

```javascript
// Create a new item with default values
const newItem = db.createItem(); // returns object ex: { name: null, age: null, _id: 'ad5sad132' }
```

- **add(item)** Adds a new item to the database if it conforms to the specified data format.

```javascript
// Add a new item to the database
newItem.name = 'John';
newItem.age = 25;
const added = db.add(newItem); // returns boolean
```

- **find(item)** Finds and returns an item in the database based on the provided criteria. Input should contain at least one unique value.

```javascript
// Find an item by unique values
const foundItem = db.find({ name: 'John' }); // returns object
```

- **findAll(item)** Finds and returns an array of items in the database based on the provided criteria.

```javascript
// Find all items matching certain criteria
const allItems = db.findAll({ age: 25 }); // returns list
```

- **update(item)** Updates an existing item in the database with the provided data and original ID.

```javascript
// Update an existing item
newItem.age = 26;
const updated = db.update(newItem); // returns boolean
```

- **remove(item)** Removes an item from the database based on the provided criteria. Input should contain at least one unique value.

```javascript
// Remove an item by unique values
const removed = db.remove({ name: 'John' }); // returns boolean
```

- **removeAll(item)** Removes all items from the database that match the provided criteria.

```javascript
// Remove all items matching certain criteria
const removedAll = db.removeAll({ age: 26 }); // returns boolean
```

- **getAll()** Returns an array containing all items in the database.

```javascript
// Get all items in the database
const allData = db.getAll(); // returns list
```

- **reset()** Resets the entire table, removing all items.

```javascript
// Reset the database (remove all items)
db.reset();
```

## Features

- **Saves your time** - no need to learn, install, create connections, sign up for other databases.

- **Easy to use** - simple intuitive functions to manage with your tables.

- **Fast to work** - simplicity of this tool makes your work more faster.

<hr>
<p align="center">
  Developed with ❤️ in Budapest
</p>
