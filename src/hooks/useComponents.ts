import { useState, useEffect } from 'react';
import initialComponents from '../data/components.json';

export interface ComponentItem {
  id: string;
  name: string;
  category: string;
  status: 'stable' | 'beta' | 'deprecated';
  owner: string;
  figma_link?: string;
  dev_link?: string;
  description: string;
  updated_at: string;
  version: string;
  usage_do?: string[];
  usage_dont?: string[];
  anatomy?: { number: number; name: string; description: string }[];
  variants?: { name: string; description: string; type: 'do' | 'dont' | 'neutral' }[];
  usage_guidelines?: { type: 'do' | 'dont'; title: string; description: string }[];
  spec?: { sizes: string[]; notes: string };
  figma_properties?: { property: string; values: string; default: string }[];
  version_history?: { version: string; date: string; note: string }[];
}

export function useComponents() {
  const [components, setComponents] = useState<ComponentItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('pds_components');
    if (stored) {
      try {
        const parsedStored = JSON.parse(stored);
        if (parsedStored.length !== initialComponents.length) {
          setComponents(initialComponents as ComponentItem[]);
          localStorage.setItem('pds_components', JSON.stringify(initialComponents));
        } else {
          setComponents(parsedStored);
        }
      } catch (e) {
        setComponents(initialComponents as ComponentItem[]);
        localStorage.setItem('pds_components', JSON.stringify(initialComponents));
      }
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
