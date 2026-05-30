'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

const STORAGE_KEY = 'is-dominik';

type State = { isOwner: boolean; hasDecided: boolean };

type OwnerCtx = State & {
  setIsOwner: (v: boolean) => void;
};

const Ctx = createContext<OwnerCtx | null>(null);

export function OwnerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({
    isOwner: false,
    hasDecided: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'yes' || stored === 'no') {
      setState({ isOwner: stored === 'yes', hasDecided: true });
    }
  }, []);

  const setIsOwner = (v: boolean) => {
    localStorage.setItem(STORAGE_KEY, v ? 'yes' : 'no');
    setState({ isOwner: v, hasDecided: true });
  };

  return <Ctx.Provider value={{ ...state, setIsOwner }}>{children}</Ctx.Provider>;
}

export function useOwner() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useOwner must be used within OwnerProvider');
  return v;
}
