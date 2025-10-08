import { Server } from "socket.io";
import { NextApiResponse } from "next";
import type { NextApiRequest } from "next";

interface SocketServer extends NextApiResponse {
  socket: any & { server: { io?: Server } };
}

export default function initSocket(req: NextApiRequest, res: SocketServer) {
  if (!res.socket.server.io) {
    console.log("🔌 Initializing Socket.io...");
    const io = new Server(res.socket.server, {
      path: "/api/socket/io",
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
      console.log("✅ A user connected:", socket.id);

      // Join conversation room
      socket.on("join_conversation", (conversationId) => {
        socket.join(`conversation_${conversationId}`);
      });

      // When a message is sent
      socket.on("send_message", (message) => {
        io.to(`conversation_${message.conversationId}`).emit("new_message", message);
      });

      // Notifications
      socket.on("notify_user", (notif) => {
        io.to(`user_${notif.targetUserId}`).emit("new_notification", notif);
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.io already running.");
  }
}
