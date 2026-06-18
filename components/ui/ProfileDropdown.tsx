"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useId, useRef, useState } from "react";

type DropdownItem = {
  label: string;
  href: string;
};

type Props = {
  name: string;
  email: string;
  initials: string;
  accent: "coral" | "teal";
  items: DropdownItem[];
};

export function ProfileDropdown({ name, email, initials, accent, items }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const avatarClass = accent === "coral" ? "bg-coral" : "bg-teal";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Signed in as ${name}. Open profile menu.`}
        className="flex items-center gap-3 rounded-full border border-transparent px-1 py-1 transition-colors hover:border-border focus-visible:border-coral focus-visible:outline-none"
      >
        <span className="hidden flex-col items-end leading-tight sm:flex">
          <span className="font-display text-sm font-medium text-foreground">
            {name}
          </span>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
            {email}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-semibold text-background ${avatarClass}`}
        >
          {initials}
        </span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Profile menu"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-background shadow-xl"
        >
          <div className="border-b border-border bg-surface px-4 py-3">
            <p className="font-display text-sm font-medium text-foreground">
              {name}
            </p>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
              {email}
            </p>
          </div>
          <ul className="flex flex-col py-2">
            {items.map((item) => (
              <li key={item.href} role="none">
                <Link
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-border">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                void signOut({ callbackUrl: "/" });
              }}
              className="block w-full px-4 py-2.5 text-left font-mono text-[0.7rem] uppercase tracking-[0.14em] text-coral transition-colors hover:bg-coral/10"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
