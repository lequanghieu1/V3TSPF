const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const getClientRoom = () => {
  let index = 0;
  while (true) {
    if (
      !io.sockets.adapter.rooms.get(index) ||
      io.sockets.adapter.rooms.get(index).size < 2
    ) {
      return index;
    }
    index++;
  }
};

io.on("connect", socket => {
  const clientRoom = getClientRoom(); // Lấy room thỏa mãn điều kiện
  console.log(socket.id)
  socket.join(clientRoom);
  if (io.sockets.adapter.rooms.get(clientRoom).size < 2) {
    //kiểm tra xem phòng có dưới 2 ng trong phòng không
    io.in(clientRoom).emit(
      "statusRoom",
      `Dang cho .... `
    ); // emit cho tất cả client trong phòng
  } else {
    io.in(clientRoom).emit(
      "statusRoom",
      `da co nguoi vao phong .... `
    ); // emit cho tất cả client trong phòng
  }
  socket.on("sendMessage", function (message) {
    socket.to(clientRoom).emit("receiveMessage", message);
  });
  socket.on("disconnect", reason => {
    // Khi client thoát thì emit cho người cùng phòng biết
    socket
      .to(clientRoom)
      .emit("statusRoom", "Người lạ đã thoát. Đang chờ người tiếp theo ....");
  });
});

server.listen(8000, () => {
  console.log("listening on *:4000");
});
