import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AssertAuthenticated } from "@/components/auth/AssertAuthenticated";
import { RedirectToLogin } from "@/components/auth/RedirectToLogin";

export default function ChefLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AssertAuthenticated
      roles={["admin", "approved"]}
      fallback={
        <Suspense>
          <RedirectToLogin />
        </Suspense>
      }
      loader={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="size-8 animate-spin text-orange-500" />
        </div>
      }
    >
      {children}
    </AssertAuthenticated>
  );
}
