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
        const parsed = JSON.parse(stored);
        // 만약 JSON 파일(최신)에 토큰이 더 많이 추가되었다면 로컬 스토리지를 덮어씌웁니다.
        if (parsed.length < initialTokens.length) {
          setTokens(initialTokens as TokenItem[]);
          localStorage.setItem('pds_tokens', JSON.stringify(initialTokens));
        } else {
          setTokens(parsed);
        }
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
