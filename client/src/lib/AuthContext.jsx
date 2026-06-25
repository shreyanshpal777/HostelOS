import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // We keep the exact same state names so your other files don't break!
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    // 1. Fake loading the app settings
    setIsLoadingPublicSettings(true);
    setAppPublicSettings({ name: "My Local App", isPublic: true });
    setIsLoadingPublicSettings(false);
    
    // 2. Immediately trigger the fake user login check
    await checkUserAuth();
  };

  const checkUserAuth = async () => {
    setIsLoadingAuth(true);

    // --- MOCK LOGIN TOGGLE ---
    // Change this to 'false' if you want to test how your UI looks to logged-out users
    const mockIsLoggedIn = true; 

    if (mockIsLoggedIn) {
      setUser({ 
        id: "mock-user-123", 
        name: "Local Admin", 
        email: "admin@localhost.com",
        role: "admin"
      });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }

    setIsLoadingAuth(false);
    setAuthChecked(true);
  };

  const logout = () => {
    console.log("Mock Logout Clicked!");
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => {
    console.log("Mock Redirect to Login!");
    // Later, you will use react-router-dom here, like: navigate('/login')
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};