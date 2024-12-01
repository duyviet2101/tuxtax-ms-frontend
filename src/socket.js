// import {io} from "socket.io-client";
//
// const URL = "http://localhost:3056";
//
// export const socket = io(URL);

import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3056";

// Ensure the socket is instantiated only once
let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(URL, {
      // autoConnect: false, // Prevent auto-connection, you can connect explicitly
    });
  }
  return socket;
};