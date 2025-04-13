import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Components/AppContext/AuthContext';
import { AppProvider } from './Components/AppContext/AppContext';
import ProtectedRoute from './Components/Pages/ProtectedRoute';
import ProfileSetup from './Components/Pages/ProfileSetup';
import Login from './Components/Pages/Login';
import SignUp from './Components/Pages/SignUp';
import Home from './Components/Pages/Home';
import Profile from './Components/Pages/Profile';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <AppProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
