"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UtensilsCrossed,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ─── Schemi Zod ───────────────────────────────────────────────────────────────

const emailSchema = z.object({
  email: z.string().email("Inserisci un'email valida"),
});

const loginSchema = z.object({
  password: z.string().min(1, "Inserisci la password"),
});

const registerSchema = z
  .object({
    displayName: z.string().min(2, "Inserisci il tuo nome (min. 2 caratteri)"),
    password: z
      .string()
      .min(6, "La password deve essere di almeno 6 caratteri"),
    confirmPassword: z.string().min(1, "Conferma la password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non coincidono",
    path: ["confirmPassword"],
  });

type Step = "email" | "login" | "register";

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Step 1 — Email
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  // Form Step 2a — Login
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "" },
  });

  // Form Step 2b — Register
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: "", password: "", confirmPassword: "" },
  });

  // ── Step 1: controlla se l'email esiste ──────────────────────────────────
  async function onEmailSubmit({ email }: z.infer<typeof emailSchema>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const { exists } = await res.json();
      setEmail(email);
      setStep(exists ? "login" : "register");
    } catch {
      setError("Errore durante il controllo. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2a: login ───────────────────────────────────────────────────────
  async function onLoginSubmit({ password }: z.infer<typeof loginSchema>) {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch {
      setError("Password errata. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2b: registrazione ───────────────────────────────────────────────
  async function onRegisterSubmit({
    displayName,
    password,
  }: z.infer<typeof registerSchema>) {
    setLoading(true);
    setError(null);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await updateProfile(user, { displayName });

      // Crea il documento utente su Firestore con ruolo "pending"
      await setDoc(doc(db, "users", user.uid), {
        email,
        displayName,
        role: "pending",
        createdAt: serverTimestamp(),
      });

      router.push("/pending");
    } catch {
      setError("Errore durante la registrazione. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  // ─── UI ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-rose-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex flex-col items-center gap-4 text-center mb-10">
        <div className="bg-orange-100 rounded-full p-5 shadow-inner">
          <UtensilsCrossed className="w-10 h-10 text-orange-500" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Moera <span className="text-orange-500">No Shokugeki</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            {step === "email" && "Inserisci la tua email per continuare"}
            {step === "login" && "Bentornato! Inserisci la tua password"}
            {step === "register" && "Crea il tuo account"}
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white border border-orange-100 rounded-3xl shadow-sm p-8 space-y-6">
        {/* Step 1 — Email */}
        {step === "email" && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="tu@email.com"
                        type="email"
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Continua <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}

        {/* Step 2a — Login */}
        {step === "login" && (
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-4"
            >
              {/* Email in sola lettura + tasto back */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{email}</span>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setError(null);
                  }}
                  className="text-xs text-orange-500 hover:underline"
                >
                  Cambia
                </button>
              </div>

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Password"
                          type={showLoginPassword ? "text" : "password"}
                          autoFocus
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700"
                        >
                          {showLoginPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Accedi"
                )}
              </Button>
            </form>
          </Form>
        )}

        {/* Step 2b — Register */}
        {step === "register" && (
          <Form {...registerForm}>
            <form
              onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
              className="space-y-4"
            >
              {/* Email in sola lettura + tasto back */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{email}</span>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setError(null);
                  }}
                  className="text-xs text-orange-500 hover:underline"
                >
                  Cambia
                </button>
              </div>

              <FormField
                control={registerForm.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Nickname" autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Password"
                          type={showRegisterPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700"
                        >
                          {showRegisterPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Conferma password"
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Crea account"
                )}
              </Button>
            </form>
          </Form>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-10">
        Made with ❤️ by Gioma
      </p>
    </div>
  );
}
