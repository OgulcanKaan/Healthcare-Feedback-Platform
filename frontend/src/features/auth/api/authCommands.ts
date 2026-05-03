import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/services/api/client";
import type { LoginCommand } from "@/shared/models/auth";
import { toLoginResponse } from "@/shared/models/auth";

async function loginRequest(payload: LoginCommand) {
  const { data } = await apiClient.post("/Auth/login", payload);
  return toLoginResponse(data);
}

export function useLoginCommand() {
  return useMutation({
    mutationFn: loginRequest
  });
}
