import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { lovable } from "@/integrations/lovable/index";
import { BrandLockup } from "@/components/pretendpro/BrandLockup";

type Provider = "google" | "microsoft" | "apple";

const providers: ReadonlyArray<{
  id: Provider;
  label: string;
  icon: string;
}> = [
  { id: "google", label: "Continue with Google", icon: "fa-brands fa-google" },
  { id: "microsoft", label: "Continue with Microsoft", icon: "fa-brands fa-microsoft" },
  { id: "apple", label: "Continue with Apple", icon: "fa-brands fa-apple" },
];

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — PretendPro Office Suite" },
      {
        name: "description",
        content: "Sign in to PretendPro Office Suite with Google, Microsoft, or Apple.",
      },
      { property: "og:title", content: "Sign in — PretendPro Office Suite" },
      {
        property: "og:description",
        content: "Sign in to PretendPro Office Suite with Google, Microsoft, or Apple.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [pending, setPending] = useState<Provider | null>(null);

  const signIn = async (provider: Provider) => {
    setPending(provider);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setPending(null);
      toast.error("Sign-in failed", { description: result.error.message });
      return;
    }
    if (result.redirected) {
      // Browser is navigating to the provider — leave the pending state on.
      return;
    }
    setPending(null);
    toast.success("Signed in");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="flex justify-center">
          <BrandLockup />
        </div>
        <h1 className="mt-6 text-center text-xl font-semibold text-foreground">
          Sign in to PretendPro
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Pick a provider to continue.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {providers.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={pending !== null}
              onClick={() => signIn(p.id)}
              className="inline-flex w-full items-center justify-center gap-3 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              <i className={p.icon} aria-hidden="true" />
              {pending === p.id ? "Redirecting…" : p.label}
            </button>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="underline underline-offset-2 hover:text-foreground">
            Back to the suite
          </Link>
        </p>
      </div>
    </main>
  );
}
