"use client";

import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://localhost:4000";

export const socket = (token: string) =>
  io(URL, {
    withCredentials: true,
    extraHeaders: {
      "x-access-token": token,
    },
  });
