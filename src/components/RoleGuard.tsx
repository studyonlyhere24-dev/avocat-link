import { useEffect } from "react";
import { useApp } from "@/lib/store";
import { can, type Action } from "@/lib/rbac";
import { useAudit } from "@/lib/audit";
import { AccessDenied } from "./AccessDenied";
import { useNavigate } from "@tanstack/react-router";

/**
 * Wraps a page/section. If the current user lacks the required action,
 * renders <AccessDenied/> and logs an `access_denied` audit event.
 * If user is not authenticated at all, redirects to /login.
 */
export function RoleGuard({
  action,
  requiredRole,
  children,
}: {
  action: Action;
  requiredRole?: "client" | "lawyer";
  children: React.ReactNode;
}) {
  const user = useApp((s) => s.user);
  const log = useAudit((s) => s.log);
  const navigate = useNavigate();
  const allowed = can(user?.role, action);

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (!allowed) {
      log({
        type: "access_denied",
        actor: user?.name ?? "Anonymous",
        role: user?.role ?? "anonymous",
        detail: `Blocked: ${action}`,
      });
    }
    // intentionally only run when allowed flips
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed, action, user]);

  if (!user) return null; // redirect in progress
  if (!allowed) return <AccessDenied requiredRole={requiredRole} />;
  return <>{children}</>;
}
