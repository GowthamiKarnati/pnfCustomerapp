import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const LanguageToggle = ({ toggleLanguage }) => {
  return (
    <Text>
      <TouchableOpacity onPress={toggleLanguage}>Toggle Language</TouchableOpacity>
    </Text>
  );
};

export default LanguageToggle;