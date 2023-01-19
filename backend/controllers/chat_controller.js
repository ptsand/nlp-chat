
let users = [];   // keep users in memory
let msgID = 0;

// handle connections to socket
export const respond = (socket, io) => {
    let user = socket.request.user;     // the connected user
    for (let [id, socket] of io.of("/").sockets) {
        let user = socket.request.user;
        if (users.filter(u=>u.id===user.id).length < 1) {
            users.push({
                id: user.id,
                username: user.username,
                connected: true
            });
        }
    }
    socket.emit("users", users);

    // notify existing users
    socket.broadcast.emit("user connected", {
      id: user.id,
      username: user.username,
    });

    socket.on("disconnect", async () => {
        // remove disconnected user
        users = users.filter(u => u.id !== user.id);
        // notify other clients
        socket.broadcast.emit("user disconnected", user.username);
    });

    socket.on("chat message", (message) => {
        // console.log(data, socket.handshake.auth);
        const msg = { id: ++msgID, sender: { id: user.id, username: user.username}, content: message };
        io.emit("chat message", msg);
    });
}
