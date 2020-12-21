# Strapi plugin socketio

`strapi-plugin-socketio` is a plugin made for` strapi cms` making integration with socket.io easy. All you need to do is join users to the desired rooms and send messages to those users at any time, without worrying about configuration or connections.

To start using this plugin all you need to do is install this package on your package.json
```bash
yarn add strapi-plugin-socketio
```

On your frontend application, you will need to use `socket.io-client` to connect on strapi endpoint by passing the user's JWT token in the handshake and signing up for events you want to receive messages.

```js
import socketIOClient from "socket.io-client";
export default function (jwt) {
  const socket = socketIOClient(`http://localhost:1337`, { 
    query: { jwt: jwt } 
  });    
  socket.on("myCustomEvent", (data) => {
    console.log(data)
  })            
}
```
I develop a simple mobile app to test your strapi socket.io, so you can run and test it without having to create a frontend app. See this repository: [https://github.com/andreciornavei/socketlog](https://github.com/andreciornavei/socketlog)

## How it works?


This plugin injects socket.io into your strapi application automatically, all you need to do is connect to this socket after authenticating your user at the frontend by passing the JWT token received at the strapi login for the socket query handshake.

With this plugin, socket.io can be accessed throughout your Strapi app, it automatically treats the user id as a room, so you can take your collection relationships and send messages directly to associated users.

## Default user room
This plugin makes use of the `users-permissions` strapi plugin, associating the logged in user with the JWT token to the connected socket, when this happens, a new room is created for this user called `user::{USER_ID}`, than you can, any time, send a message to a logged in user just specifying his id.


## Rooms
You can join the user to a room any time, like when a room is created or when a user create a new entry on database, following the command below, the user will be attached to desired room and will receive any message sent to its id.

```js
await strapi.io.join(user.id, "room::room_id")
```

## Emitter
You can send a message to socket rooms any time just calling the command below.

```js
await strapi.io.send(`user::${user.id}`, "socketlog", `Hello ${user.email}`)
```

## Bootstrap connection
This plugin allows you to implement a bootstrap script for each new incomming connection, so in this momment you can check for user relationships that handle event messages for a group of users and attach the new connection to this rooms. With that, when the relationship needs to emit a message, it will deliver to all users connected on specified room.

#### `extensions/socketio/config/functions/connection.js`
```js
module.exports = async (socket, user) => {
  await strapi.io.join(user.id, "chat::id_1")
  await strapi.io.join(user.id, "group::id_2")
  await strapi.io.send(`user::${user.id}`, "welcome_event", `Hello ${user.email}`)
}
```

---

## 📜 License

[![License: MIT](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)

Copyright (c) 2020 André Ciornavei

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
