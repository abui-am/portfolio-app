"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/actions/admin";

interface LoginState {
  error?: string;
}

async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const result = await loginAdmin(formData);
  return result ?? {};
}

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-[12px] font-medium text-[#333]">Password</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-[#e6e6e6] px-3 py-2 text-[13px] outline-none focus:border-[#18a0fb]"
        />
      </label>
      {state.error ? <p className="text-[12px] text-[#ff7262]">{state.error}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-[#18a0fb] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#0d8de5] disabled:opacity-60"
      >
        {isPending ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
