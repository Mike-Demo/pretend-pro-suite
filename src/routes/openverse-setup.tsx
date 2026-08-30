import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Check, Copy, KeyRound, Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getOpenverseStatus, registerOpenverseApp } from "@/lib/openverse/register.functions";

export const Route = createFileRoute("/openverse-setup")({
  head: () => ({
    meta: [
      { title: "Openverse API Setup — PretendPro 3000" },
      {
        name: "description",
        content:
          "Register a PretendPro 3000 Openverse API application and check whether authenticated media access is configured.",
      },
      { property: "og:title", content: "Openverse API Setup — PretendPro 3000" },
      {
        property: "og:description",
        content: "Collect your Openverse app details, register for API keys, and see live credential status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OpenverseSetupPage,
});

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide opacity-70">{label}</Label>
      <div className="flex gap-2">
        <Input readOnly value={value} className="font-mono text-xs" aria-label={label} />
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Copy ${label}`}
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            toast.success(`${label} copied`);
            window.setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
      </div>
    </div>
  );
}

function OpenverseSetupPage() {
  const statusFn = useServerFn(getOpenverseStatus);
  const registerFn = useServerFn(registerOpenverseApp);

  const status = useQuery({
    queryKey: ["openverse", "status"],
    queryFn: () => statusFn(),
    staleTime: 30_000,
  });

  const [form, setForm] = useState({
    name: "PretendPro 3000",
    description: "A playful parody productivity suite that shows Creative Commons media inside fake office apps.",
    email: "",
  });

  const register = useMutation({
    mutationFn: (input: typeof form) => registerFn({ data: input }),
  });

  const result = register.data;
  const credentials = result && result.ok ? result.credentials : null;

  const configured = status.data?.configured ?? false;
  const tokenWorks = status.data?.tokenWorks ?? false;
  const statusTone = tokenWorks
    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
    : configured
      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
      : "bg-muted text-muted-foreground border-border";

  return (
    <main className="fluent-page mx-auto w-full max-w-3xl px-5 py-12">
      <nav className="mb-8 flex items-center justify-between text-sm">
        <Link to="/" className="opacity-70 hover:opacity-100">
          ← Back to setup
        </Link>
        <Link to="/licenses" className="opacity-70 hover:opacity-100">
          Open source licenses
        </Link>
      </nav>

      <h1 className="text-3xl font-semibold tracking-tight">Openverse API setup</h1>
      <p className="mt-2 max-w-2xl text-sm opacity-80">
        PretendPro pulls its stock photos and audio from{" "}
        <a className="underline" href="https://openverse.org/" target="_blank" rel="noreferrer">
          Openverse
        </a>
        . Anonymous access works out of the box; registering an application raises the rate limits.
      </p>

      <section aria-live="polite" className={`mt-6 flex items-start gap-3 rounded-xl border p-4 ${statusTone}`}>
        {status.isLoading ? (
          <Loader2 className="mt-0.5 size-5 animate-spin" aria-hidden />
        ) : tokenWorks ? (
          <ShieldCheck className="mt-0.5 size-5" aria-hidden />
        ) : (
          <ShieldAlert className="mt-0.5 size-5" aria-hidden />
        )}
        <div className="text-sm">
          <p className="font-medium">
            {status.isLoading
              ? "Checking credential status…"
              : tokenWorks
                ? "Openverse keys configured"
                : configured
                  ? "Keys stored, not yet working"
                  : "No keys stored yet"}
          </p>
          <p className="opacity-80">{status.data?.message ?? "Reading server configuration."}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => void status.refetch()}
          disabled={status.isFetching}
        >
          Re-check
        </Button>
      </section>

      <form
        className="mt-8 space-y-4 rounded-xl border border-border p-5"
        onSubmit={(event) => {
          event.preventDefault();
          register.mutate(form);
        }}
      >
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <KeyRound className="size-4" aria-hidden /> Step 1 — Register your application
        </h2>

        <div className="space-y-1.5">
          <Label htmlFor="ov-name">App name</Label>
          <Input
            id="ov-name"
            required
            minLength={2}
            maxLength={80}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ov-description">Description</Label>
          <Textarea
            id="ov-description"
            required
            minLength={10}
            maxLength={500}
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ov-email">Email</Label>
          <Input
            id="ov-email"
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <p className="text-xs opacity-70">
            Openverse emails a verification link to this address. Keys only work after you click it.
          </p>
        </div>

        <Button type="submit" disabled={register.isPending}>
          {register.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {register.isPending ? "Registering…" : "Register with Openverse"}
        </Button>

        {result && !result.ok ? (
          <p role="alert" className="text-sm text-destructive">
            {result.error}
          </p>
        ) : null}
      </form>

      {credentials ? (
        <section className="mt-6 space-y-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <h2 className="text-lg font-semibold">Step 2 — Save the keys as secrets</h2>
          <p className="text-sm opacity-80">
            Registered as <strong>{credentials.name}</strong>. Copy each value below into the secure secret form (they
            are shown once and never stored in the page).
          </p>
          <CopyField label="OPENVERSE_CLIENT_ID" value={credentials.clientId} />
          <CopyField label="OPENVERSE_CLIENT_SECRET" value={credentials.clientSecret} />
          <p className="text-sm opacity-80">
            Ask the assistant to “save my Openverse keys” — it opens a secure form where you paste these two values.
            Once saved, verify your email and press <em>Re-check</em> above; the badge turns green.
          </p>
        </section>
      ) : null}

      <p className="mt-8 text-xs opacity-60">
        Never paste secrets into chat messages or code — this app only reads them from server-side environment secrets.
      </p>
    </main>
  );
}
