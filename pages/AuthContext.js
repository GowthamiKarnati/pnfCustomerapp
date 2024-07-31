import { createContext, useContext, useReducer, useEffect,useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  loginForm:{
    mobileNumber:"",
  },
  token: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true,token: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    case 'RESET_LOGIN_DATA':
      return { ...state, loginForm: { mobileNumber: '' } };
    case 'SET_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [loggedOut, setLoggedOut] = useState(false);

  const handleLogout = async(mobileNumber) => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('authState');
    firestore().collection('customer').doc(mobileNumber).delete()
    .then(() => {
      console.log('Token removed for mobile number: ', mobileNumber);
    })
    .catch(error => {
      console.error('Error removing token: ', error);
    });
    await AsyncStorage.removeItem('mobileNumber');
    dispatch({ type: "LOGOUT" });
  };

  const resetLoginData = () => {
    dispatch({ type: 'RESET_LOGIN_DATA' });
  };

  
  
  useEffect(() => {
    // Check for token in AsyncStorage on component mount
    const checkForToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedMobileNumber = await AsyncStorage.getItem('mobileNumber');
        const storedAuthState = await AsyncStorage.getItem('authState');
    
        if (storedToken && storedAuthState) {
          const parsedAuthState = JSON.parse(storedAuthState);
          // console.log(parsedAuthState);
          // Check if the mobileNumber is present in the parsedAuthState
        const { loginForm: { mobileNumber } } = parsedAuthState;
        console.log('Mobile Number from Auth State:', mobileNumber);
          dispatch({ type: 'SET_STATE', payload: parsedAuthState });
          handleLogin(storedToken, storedMobileNumber);
          // dispatch({ type: 'LOGIN', payload: storedToken });
        }
      } catch (error) {
          const storedMobileNumber = await AsyncStorage.getItem('mobileNumber');
          dispatch({
            type: 'SET_STATE',
            payload: {
              loginForm: {
                mobileNumber: storedMobileNumber || '', // Ensure it defaults to an empty string if not found
              },
            },
          });
      }
    };
  
    checkForToken();
  }, [state.isAuthenticated]);
  const handleLogin = async (token, mobileNumber) => {
    if (token) {
      const storedAuthState = await AsyncStorage.getItem('authState');
      let fullData = {};
      if (storedAuthState) {
        const parsedAuthState = JSON.parse(storedAuthState);
        fullData = { ...parsedAuthState };
      }
      dispatch({ type: 'LOGIN', payload: token });
      dispatch({ type: 'SET_STATE', payload: { loginForm: { mobileNumber } } });
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('mobileNumber', mobileNumber);

      dispatch((currentState) => {
        AsyncStorage.setItem('authState', JSON.stringify(currentState));
      });
    } else {
      
      console.error('No token provided during login');
    }
  };
  useEffect(() => {
    const checkAsyncStorage = async () => {
      const storedMobileNumber = await AsyncStorage.getItem('mobileNumber');
      // console.log('Stored Mobile Number:', storedMobileNumber);
    };
    
    checkAsyncStorage();
  }, []);
  
  useEffect(() => {
    // Save authentication state to AsyncStorage whenever it changes
    const saveAuthState = async () => {
      try {
        // console.log('Saving authentication state:', state);
        const { isAuthenticated, token, loginForm } = state;
        const storedMobileNumber =(await AsyncStorage.getItem('mobileNumber')) ?? '';
        const authState = {
          isAuthenticated,
          token,
          loginForm: {
            mobileNumber: storedMobileNumber, // Include the mobile number in the saved state
          },
        };
        // console.log("Auth state",authState);
        await AsyncStorage.setItem('authState', JSON.stringify(authState));
      } catch (error) {
        console.error('Error saving authentication state:', error);
      }
    };

    saveAuthState();
  }, [state]);


  return (
    <AuthContext.Provider value={{ state, dispatch,handleLogout,resetLoginData,handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
