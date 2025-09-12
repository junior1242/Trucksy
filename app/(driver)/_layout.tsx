import { Stack } from "expo-router";
import Protected from "../../components/Protected";
import RoleGate from "../../components/RoleGate";

export default function DriverLayout() {
  return (
    <Protected>
      <RoleGate role="driver">
        <Stack />
      </RoleGate>
    </Protected>
  );
}
