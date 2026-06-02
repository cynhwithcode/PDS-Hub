import { useState, useEffect } from 'react';
import initialTokens from '../data/tokens.json';

export interface TokenItem {
  id: string;
  category: 'color' | 'typography' | 'spacing' | 'radius' | 'shadow';
  name: string;
  value: string;
  description: string;
  updated_at: string;
}

export function useTokens() {
  const [tokens, setTokens] = useState<TokenItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('pds_tokens');
    if (stored) {
      setTokens(JSON.parse(stored));
    } else {
      setTokens(initialTokens as TokenItem[]);
      localStorage.setItem('pds_tokens', JSON.stringify(initialTokens));
    }
  }, []);

  const saveToken = (newToken: TokenItem) => {
    const isExisting = tokens.find(t => t.id === newToken.id);
    let updated: TokenItem[];
    if (isExisting) {
      updated = tokens.map(t => t.id === newToken.id ? newToken : t);
    } else {
      updated = [newToken, ...tokens];
    }
    setTokens(updated);
    localStorage.setItem('pds_tokens', JSON.stringify(updated));
  };

  const deleteToken = (id: string) => {
    const updated = tokens.filter(t => t.id !== id);
    setTokens(updated);
    localStorage.setItem('pds_tokens', JSON.stringify(updated));
  };

  return { tokens, saveToken, deleteToken };
}
