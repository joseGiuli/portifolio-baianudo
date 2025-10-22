'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n/config';

// Criar contexto para i18n
const I18nContext = createContext();

// Hook personalizado para usar o contexto
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n deve ser usado dentro de um I18nProvider');
  }
  return context;
}

export default function I18nProvider({ children }) {
  const { ready, i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [shouldShowLoading, setShouldShowLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Verifica se há inglês salvo no localStorage
    const savedLanguage =
      typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : null;

    // Mostra loading apenas se o idioma salvo for inglês
    if (savedLanguage === 'en') {
      setShouldShowLoading(true);

      // Remove o loading após um breve delay para aplicar as traduções
      setTimeout(() => {
        setShouldShowLoading(false);
      }, 300);
    }
  }, []);

  // Durante a hidratação no servidor, não renderiza nada
  if (!isClient) {
    return null;
  }

  // Se deve mostrar loading (apenas para inglês), exibe a tela de carregamento
  if (shouldShowLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Renderiza normalmente em todos os outros casos
  return (
    <I18nContext.Provider value={{ i18n }}>{children}</I18nContext.Provider>
  );
}
