import { useState, useEffect } from 'react';
import initialComponents from '../data/components.json';

export interface ComponentItem {
  id: string;
  name: string;
  category: string;
  category_group?: 'Action' | 'Input' | 'Display' | 'Feedback' | 'Navigation';
  thumbnail_bg?: string;
  thumbnail_icon?: string;
  short_description?: string;
  status: 'stable' | 'beta' | 'deprecated';
  owner: string;
  figma_link?: string;
  dev_link?: string;
  description: string;
  updated_at: string;
  version: string;
  anatomy?: { number: number; name: string; description: string }[];
  variants?: { name: string; description: string; type: 'do' | 'dont' | 'neutral' }[];
  usage_guidelines?: { type: 'do' | 'dont'; title: string; description: string }[];
  spec?: { sizes: string[]; notes: string };
  figma_properties?: { property: string; values: string; default: string }[];
  version_history?: { version: string; date: string; note: string }[];
  usage_do?: string[];
  usage_dont?: string[];
}

export function useComponents() {
  const [components, setComponents] = useState<ComponentItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('pds_components');
    if (stored) {
      setComponents(JSON.parse(stored));
    } else {
      setComponents(initialComponents as ComponentItem[]);
      localStorage.setItem('pds_components', JSON.stringify(initialComponents));
    }
  }, []);

  const saveComponent = (newComponent: ComponentItem) => {
    const isExisting = components.find(c => c.id === newComponent.id);
    let updated: ComponentItem[];
    if (isExisting) {
      updated = components.map(c => c.id === newComponent.id ? newComponent : c);
    } else {
      updated = [newComponent, ...components];
    }
    setComponents(updated);
    localStorage.setItem('pds_components', JSON.stringify(updated));
  };

  return { components, saveComponent };
}
