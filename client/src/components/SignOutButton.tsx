import useAppStore from "@/store";
import { getAuth, signOut } from "firebase/auth";
import { useCallback } from "react";

export const SignOutButton = () => {
  const auth = getAuth();
  const { deleteUser } = useAppStore();

  const onSingOutClick = useCallback(async () => {
    await signOut(auth).then(() => {
      deleteUser();
    });
  }, []);

  return (
    <button onClick={onSingOutClick}>
      SingOut
    </button>
  );
};
