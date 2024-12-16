"use client";

import { getElement } from "@/lib/client/fluent/getElement";
import { DEFAULT_LOCALE } from "@@/i18n-config";
import { FluentBundle, FluentResource, FluentVariable } from "@fluent/bundle";
import React, {
  ReactElement,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type FluentTranslationContextType = {
  bundle: FluentBundle | undefined;
};

const FluentTranslationContext = createContext<FluentTranslationContextType>({
  bundle: undefined,
});

export function TranslationProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: string | null;
  children?: React.ReactNode;
}) {
  const bundleCache = useMemo(() => {
    if (!messages) {
      return undefined;
    }

    const bundle = new FluentBundle(locale);
    bundle.addResource(new FluentResource(messages));
    return bundle;
  }, [locale, messages]);

  return (
    <FluentTranslationContext.Provider value={{ bundle: bundleCache }}>
      {children}
    </FluentTranslationContext.Provider>
  );
}

function translate(bundle?: FluentBundle | null, id?: string, args = {}) {
  if (!id) {
    return "";
  }
  if (!bundle) {
    return `Missing bundle`;
  }
  const message = bundle.getMessage(id);
  if (!message || !message.value) {
    return `Missing translation: ${id}`;
  }
  return bundle.formatPattern(message.value, args);
}

export function useBundle() {
  const context = useContext(FluentTranslationContext);

  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }

  const { bundle } = context || {};

  return bundle;
}

export function useTranslations() {
  const bundle = useBundle();

  const translateInner = useCallback(
    (id?: string, args = {}) => translate(bundle, id, args),
    [bundle]
  );

  return translateInner;
}

export function useLocale() {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);

  useEffect(() => {
    async function fetchLocale() {
      try {
        const response = await fetch("/api/locale");
        const { locale } = await response.json();
        setLocale(locale);
      } catch (error) {
        console.error("Error loading locale", error);
        setLocale(DEFAULT_LOCALE);
      }
    }
    fetchLocale();
  }, []);

  return locale;
}

export function Translate({
  children,
  id,
  vars,
  elems,
  attrs,
}: {
  children?: ReactNode;
  id: string;
  vars?: Record<string, FluentVariable>;
  elems?: Record<string, ReactElement>;
  attrs?: Record<string, boolean>;
}): React.ReactNode {
  const bundle = useBundle();
  const [element, setElement] = useState<ReactNode>(children);

  useEffect(() => {
    try {
      const newElement = getElement({
        bundle,
        sourceElement: children,
        id,
        args: {
          vars,
          elems,
          attrs,
        },
      });
      setElement(newElement);
    } catch (error) {}
  }, [bundle, id, vars, elems, attrs, children]);

  return element;
}
