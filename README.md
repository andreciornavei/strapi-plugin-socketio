# Strapi plugin socketio

`strapi-plugin-socketio` is a plugin made to turn easy the integration of your strapi application with socket.io technology. All you need to do is join users to rooms and send messages to theses yousers anytime without worrying setup or handle connections.

Also on your frontend application, you just need to use `socket.io-client` and connect to strapi endpoint passing the user JWT token on handskae and you're done, just subscribe to the events you want and receive its messages.

```js
import socketIOClient from "socket.io-client";
export default function () {
    let socket = undefined;
    return {
        connect: (jwt) => {
            try {
                socket = socketIOClient(`http://localhost:1337`, { 
                  query: { jwt: jwt } 
                });                
            } catch (error) {
                console.log(error)
            }
        },
    }
}
```
I develop a simple mobile app to test your strapi socketio, so you can run and test without need to create a frontend application. See this repository: [https://github.com/andreciornavei/socketlog](https://github.com/andreciornavei/socketlog)

## How it works?

This plugin injects the socket.io on your strapi aplication automatically, all you need to do is connect to this socket after authenticate your user on frontend passing the JWT token received on strapi login to socket.io query handshake connection.

With this plugin, socket.io is accessible by your entire strapi application, it automatically handle the user id as a room, so you every can take your collections relationships and send messages direcly to associated users, so if this user is connected to your application over socket.io, it will receive your message.

## Default user room
This plugin makes use of strapi `users-permissions` plugin, associating the logged user with JWT token to the connected socket, when it happens, is created a new room for this user called `user::{USER_ID}`, so you can any time send a message to a logged-in user just specifying its id.


## Rooms
You can join a user to a room any time, like when a room is created or when a user joins to a room on database, following the command below, the user will be attached to desired room and will receive any message sent to its id.

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

[![License: MIT](https://img.shields.io/badge/license-MIT-purple.svg)]()

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
