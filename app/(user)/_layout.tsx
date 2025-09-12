import { Stack } from "expo-router";
import Protected from "../components/../components/Protected"; // relative from (user)
import RoleGate from "../components/../components/RoleGate";

export default function UserLayout() {
  return (
    <Protected>
      <RoleGate role="user">
        <Stack />
      </RoleGate>
    </Protected>
  );
}
