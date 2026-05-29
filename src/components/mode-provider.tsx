'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Mode } from '@/lib/mode';
import { modeConfig } from '@/lib/mode-config';

type ModeContextValue = {
  serverMode: Mode;
  effectiveMode: Mode;
  override: Mode | null;
  setOverride: (m: Mode | null) => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);

const STORAGE_KEY = 'mode-override';

export function ModeProvider({
  serverMode,
  children,
}: {
  serverMode: Mode;
  children: React.ReactNode;
}) {
  const [override, setOverrideState] = useState<Mode | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in modeConfig) setOverrideState(stored as Mode);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const allClasses = Object.values(modeConfig).map((c) => c.cssClass);
    for (const c of allClasses) root.classList.remove(c);
    const active = override ?? serverMode;
    root.classList.add(modeConfig[active].cssClass);
  }, [override, serverMode]);

  const setOverride = (m: Mode | null) => {
    if (m) localStorage.setItem(STORAGE_KEY, m);
    else localStorage.removeItem(STORAGE_KEY);
    setOverrideState(m);
  };

  return (
    <ModeContext.Provider
      value={{
        serverMode,
        effectiveMode: override ?? serverMode,
        override,
        setOverride,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}
