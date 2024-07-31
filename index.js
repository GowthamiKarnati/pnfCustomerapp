/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { AuthProvider,useAuth } from './pages/AuthContext';


const AppWithAuthProvider = () => (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  

AppRegistry.registerComponent(appName, () => AppWithAuthProvider);
