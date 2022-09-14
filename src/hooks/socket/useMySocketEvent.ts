import { useSocket, useSocketEvent } from "socket.io-react-hook";

export function useMySocketEvent<T>(eventName: string) {
  const { socket } = useSocket(String(process.env.NEXT_PUBLIC_WS_URL));

  return useSocketEvent<T>(socket, eventName);
}
