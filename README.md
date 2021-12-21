# Rakamin

## API Reference

## List of APIs

Login to the App

```http
  POST /login
```

| Body       | Type     | Description                  |
| :--------- | :------- | :--------------------------- |
| `email`    | `string` | **Required**. Login email    |
| `password` | `string` | **Required**. Login password |

Register an account

```http
  POST /register
```

| Body       | Type     | Description                     |
| :--------- | :------- | :------------------------------ |
| `name`     | `string` | **Required**. Register name     |
| `email`    | `string` | **Required**. Register email    |
| `password` | `string` | **Required**. Register password |

Get all chat rooms

```http
  GET /getroom
```

| Header         | Type     | Description                     |
| :------------- | :------- | :------------------------------ |
| `access_token` | `string` | **Required**. Your access_token |

Get chat by rooms

```http
  GET /getchat/:roomid
```

| Header         | Type     | Description                     |
| :------------- | :------- | :------------------------------ |
| `access_token` | `string` | **Required**. Your access_token |

Send a chat to a room

```http
  POST /sendchat/:roomid
```

| Header         | Type     | Description                     |
| :------------- | :------- | :------------------------------ |
| `access_token` | `string` | **Required**. Your access_token |

| Query    | Type      | Description                  |
| :------- | :-------- | :--------------------------- |
| `roomid` | `integer` | **Required**. id of the room |

| Body      | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `message` | `string` | **Required**. Your Message |

Send a chat to a room

```http
  POST /createroom/:room_mate_id
```

| Header         | Type     | Description                     |
| :------------- | :------- | :------------------------------ |
| `access_token` | `string` | **Required**. Your access_token |

| Query          | Type      | Description                                          |
| :------------- | :-------- | :--------------------------------------------------- |
| `room_mate_id` | `integer` | **Required**. id of the person you want to chat with |
