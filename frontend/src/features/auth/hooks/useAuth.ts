import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { signOut } from "@/features/auth/store/authSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  return useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      signOut: () => dispatch(signOut())
    }),
    [dispatch, token, user]
  );
}
