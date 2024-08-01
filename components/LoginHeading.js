import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function LoginHeading() {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (storedLanguage) {
          i18n.changeLanguage(storedLanguage);
          setCurrentLanguage(storedLanguage);
        }
      } catch (error) {
        console.error('Error loading language from AsyncStorage:', error);
      }
    };

    loadLanguage();
  }, []);

  const handleChangeLanguage = async (languageKey) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', languageKey);
      i18n.changeLanguage(languageKey);
      setCurrentLanguage(languageKey);
    } catch (error) {
      console.error('Error saving language to AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginText}>{t('back')}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={currentLanguage}
          onValueChange={handleChangeLanguage}
          style={styles.picker}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="हिन्दी" value="hi" />
          <Picker.Item label="मराठी" value="mr" />
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    backgroundColor: '#10b981',
    height: height * 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  loginText: {
    fontSize: width * 0.06,
    fontWeight: '400',
    color: '#ffffff',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1F3FD',
    borderRadius: width * 0.1,
  },
  picker: {
    color: '#0072B1',
    width: width * 0.38,
  },
});
