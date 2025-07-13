import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "@/utils/constant";

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socketUrl = SOCKET_URL;

    socketRef.current = io(socketUrl, {
      forceNew: true,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      setIsConnected(true);
      setError(null);
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("💥 Socket connection error:", error.message);
      setError(error.message);
      setIsConnected(false);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    error,
    on,
    off,
  };
};

export default useSocket;
