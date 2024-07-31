import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import En from '../language/en/En';
import Hi from '../language/hi/Hi';
import Mr from '../language/mr/Mr';

const getStoredLanguage = async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
      return storedLanguage || 'En';
    } catch (error) {
      console.error('Error loading language from AsyncStorage:', error);
      return 'En';
    }
  };

const initializeLanguage = async () => {
    const storedLanguage = await getStoredLanguage();
        i18n
            .use(initReactI18next)
            .init({
            compatibilityJSON: 'v3',
            resources: {
                En: { translation: En },
                Hi: { translation: Hi },
                Mr: { translation: Mr },
            },
            lng: storedLanguage,
            interpolation: {
                escapeValue: false,
            },
        });
    };

initializeLanguage();

export default i18n;