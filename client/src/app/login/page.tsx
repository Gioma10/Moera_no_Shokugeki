"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  UtensilsCrossed,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { auth, db } from "@/lib/firebase";

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

// ─── Componente occhio password ───────────────────────────────────────────────

function PasswordInput({
  placeholder,
  show,
  onToggle,
  autoFocus,
  field,
}: {
  placeholder: string;
  show: boolean;
  onToggle: () => void;
  autoFocus?: boolean;
  field: any;
}) {
  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        type={show ? "text" : "password"}
        autoFocus={autoFocus}
        {...field}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

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

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: "", password: "", confirmPassword: "" },
  });

  async function onEmailSubmit({ email }: z.infer<typeof emailSchema>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const { exists } = await res.json();
      setEmail(email);
      setStep(exists ? "login" : "register");
    } catch {
      setError("Errore durante il controllo. Riprova.");
    } finally {
      setLoading(false);
    }
  }

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

  function EmailRow() {
    return (
      <div className="flex items-center justify-between">
        <span className="page-description">{email}</span>
        <button
          type="button"
          onClick={() => {
            setStep("email");
            setError(null);
          }}
          className="text-xs text-brand hover:underline"
        >
          Cambia
        </button>
      </div>
    );
  }

  return (
    <div className="page-bg flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex flex-col items-center gap-4 text-center mb-10">
        <div className="bg-brand-light rounded-full p-5 shadow-inner">
          <UtensilsCrossed className="w-10 h-10 text-brand" />
        </div>
        <div className="space-y-1">
          <h1 className="page-title">
            Moera <span className="page-title-accent">No Shokugeki</span>
          </h1>
          <p className="page-description">
            {step === "email" && "Inserisci la tua email per continuare"}
            {step === "login" && "Bentornato! Inserisci la tua password"}
            {step === "register" && "Crea il tuo account"}
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="page-card w-full max-w-sm p-8 space-y-6">
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
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                className="btn-brand w-full"
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
              <EmailRow />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput
                        placeholder="Password"
                        show={showLoginPassword}
                        onToggle={() => setShowLoginPassword((v) => !v)}
                        autoFocus
                        field={field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                className="btn-brand w-full"
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
              <EmailRow />
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
                      <PasswordInput
                        placeholder="Password"
                        show={showRegisterPassword}
                        onToggle={() => setShowRegisterPassword((v) => !v)}
                        field={field}
                      />
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
                      <PasswordInput
                        placeholder="Conferma password"
                        show={showConfirmPassword}
                        onToggle={() => setShowConfirmPassword((v) => !v)}
                        field={field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                className="btn-brand w-full"
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

      <p className="page-footer mt-10">Made with ❤️ by Gioma</p>
    </div>
  );
}
