import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getUserInfo } from "@/utils/auth";
import { getFromLocalStorage } from "@/utils/localStorage";
import { ACCESS_TOKEN, BASE_URL } from "@/utils/constant";

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const user = getUserInfo();
    const token = getFromLocalStorage(ACCESS_TOKEN);

    // Only connect if user is authenticated and is SUPER_ADMIN
    if (!user || !token || user.role !== "SUPER_ADMIN") {
      return;
    }

    // Initialize socket connection
    socketRef.current = io(BASE_URL, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on("connect", () => {
      console.log("Socket.io connected successfully");
      setIsConnected(true);
      setError(null);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.io disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.io connection error:", error);
      setError(error.message);
      setIsConnected(false);
    });

    socket.on("error", (error) => {
      console.error("Socket.io error:", error);
      setError(error.message);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Function to listen for specific events
  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  // Function to remove event listeners
  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  // Function to emit events
  const emit = (event, data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    error,
    on,
    off,
    emit,
  };
};

export default useSocket;
