import { useSocket } from "socket.io-react-hook";

export const useGroupSocket = (groupId: string | undefined) => {
  return useSocket(String(process.env.NEXT_PUBLIC_API_URL), {
    enabled: !!groupId,
  });
};
