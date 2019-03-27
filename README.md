# mongo-express-example

This is a very basic example of a MongoDB/Express.js API structure. The application acts as a simple user-oriented todo list with two collections, `users` and `todos`.

**Disclaimer**: Some Mongo queries are a bit naive in their approaches within this example (using loops and looking up an array of ObjectIds individually) for the sake of simplicity and learning by example. For more advanced mongo queries, look into the utilizing the [Aggregation Pipeline](https://docs.mongodb.com/manual/core/aggregation-pipeline/).

## Collections

### `users`

```js
{
  _id: ObjectId,
  name: String,
  role: String
}
```

### `todos`

```js
{
  _id: ObjectId,
  creator: ObjectId,
  title: String,
  task: String
}
```

## API

### GET `/users`

This returns all the users in the collection, as well as an added key `todos` containing an array of `{_id, title}` of each todo they are the creator of.

**Response**:

```json
[
  {
    "_id": "5c9bde40c3de5a9b8c23e692",
    "name": "Steve Jobs",
    "role": "CEO",
    "todos": [
      {
        "_id": "5c9bf361120f08a6bcf41b25",
        "title": "Yell at Bill Gates"
      }
    ]
  },
  {
    "_id": "5c9bdec3027b909cfb9ddf6e",
    "name": "Steve Wozniak",
    "role": "Developer",
    "todos": [
      {
        "_id": "5c9bf709f2ee23a7f29ca771",
        "title": "Straighten Capacitors on Apple II"
      },
      {
        "_id": "5c9bf71bf2ee23a7f29ca772",
        "title": "Buy some more floppy disks"
      }
    ]
  }
]
```

### GET `/users/:id`

This returns a single users in the collection, as well as an added key `todos` containing an array of `{_id, title}` of each todo they are the creator of.

**Request Parameters**:

```json
{
  "id": "5c9bdec3027b909cfb9ddf6e"
}
```

**Response**:

```json
{
  "_id": "5c9bdec3027b909cfb9ddf6e",
  "name": "Steve Wozniak",
  "role": "Developer",
  "todos": [
    {
      "_id": "5c9bf709f2ee23a7f29ca771",
      "title": "Straighten Capacitors on Apple II"
    },
    {
      "_id": "5c9bf71bf2ee23a7f29ca772",
      "title": "Buy some more floppy disks"
    }
  ]
}
```

### POST `/users/`

This route creates a new user, which will have the keys `name` and `role` specified by the data in the request body. Returns the newly created users document.

**Request Body**:

```json
{
  "name": "Rob Herley",
  "role": "Developer"
}
```

**Response**:

```json
{
  "_id": "5c9bfdd9edf526ab046dae92",
  "name": "Rob Herley",
  "role": "Developer"
}
```

### PUT `/users/:id`

This route updates a user, specified by the keys in the request body: `newName` and `newRole`. At least one key is required. Returns the updated users document.

**Request Parameters**:

```json
{
  "id": "5c9bfdd9edf526ab046dae92"
}
```

**Request Body**:

```json
{
  "newRole": "Intern"
}
```

**Response**:

```json
{
  "_id": "5c9bfdd9edf526ab046dae92",
  "name": "Rob Herley",
  "role": "Intern"
}
```

### DELETE `/users/:id`

This route deletes a user, as well as all of the todos in which the user's id matches the creator field. Returns the deleted user with key `todos` containing an array of `{_id, title}` of each todo they were the creator of.

**Request Parameters**:

```json
{
  "id": "5c9bfdd9edf526ab046dae92"
}
```

**Response**:

```json
{
  "deleted": true,
  "data": {
    "_id": "5c9bfdd9edf526ab046dae92",
    "name": "Rob Herley",
    "role": "Intern",
    "todos": [
      {
        "_id": "5c9bfde0edf526ab046dae93",
        "title": "Dust the Macs"
      },
      {
        "_id": "5c9bfde1edf526ab046dae94",
        "title": "Buy everyone coffee"
      }
    ]
  }
}
```

### GET `todos/`

This returns all the todos in the collection, as well as a modified key `creator` containing an object `{_id, name}` for their creator.

**Response**:

```json
[
  {
    "_id": "5c9bf361120f08a6bcf41b25",
    "title": "Yell at Bill Gates",
    "task": "Microsoft is stealing our ideas again...",
    "creator": {
      "_id": "5c9bde40c3de5a9b8c23e692",
      "name": "Steve Jobs"
    }
  },
  {
    "_id": "5c9bf709f2ee23a7f29ca771",
    "title": "Straighten Capacitors on Apple II",
    "task": "Steve wants this motherboard to be perfect.",
    "creator": {
      "_id": "5c9bdec3027b909cfb9ddf6e",
      "name": "Steve Wozniak"
    }
  },
  {
    "_id": "5c9bf71bf2ee23a7f29ca772",
    "title": "Buy some more floppy disks",
    "task": "If only I could upload data somewhere... like the cloud?",
    "creator": {
      "_id": "5c9bdec3027b909cfb9ddf6e",
      "name": "Steve Wozniak"
    }
  }
]
```

### GET `todos/:id`

This returns a single todo in the collection, as well as a modified key `creator` containing an object `{_id, name}` for their creator.

**Request Parameters**:

```json
{
  "id": "5c9bf71bf2ee23a7f29ca772"
}
```

**Response**:

```json
{
  "_id": "5c9bf709f2ee23a7f29ca771",
  "creator": {
    "_id": "5c9bdec3027b909cfb9ddf6e",
    "name": "Steve Wozniak"
  },
  "title": "Straighten Capacitors on Apple II",
  "task": "Steve wants this motherboard to be perfect."
}
```

### POST `todos/`

This route creates a new todo, which will have the keys `creator`, `title` and `task` specified by the data in the request body. Returns the newly created todo document.

**Request Body**:

```json
{
  "creator": "5c9bfdd9edf526ab046dae92",
  "title": "Pickup More Resistors",
  "task": "Find the nearest RadioShack and bring coupons."
}
```

**Response**:

```json
{
  "_id": "5c9c035dedf526ab046dae96",
  "creator": "5c9bfdd9edf526ab046dae92",
  "title": "Pickup More Resistors",
  "task": "Find the nearest RadioShack and bring coupons."
}
```

### PUT `todos/:id`

This route updates a todo, specified by the keys in the request body: `newTitle` and `newTask`. At least one key is required. Returns the updated todo document.

**Request Parameters**:

```json
{
  "id": "5c9c035dedf526ab046dae96"
}
```

**Request Body**:

```json
{
  "newTitle": "Pickup More Resistors (and Transistors)"
}
```

**Response**:

```json
{
  "_id": "5c9c035dedf526ab046dae96",
  "creator": "5c9bfdd9edf526ab046dae92",
  "title": "Pickup More Resistors (and Transistors)",
  "task": "Find the nearest RadioShack and bring coupons."
}
```

### DELETE `todos/:id`

This route deletes a todo document. Returns the deleted todo, as well as a modified key `creator` containing an object `{_id, name}` for their creator.

**Request Parameters**:

```json
{
  "id": "5c9c035dedf526ab046dae96"
}
```

**Response**:

```json
{
  "deleted": true,
  "data": {
    "_id": "5c9c035dedf526ab046dae96",
    "creator": {
      "_id": "5c9bfdd9edf526ab046dae92",
      "name": "Rob Herley"
    },
    "title": "Pickup More Resistors (and Transistors)",
    "task": "Find the nearest RadioShack and bring coupons."
  }
}
```
