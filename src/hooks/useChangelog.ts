import { useState, useEffect } from 'react';
import initialChangelog from '../data/changelog.json';

export interface ChangelogItem {
  id: string;
  target_id: string;
  target_type: 'component' | 'token';
  action: 'create' | 'update' | 'deprecate';
  changed_by: string;
  note: string;
  date: string;
}

export function useChangelog() {
  const [changelog, setChangelog] = useState<ChangelogItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('pds_changelog');
    if (stored) {
      setChangelog(JSON.parse(stored));
    } else {
      setChangelog(initialChangelog as ChangelogItem[]);
      localStorage.setItem('pds_changelog', JSON.stringify(initialChangelog));
    }
  }, []);

  const addLog = (log: ChangelogItem) => {
    const updated = [log, ...changelog];
    setChangelog(updated);
    localStorage.setItem('pds_changelog', JSON.stringify(updated));
  };

  return { changelog, addLog };
}
