import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADMIN_USER, DEMO_USER, MOCK_TRANSACTIONS } from '../data/mockData';
import { makeReferralCode } from '../utils/format';

const KEYS = {
  users: 'vtu_users',
  session: 'vtu_user_session',
  lastEmail: 'vtu_last_user_email',
  transactions: 'vtu_transactions',
};

const AuthContext = createContext(null);

async function readJson(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function toSession(foundUser) {
  return {
    name: foundUser.name,
    email: foundUser.email,
    phone: foundUser.phone,
    role: foundUser.role || (foundUser.email === 'admin@primedata.com' ? 'admin' : 'user'),
    twoFactorEnabled: foundUser.twoFactorEnabled || false,
    referralCode: foundUser.referralCode,
    referralsCount: foundUser.referralsCount || 0,
    referralsEarned: foundUser.referralsEarned || 0,
    transferPin: foundUser.transferPin || '1234',
    biometricEnabled: foundUser.biometricEnabled || false,
    biometricType: foundUser.biometricType || 'fingerprint',
    walletBalance: foundUser.walletBalance || 0,
    commission: foundUser.commission || 0,
  };
}

function mergeTransactions(stored = []) {
  const map = new Map();
  [...stored, ...MOCK_TRANSACTIONS].forEach((tx) => {
    if (!map.has(tx.id)) map.set(tx.id, tx);
  });
  return Array.from(map.values());
}

async function ensureSeedData() {
  const users = await readJson(KEYS.users, null);
  if (!Array.isArray(users) || users.length === 0) {
    await AsyncStorage.setItem(KEYS.users, JSON.stringify([DEMO_USER, ADMIN_USER]));
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      await ensureSeedData();
      const [session, storedTransactions] = await Promise.all([
        readJson(KEYS.session, null),
        readJson(KEYS.transactions, []),
      ]);

      if (!active) return;
      if (session) setUser(session);
      setTransactions(mergeTransactions(Array.isArray(storedTransactions) ? storedTransactions : []));
      setLoading(false);
    })().catch(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const users = await readJson(KEYS.users, []);
    const normalized = normalizeEmail(email);
    const index = users.findIndex((candidate) => normalizeEmail(candidate.email) === normalized);

    if (index === -1 || users[index].password !== password) {
      return { success: false, message: 'Invalid email or password' };
    }

    const foundUser = { ...users[index] };
    let changed = false;

    if (!foundUser.referralCode) {
      foundUser.referralCode = makeReferralCode();
      changed = true;
    }
    if (!foundUser.transferPin) {
      foundUser.transferPin = '1234';
      changed = true;
    }
    if (foundUser.walletBalance === undefined) {
      foundUser.walletBalance = 0;
      changed = true;
    }
    if (foundUser.commission === undefined) {
      foundUser.commission = 0;
      changed = true;
    }
    if (!foundUser.role) {
      foundUser.role = normalizeEmail(foundUser.email) === 'admin@primedata.com' ? 'admin' : 'user';
      changed = true;
    }
    if (changed) {
      users[index] = foundUser;
      await AsyncStorage.setItem(KEYS.users, JSON.stringify(users));
    }

    const sessionUser = toSession(foundUser);
    setUser(sessionUser);
    await Promise.all([
      AsyncStorage.setItem(KEYS.session, JSON.stringify(sessionUser)),
      AsyncStorage.setItem(KEYS.lastEmail, foundUser.email),
    ]);

    return { success: true };
  }, []);

  const loginWithBiometric = useCallback(async () => {
    const [lastEmail, users] = await Promise.all([
      AsyncStorage.getItem(KEYS.lastEmail),
      readJson(KEYS.users, []),
    ]);

    let foundUser = users.find(
      (candidate) => normalizeEmail(candidate.email) === normalizeEmail(lastEmail)
    );
    if (!foundUser) {
      foundUser = users.find(
        (candidate) => normalizeEmail(candidate.email) === normalizeEmail(DEMO_USER.email)
      );
    }
    if (!foundUser && users.length > 0) foundUser = users[users.length - 1];

    if (!foundUser) {
      return { success: false, message: 'Please register an account first to use biometric login' };
    }

    const sessionUser = { ...toSession(foundUser), biometricEnabled: true };
    setUser(sessionUser);
    await Promise.all([
      AsyncStorage.setItem(KEYS.session, JSON.stringify(sessionUser)),
      AsyncStorage.setItem(KEYS.lastEmail, foundUser.email),
    ]);
    return { success: true, user: sessionUser };
  }, []);

  const signup = useCallback(async (userData) => {
    const users = await readJson(KEYS.users, []);
    const normalized = normalizeEmail(userData.email);

    if (users.some((candidate) => normalizeEmail(candidate.email) === normalized)) {
      return { success: false, message: 'An account with this email already exists' };
    }

    let referrerIndex = -1;
    if (userData.invitedByRef) {
      referrerIndex = users.findIndex(
        (candidate) =>
          String(candidate.referralCode || '').toUpperCase() ===
          String(userData.invitedByRef).trim().toUpperCase()
      );
    }

    if (referrerIndex !== -1) {
      users[referrerIndex] = {
        ...users[referrerIndex],
        referralsCount: (users[referrerIndex].referralsCount || 0) + 1,
        referralsEarned: (users[referrerIndex].referralsEarned || 0) + 500,
      };
    }

    const newUser = {
      name: userData.name.trim(),
      email: normalized,
      phone: userData.phone.trim(),
      password: userData.password,
      role: normalized === 'admin@primedata.com' ? 'admin' : 'user',
      twoFactorEnabled: false,
      referralCode: makeReferralCode(),
      referralsCount: 0,
      referralsEarned: 0,
      transferPin: userData.transferPin || '1234',
      biometricEnabled: false,
      biometricType: 'fingerprint',
      walletBalance: 0,
      commission: 0,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await AsyncStorage.setItem(KEYS.users, JSON.stringify(users));
    return { success: true };
  }, []);

  const updateUser = useCallback(
    async (updatedData) => {
      if (!user) return { success: false, message: 'You are not signed in' };

      const users = await readJson(KEYS.users, []);
      const index = users.findIndex(
        (candidate) => normalizeEmail(candidate.email) === normalizeEmail(user.email)
      );
      if (index === -1) return { success: false, message: 'User not found' };

      if (
        updatedData.email &&
        normalizeEmail(updatedData.email) !== normalizeEmail(user.email) &&
        users.some(
          (candidate) => normalizeEmail(candidate.email) === normalizeEmail(updatedData.email)
        )
      ) {
        return { success: false, message: 'That email is already in use' };
      }

      const nextRecord = {
        ...users[index],
        ...updatedData,
        email: updatedData.email ? normalizeEmail(updatedData.email) : users[index].email,
      };
      users[index] = nextRecord;
      await AsyncStorage.setItem(KEYS.users, JSON.stringify(users));

      const sessionUser = { ...user, ...nextRecord };
      delete sessionUser.password;
      setUser(sessionUser);
      await AsyncStorage.setItem(KEYS.session, JSON.stringify(sessionUser));
      return { success: true, message: 'Profile updated successfully' };
    },
    [user]
  );

  const updateSecurity = useCallback(
    async (currentPassword, newPassword, enable2FA, biometricEnabled, biometricType) => {
      if (!user) return { success: false, message: 'You are not signed in' };

      const users = await readJson(KEYS.users, []);
      const index = users.findIndex(
        (candidate) => normalizeEmail(candidate.email) === normalizeEmail(user.email)
      );
      if (index === -1) return { success: false, message: 'User not found' };

      if (currentPassword || newPassword) {
        if (!currentPassword || !newPassword) {
          return { success: false, message: 'Enter both your current and new password' };
        }
        if (users[index].password !== currentPassword) {
          return { success: false, message: 'Incorrect current password' };
        }
        if (newPassword.length < 6) {
          return { success: false, message: 'New password must be at least 6 characters' };
        }
        users[index].password = newPassword;
      }

      const sessionUser = { ...user };

      if (enable2FA !== undefined) {
        users[index].twoFactorEnabled = enable2FA;
        sessionUser.twoFactorEnabled = enable2FA;
      }

      if (biometricEnabled !== undefined) {
        users[index].biometricEnabled = biometricEnabled;
        sessionUser.biometricEnabled = biometricEnabled;
        if (biometricType) {
          users[index].biometricType = biometricType;
          sessionUser.biometricType = biometricType;
        }
      }

      await AsyncStorage.setItem(KEYS.users, JSON.stringify(users));
      setUser(sessionUser);
      await AsyncStorage.setItem(KEYS.session, JSON.stringify(sessionUser));
      return { success: true, message: 'Security settings updated' };
    },
    [user]
  );

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(KEYS.session);
  }, []);

  const addTransaction = useCallback(async (tx) => {
    const stored = await readJson(KEYS.transactions, []);
    const next = [tx, ...(Array.isArray(stored) ? stored : [])].slice(0, 200);
    await AsyncStorage.setItem(KEYS.transactions, JSON.stringify(next));
    setTransactions(mergeTransactions(next));
  }, []);

  const refreshTransactions = useCallback(async () => {
    const stored = await readJson(KEYS.transactions, []);
    setTransactions(mergeTransactions(Array.isArray(stored) ? stored : []));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      transactions,
      login,
      loginWithBiometric,
      signup,
      logout,
      updateUser,
      updateSecurity,
      addTransaction,
      refreshTransactions,
      isAdmin: user?.role === 'admin',
    }),
    [
      user,
      loading,
      transactions,
      login,
      loginWithBiometric,
      signup,
      logout,
      updateUser,
      updateSecurity,
      addTransaction,
      refreshTransactions,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
