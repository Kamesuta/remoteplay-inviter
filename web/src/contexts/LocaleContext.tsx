"use client";
import { createContext, useContext, ReactNode } from 'react';

type Locale = 'en' | 'ja';

interface LocaleContextType {
  locale: Locale;
  messages: Record<string, unknown>;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children, locale, messages }: { 
  children: ReactNode; 
  locale: Locale; 
  messages: Record<string, unknown>;
}) {
  return (
    <LocaleContext.Provider value={{ locale, messages }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

export function useTranslations() {
  const { messages } = useLocale();
  
  function t(key: string): string {
    const keys = key.split('.');
    let value: unknown = messages;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        value = undefined;
        break;
      }
    }
    
    return (typeof value === 'string' ? value : key);
  }

  function tData<T = unknown>(key: string): T | string {
    const keys = key.split('.');
    let value: unknown = messages;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        value = undefined;
        break;
      }
    }
    
    return value !== undefined ? (value as T) : key;
  }
  
  return { t, tData };
}