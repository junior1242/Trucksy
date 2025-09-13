import { useMemo } from "react";
import { io } from "socket.io-client";
import { useUser } from "@clerk/clerk-expo";

export function useSocket(role: "user" | "driver") {
  const { user } = useUser();
  const socket = useMemo(
    () =>
      io(process.env.EXPO_PUBLIC_SOCKET_URL!, {
        auth: { userId: user?.id, role },
      }),
    [user?.id, role]
  );
  return socket;
}
