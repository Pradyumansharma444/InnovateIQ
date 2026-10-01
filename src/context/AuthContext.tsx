import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import { dbService } from '../services/db';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: User;
  allUsers: User[];
  userRoles: string[]; // Multi-roles selected during onboarding
  onboardingRequired: boolean;
  loginWithEmail: (userData: { email: string; name?: string; role?: string; roles?: string[]; institutionId?: string }) => { isNew: boolean; user: User };
  loginWithGoogle: (googleUser?: { name?: string; email?: string; photo?: string }) => void;
  completeOnboarding: (roles: string[], institutionId: string, departmentId?: string) => void;
  logout: () => void;
  canVerify: boolean;
  canManageIndicators: boolean;
  canManageUsers: boolean;
  canSubmitRecords: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => dbService.getState().users);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof localStorage !== 'undefined') {
      const savedState = localStorage.getItem('innovateiq_is_logged_in');
      if (savedState !== null) {
        return savedState === 'true';
      }
    }
    return false; // Default logged out (Guest state)
  });

  const fallbackGuestUser: User = {
    id: 'guest',
    googleId: '',
    name: 'Guest User',
    email: '',
    role: 'student',
    roles: [],
    institutionId: 'inst-1',
    onboardingCompleted: false,
    createdAt: new Date().toISOString()
  };

  const [currentUser, setCurrentUserState] = useState<User>(() => {
    const savedUserId = typeof localStorage !== 'undefined' ? localStorage.getItem('innovateiq_active_user_id') : null;
    const found = allUsers.find(u => u.id === savedUserId);
    return found || fallbackGuestUser;
  });

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('innovateiq_active_user_id', user.id);
    }
  };

  const loginWithEmail = (userData: { email: string; name?: string; role?: string; roles?: string[]; institutionId?: string }) => {
    const email = userData.email.trim().toLowerCase();
    const currentUsers = dbService.getState().users;
    let existingUser = currentUsers.find(u => u.email.toLowerCase() === email) || allUsers.find(u => u.email.toLowerCase() === email);

    let targetUser: User;
    let isNew = false;

    if (existingUser) {
      // User exists! If a role was selected, update the user role
      const chosenRole = (userData.role as any) || existingUser.role || 'student';
      const chosenRoles = userData.roles && userData.roles.length > 0 
        ? userData.roles 
        : (existingUser.roles && existingUser.roles.length > 0 ? existingUser.roles : [chosenRole]);
      
      targetUser = {
        ...existingUser,
        role: chosenRole,
        roles: chosenRoles,
        name: userData.name?.trim() || existingUser.name,
        onboardingCompleted: true,
        isPrivilegedAdmin: chosenRole === 'super_admin' || chosenRole === 'institution_admin' || Boolean(existingUser.isPrivilegedAdmin),
        isPrivilegedReviewer: chosenRole === 'reviewer' || Boolean(existingUser.isPrivilegedReviewer)
      };

      dbService.updateRecord('users' as any, existingUser.id, targetUser);
      setAllUsers(prev => prev.map(u => u.id === targetUser.id ? targetUser : u));
    } else {
      // New user creation
      isNew = true;
      const chosenRole = (userData.role as any) || 'student';
      const chosenRoles = userData.roles && userData.roles.length > 0 ? userData.roles : [chosenRole];
      const rawName = userData.name?.trim() || email.split('@')[0];
      const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

      targetUser = {
        id: `user-free-${Date.now()}`,
        name: formattedName,
        email: email,
        profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        role: chosenRole,
        roles: chosenRoles,
        institutionId: userData.institutionId || 'inst-1',
        onboardingCompleted: true,
        isPrivilegedAdmin: chosenRole === 'super_admin' || chosenRole === 'institution_admin',
        isPrivilegedReviewer: chosenRole === 'reviewer',
        createdAt: new Date().toISOString()
      };

      dbService.addRecord('users' as any, targetUser as any);
      setAllUsers(prev => [...prev, targetUser]);
    }

    setCurrentUser(targetUser);
    setIsLoggedIn(true);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('innovateiq_is_logged_in', 'true');
      localStorage.setItem('innovateiq_active_user_id', targetUser.id);
    }

    return { isNew, user: targetUser };
  };

  const loginWithGoogle = (googleUserData?: { name?: string; email?: string; photo?: string }) => {
    if (!googleUserData?.email) return;
    loginWithEmail({
      email: googleUserData.email,
      name: googleUserData.name,
      role: 'student'
    });
  };

  const completeOnboarding = (roles: string[], institutionId: string, departmentId?: string) => {
    const activeUser = currentUser || fallbackGuestUser;
    const updatedUser: User = {
      ...activeUser,
      roles: roles.length > 0 ? roles : ['student'],
      institutionId,
      departmentId,
      onboardingCompleted: true
    };

    dbService.updateRecord('users' as any, activeUser.id, updatedUser as any);
    setCurrentUser(updatedUser);
    setAllUsers(allUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUserState(fallbackGuestUser);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('innovateiq_is_logged_in', 'false');
      localStorage.removeItem('innovateiq_active_user_id');
    }
  };

  const activeUser = currentUser || fallbackGuestUser;

  // Roles array from onboarding
  const userRoles = activeUser.roles && activeUser.roles.length > 0 
    ? activeUser.roles 
    : [activeUser.role || 'student'];

  // Onboarding is required if user is logged in but has not completed onboarding
  const onboardingRequired = isLoggedIn && activeUser.onboardingCompleted === false;

  // Privileged administrative / reviewer permissions
  const canVerify = isLoggedIn && Boolean(
    activeUser.isPrivilegedAdmin || 
    activeUser.isPrivilegedReviewer || 
    activeUser.role === 'super_admin' || 
    activeUser.role === 'institution_admin'
  );
  
  const canManageIndicators = isLoggedIn && Boolean(
    activeUser.isPrivilegedAdmin || 
    activeUser.role === 'super_admin' || 
    activeUser.role === 'institution_admin'
  );

  const canManageUsers = isLoggedIn && Boolean(
    activeUser.isPrivilegedAdmin || 
    activeUser.role === 'super_admin' || 
    activeUser.role === 'institution_admin'
  );

  const canSubmitRecords = isLoggedIn;

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      currentUser,
      allUsers,
      userRoles,
      onboardingRequired,
      loginWithEmail,
      loginWithGoogle,
      completeOnboarding,
      logout,
      canVerify,
      canManageIndicators,
      canManageUsers,
      canSubmitRecords
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
