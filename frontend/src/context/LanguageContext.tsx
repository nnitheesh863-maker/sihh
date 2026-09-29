import React, { createContext, useContext, useState, ReactNode } from 'react';

type SupportedLanguage = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    appTitle: 'PeelVision AI – Onion Quality Assessment System',
    startGrading: 'Start Conveyor Grading',
    gradeA: 'Grade A (Export)',
    gradeB: 'Grade B (Domestic)',
    gradeC: 'Grade C (Processing)',
    reject: 'Reject (Culled)',
    mandiPrices: 'Live Mandi Prices',
    telemetry: 'Conveyor Telemetry',
    exportReport: 'Export Certificate'
  },
  hi: {
    appTitle: 'एआई प्याज गुणवत्ता मूल्यांकन एवं ग्रेडिंग प्रणाली',
    startGrading: 'ग्रेडिंग शुरू करें',
    gradeA: 'ग्रेड ए (निर्यात)',
    gradeB: 'ग्रेड बी (घरेलू)',
    gradeC: 'ग्रेड सी (प्रसंस्करण)',
    reject: 'रिजेक्ट (खराब)',
    mandiPrices: 'लाइव मंडी भाव',
    telemetry: 'कन्वेयर टेलीमेट्री',
    exportReport: 'प्रमाणपत्र डाउनलोड करें'
  },
  mr: {
    appTitle: 'कांदा प्रतवारी व गुणवत्ता मूल्यमापन प्रणाली',
    startGrading: 'प्रतवारी सुरू करा',
    gradeA: 'दर्जा अ (निर्यात)',
    gradeB: 'दर्जा ब (स्थानिक बाजार)',
    gradeC: 'दर्जा क (प्रक्रिया)',
    reject: 'नाकारलेला (खराब)',
    mandiPrices: 'थेट बाजारभाव',
    telemetry: 'कन्व्हेयर टेलिमेट्री',
    exportReport: 'प्रमाणपत्र डाउनलोड'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
