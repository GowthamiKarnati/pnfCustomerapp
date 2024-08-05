import React from 'react'
import Toast from 'react-native-toast-message';

function ShowToast(type, text1, text2) {
  return (
    Toast.show({
      type,
      position: 'bottom',
      text1,
      text2,
      visibilityTime: 10000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    })
  )
}

export default ShowToast