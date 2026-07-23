import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'English';
  });

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('app_language', newLang);
  };

  const isRtl = language === 'العربية (Arabic)' || language === 'Kurdish (کوردی)' || language?.includes('Arabic') || language?.includes('العربية') || language?.includes('Kurdish') || language?.includes('کوردی');

  return (
    // قمنا بتمرير setLanguage و changeLanguage معاً لضمان عدم حدوث أي خطأ في أي صفحة
    <LanguageContext.Provider value={{ language, setLanguage, changeLanguage, isRtl }}>
      <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen">
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);