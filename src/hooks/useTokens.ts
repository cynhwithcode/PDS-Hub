import { useState, useEffect } from 'react';
import initialTokens from '../data/tokens.json';

export interface TokenItem {
  id: string;
  category: string;
  tier: 'core' | 'semantic';
  name: string;
  value: string | { light: string; dark: string };
  description: string;
  updated_at: string;
  owner?: string;
  status?: 'stable' | 'beta' | 'deprecated';
  version?: string;
  usage_do?: string[];
  usage_dont?: string[];
  figma_link?: string;
  dev_link?: string;
}

export function useTokens() {
  const [tokens, setTokens] = useState<TokenItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('pds_tokens');
    if (stored) {
      try {
        setTokens(JSON.parse(stored));
      } catch (e) {
        setTokens(initialTokens as TokenItem[]);
        localStorage.setItem('pds_tokens', JSON.stringify(initialTokens));
      }
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
