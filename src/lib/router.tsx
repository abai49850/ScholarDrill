"use client";

import NextLink from "next/link";
import {
  notFound,
  useParams as useNextParams,
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type To = string;

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: To;
  href?: never;
  prefetch?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, prefetch, ...props }, ref) => (
    <NextLink ref={ref} href={to} prefetch={prefetch} {...props} />
  ),
);
Link.displayName = "Link";

interface NavLinkProps extends Omit<LinkProps, "className"> {
  end?: boolean;
  className?: string | ((state: { isActive: boolean; isPending: boolean }) => string);
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ to, end, className, ...props }, ref) => {
    const pathname = usePathname() ?? "";
    const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
    const resolvedClassName =
      typeof className === "function" ? className({ isActive, isPending: false }) : className;

    return <Link ref={ref} to={to} className={resolvedClassName} {...props} />;
  },
);
NavLink.displayName = "NavLink";

export function useNavigate() {
  const router = useRouter();
  return (to: string | number, options?: { replace?: boolean; state?: unknown }) => {
    if (typeof to === "number") {
      window.history.go(to);
      return;
    }
    if (options?.replace) router.replace(to);
    else router.push(to);
  };
}

export function useLocation() {
  const pathname = usePathname() ?? "";
  const searchParams = useNextSearchParams();
  const search = searchParams?.toString() ?? "";
  return {
    pathname,
    search: search ? `?${search}` : "",
    hash: typeof window === "undefined" ? "" : window.location.hash,
    state: null,
  };
}

export function useParams<T extends Record<string, string | string[] | undefined> = Record<string, string>>() {
  return useNextParams() as T;
}

export function useSearchParams(): [URLSearchParams, (next: URLSearchParams | Record<string, string> | string) => void] {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const params = useNextSearchParams();
  const mutableParams = useMemo(() => new URLSearchParams(params?.toString() ?? ""), [params]);

  const setSearchParams = (next: URLSearchParams | Record<string, string> | string) => {
    const nextParams =
      typeof next === "string"
        ? new URLSearchParams(next)
        : next instanceof URLSearchParams
          ? next
          : new URLSearchParams(next);
    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return [mutableParams, setSearchParams];
}

export function Navigate({ to, replace }: { to: string; replace?: boolean; state?: unknown }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);
  return null;
}

const OutletContext = createContext<ReactNode>(null);

export function Outlet() {
  return <>{useContext(OutletContext)}</>;
}

export function OutletProvider({ children, outlet }: { children: ReactNode; outlet: ReactNode }) {
  return <OutletContext.Provider value={outlet}>{children}</OutletContext.Provider>;
}

export { notFound };
export type { LinkProps, NavLinkProps };
