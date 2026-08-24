'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  StudentSubmission,
  ActivityCategory,
  SystemSettings,
  UserRole,
  AIExtractionResult,
  ThemeMode,
  NotificationItem,
} from '@/types';
import {
  CBIT_24_CATEGORIES,
  MOCK_CURRENT_USER,
  MOCK_SUBMISSIONS,
  DEFAULT_REGULAR_TARGET_POINTS,
  DEFAULT_REGULAR_MAX_POINTS,
  DEFAULT_LATERAL_ENTRY_TARGET_POINTS,
  DEFAULT_LATERAL_ENTRY_MAX_POINTS,
  CBIT_COLLEGE_NAME,
  CBIT_COLLEGE_CODE,
} from '@/lib/mar-constants';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  submissions: StudentSubmission[];
  categories: ActivityCategory[];
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  updateCategory: (category: ActivityCategory) => void;
  addSubmission: (submission: Omit<StudentSubmission, 'id' | 'created_at' | 'status' | 'awarded_points'> & { status?: any }) => void;
  updateSubmissionStatus: (id: string, status: 'approved' | 'rejected', remarks?: string, awardedPoints?: number) => void;
  deleteSubmission: (id: string) => void;
  resetToDefaults: () => void;

  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;

  // Auth
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  register: (userData: Partial<UserProfile>) => Promise<boolean>;
  logout: () => void;

  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'created_at' | 'is_read'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  student: MOCK_CURRENT_USER,
  mentor: {
    id: "usr-mentor-001",
    email: "mentor.aids@cbit.ac.in",
    full_name: "Faculty Mentor",
    role: "mentor",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    batch_year: "Faculty Counselor",
    is_lateral_entry: false,
  },
  class_teacher: {
    id: "usr-teacher-001",
    email: "coordinator.aids@cbit.ac.in",
    full_name: "Class Coordinator",
    role: "class_teacher",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    section: "2",
    batch_year: "Class Coordinator",
    is_lateral_entry: false,
  },
  hod: {
    id: "usr-hod-001",
    email: "hod.aids@cbit.ac.in",
    full_name: "Head of Department",
    role: "hod",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    batch_year: "Head of Department",
    is_lateral_entry: false,
  },
  admin: {
    id: "usr-admin-001",
    email: "admin.mar@cbit.ac.in",
    full_name: "System Administrator",
    role: "admin",
    department: "Academic Section",
    batch_year: "Administration",
    is_lateral_entry: false,
  },
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    recipient_role: "student",
    recipient_id: "usr-student-001",
    type: "approval",
    title: "Certificate Approved (+20 Points)",
    message: "Faculty Mentor approved your NPTEL Deep Learning 12-Week Certificate.",
    link: "/student/history",
    is_read: false,
    sender_name: "Faculty Mentor",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "notif-2",
    recipient_role: "student",
    recipient_id: "usr-student-001",
    type: "approval",
    title: "Certificate Approved (+5 Points)",
    message: "Your SUDHEE 2024 Fest Core AI Team Lead submission was verified.",
    link: "/student/history",
    is_read: false,
    sender_name: "Faculty Mentor",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "notif-3",
    recipient_role: "mentor",
    recipient_id: "usr-mentor-001",
    type: "submission",
    title: "New Certificate Under Review",
    message: "Shaik Saleem submitted a new certificate for Tech Fest / Hackathon.",
    link: "/mentor",
    is_read: false,
    sender_name: "Shaik Saleem",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "notif-4",
    recipient_role: "all",
    type: "announcement",
    title: "Semester 5 Activity Points Deadline",
    message: "All B.Tech students are advised to submit certificate proofs before the end of Sem 5.",
    link: "/student/guidelines",
    is_read: true,
    sender_name: "Academic Section Admin",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_CURRENT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(MOCK_SUBMISSIONS);
  const [categories, setCategories] = useState<ActivityCategory[]>(CBIT_24_CATEGORIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<SystemSettings>({
    id: 1,
    college_name: CBIT_COLLEGE_NAME,
    college_code: CBIT_COLLEGE_CODE,
    regular_target_points: DEFAULT_REGULAR_TARGET_POINTS,
    regular_max_points: DEFAULT_REGULAR_MAX_POINTS,
    lateral_entry_target_points: DEFAULT_LATERAL_ENTRY_TARGET_POINTS,
    lateral_entry_max_points: DEFAULT_LATERAL_ENTRY_MAX_POINTS,
    academic_year: "2025-2026",
  });

  // Load persisted state from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('cbit_theme') as ThemeMode;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      const savedAuth = localStorage.getItem('cbit_is_auth');
      if (savedAuth !== null) {
        setIsAuthenticated(savedAuth === 'true');
      }

      const savedSubmissions = localStorage.getItem('cbit_mar_submissions');
      if (savedSubmissions) setSubmissions(JSON.parse(savedSubmissions));

      const savedCategories = localStorage.getItem('cbit_mar_categories');
      if (savedCategories) setCategories(JSON.parse(savedCategories));

      const savedSettings = localStorage.getItem('cbit_mar_settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedNotifs = localStorage.getItem('cbit_notifications');
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedRole = localStorage.getItem('cbit_mar_active_role') as UserRole;
      if (savedRole && DEMO_USERS[savedRole]) {
        setCurrentUser(DEMO_USERS[savedRole]);
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: ThemeMode = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('cbit_theme', next);
        if (next === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {}
      return next;
    });
  };

  const login = async (email: string, role?: UserRole): Promise<boolean> => {
    let targetUser: UserProfile = MOCK_CURRENT_USER;
    if (role && DEMO_USERS[role]) {
      targetUser = DEMO_USERS[role];
    } else {
      const match = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (match) targetUser = match;
    }

    setCurrentUser(targetUser);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('cbit_is_auth', 'true');
      localStorage.setItem('cbit_mar_active_role', targetUser.role);
    } catch (e) {}
    return true;
  };

  const register = async (userData: Partial<UserProfile>): Promise<boolean> => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: userData.email || 'student@cbit.ac.in',
      full_name: userData.full_name || 'CBIT Student',
      role: userData.role || 'student',
      roll_number: userData.roll_number || '160122771099',
      department: userData.department || 'Artificial Intelligence and Data Science (AI&DS)',
      section: userData.section || '2',
      batch_year: userData.batch_year || '2024-2028',
      is_lateral_entry: !!userData.is_lateral_entry,
      mentor_name: 'Faculty Mentor',
      mentor_id: 'usr-mentor-001',
    };

    setCurrentUser(newUser);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('cbit_is_auth', 'true');
      localStorage.setItem('cbit_mar_active_role', newUser.role);
    } catch (e) {}
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem('cbit_is_auth', 'false');
    } catch (e) {}
  };

  // Sync to localStorage
  const saveSubmissions = (newSubmissions: StudentSubmission[]) => {
    setSubmissions(newSubmissions);
    try {
      localStorage.setItem('cbit_mar_submissions', JSON.stringify(newSubmissions));
    } catch (e) {}
  };

  const saveNotifications = (newNotifs: NotificationItem[]) => {
    setNotifications(newNotifs);
    try {
      localStorage.setItem('cbit_notifications', JSON.stringify(newNotifs));
    } catch (e) {}
  };

  const switchRole = (role: UserRole) => {
    const targetUser = DEMO_USERS[role] || MOCK_CURRENT_USER;
    setCurrentUser(targetUser);
    try {
      localStorage.setItem('cbit_mar_active_role', role);
    } catch (e) {}
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('cbit_mar_settings', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updateCategory = (updatedCat: ActivityCategory) => {
    setCategories((prev) => {
      const next = prev.map((c) => (c.id === updatedCat.id ? updatedCat : c));
      try {
        localStorage.setItem('cbit_mar_categories', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'created_at' | 'is_read'>) => {
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    saveNotifications([newItem, ...notifications]);
  };

  const markNotificationAsRead = (id: string) => {
    const next = notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n));
    saveNotifications(next);
  };

  const markAllNotificationsAsRead = () => {
    const next = notifications.map((n) => ({ ...n, is_read: true }));
    saveNotifications(next);
  };

  const addSubmission = (newSub: Omit<StudentSubmission, 'id' | 'created_at' | 'status' | 'awarded_points'> & { status?: any }) => {
    const fullSubmission: StudentSubmission = {
      ...newSub,
      id: `sub-${Date.now()}`,
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      student_roll_no: currentUser.roll_number || '160122771045',
      awarded_points: newSub.status === 'approved' ? newSub.claimed_points : 0,
      status: newSub.status || 'pending_mentor',
      created_at: new Date().toISOString(),
    };
    const nextList = [fullSubmission, ...submissions];
    saveSubmissions(nextList);

    // Notify Mentor
    addNotification({
      recipient_role: 'mentor',
      type: 'submission',
      title: 'New Certificate Submitted',
      message: `${currentUser.full_name} submitted "${newSub.activity_title}" (${newSub.claimed_points} claimed pts).`,
      link: '/mentor',
      sender_name: currentUser.full_name,
    });
  };

  const updateSubmissionStatus = (
    id: string,
    status: 'approved' | 'rejected',
    remarks?: string,
    awardedPoints?: number
  ) => {
    let targetSub: StudentSubmission | undefined;
    const nextList = submissions.map((sub) => {
      if (sub.id === id) {
        targetSub = {
          ...sub,
          status,
          mentor_remarks: remarks || sub.mentor_remarks,
          awarded_points: status === 'approved' ? (awardedPoints ?? sub.claimed_points) : 0,
          approved_by: currentUser.id,
          approver_name: currentUser.full_name,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return targetSub;
      }
      return sub;
    });
    saveSubmissions(nextList);

    // Notify Student
    if (targetSub) {
      addNotification({
        recipient_id: targetSub.student_id,
        recipient_role: 'student',
        type: status === 'approved' ? 'approval' : 'rejection',
        title: status === 'approved' ? `Certificate Approved (+${targetSub.awarded_points} Pts)` : `Certificate Rejected`,
        message: status === 'approved'
          ? `Your submission "${targetSub.activity_title}" was approved by ${currentUser.full_name}.`
          : `Your submission "${targetSub.activity_title}" was rejected: ${remarks || 'Please re-verify proof.'}`,
        link: '/student/history',
        sender_name: currentUser.full_name,
      });
    }
  };

  const deleteSubmission = (id: string) => {
    const nextList = submissions.filter((s) => s.id !== id);
    saveSubmissions(nextList);
  };

  const resetToDefaults = () => {
    setSubmissions(MOCK_SUBMISSIONS);
    setCategories(CBIT_24_CATEGORIES);
    setSettings({
      id: 1,
      college_name: CBIT_COLLEGE_NAME,
      college_code: CBIT_COLLEGE_CODE,
      regular_target_points: DEFAULT_REGULAR_TARGET_POINTS,
      regular_max_points: DEFAULT_REGULAR_MAX_POINTS,
      lateral_entry_target_points: DEFAULT_LATERAL_ENTRY_TARGET_POINTS,
      lateral_entry_max_points: DEFAULT_LATERAL_ENTRY_MAX_POINTS,
      academic_year: "2025-2026",
    });
    localStorage.removeItem('cbit_mar_submissions');
    localStorage.removeItem('cbit_mar_categories');
    localStorage.removeItem('cbit_mar_settings');
  };

  // Filter unread notifications relevant to current user
  const relevantNotifications = notifications.filter((n) => {
    if (n.recipient_role === 'all') return true;
    if (n.recipient_role === currentUser.role) return true;
    if (n.recipient_id === currentUser.id) return true;
    return false;
  });

  const unreadCount = relevantNotifications.filter((n) => !n.is_read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        submissions,
        categories,
        settings,
        updateSettings,
        updateCategory,
        addSubmission,
        updateSubmissionStatus,
        deleteSubmission,
        resetToDefaults,

        // Theme
        theme,
        toggleTheme,

        // Auth
        isAuthenticated,
        login,
        register,
        logout,

        // Notifications
        notifications: relevantNotifications,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
