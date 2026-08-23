'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  StudentSubmission,
  ActivityCategory,
  SystemSettings,
  UserRole,
  AIExtractionResult,
} from '@/types';
import {
  CBIT_24_CATEGORIES,
  MOCK_CURRENT_USER,
  MOCK_SUBMISSIONS,
  DEFAULT_REGULAR_TARGET_POINTS,
  DEFAULT_LATERAL_ENTRY_TARGET_POINTS,
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, UserProfile> = {
  student: MOCK_CURRENT_USER,
  mentor: {
    id: "usr-mentor-001",
    email: "dramana.aids@cbit.ac.in",
    full_name: "Dr. D. Ramana",
    role: "mentor",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    batch_year: "Faculty / Project Guide",
    is_lateral_entry: false,
  },
  class_teacher: {
    id: "usr-teacher-001",
    email: "teacher.aids@cbit.ac.in",
    full_name: "Faculty Coordinator (AI&DS)",
    role: "class_teacher",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    section: "2",
    batch_year: "Faculty / Class Coordinator",
    is_lateral_entry: false,
  },
  hod: {
    id: "usr-hod-001",
    email: "kradhika.aids@cbit.ac.in",
    full_name: "Dr. K. Radhika (HoD AI&DS)",
    role: "hod",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    batch_year: "Head of Department",
    is_lateral_entry: false,
  },
  admin: {
    id: "usr-admin-001",
    email: "admin.mar@cbit.ac.in",
    full_name: "CBIT MAR Administrator",
    role: "admin",
    department: "Academic Section",
    batch_year: "Administration",
    is_lateral_entry: false,
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_CURRENT_USER);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(MOCK_SUBMISSIONS);
  const [categories, setCategories] = useState<ActivityCategory[]>(CBIT_24_CATEGORIES);
  const [settings, setSettings] = useState<SystemSettings>({
    id: 1,
    college_name: CBIT_COLLEGE_NAME,
    college_code: CBIT_COLLEGE_CODE,
    regular_target_points: DEFAULT_REGULAR_TARGET_POINTS,
    lateral_entry_target_points: DEFAULT_LATERAL_ENTRY_TARGET_POINTS,
    academic_year: "2025-2026",
  });

  // Load persisted state from localStorage if available in browser
  useEffect(() => {
    try {
      const savedSubmissions = localStorage.getItem('cbit_mar_submissions');
      if (savedSubmissions) setSubmissions(JSON.parse(savedSubmissions));

      const savedCategories = localStorage.getItem('cbit_mar_categories');
      if (savedCategories) setCategories(JSON.parse(savedCategories));

      const savedSettings = localStorage.getItem('cbit_mar_settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedRole = localStorage.getItem('cbit_mar_active_role') as UserRole;
      if (savedRole && DEMO_USERS[savedRole]) {
        setCurrentUser(DEMO_USERS[savedRole]);
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
  }, []);

  // Sync to localStorage
  const saveSubmissions = (newSubmissions: StudentSubmission[]) => {
    setSubmissions(newSubmissions);
    try {
      localStorage.setItem('cbit_mar_submissions', JSON.stringify(newSubmissions));
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

  const addSubmission = (newSub: Omit<StudentSubmission, 'id' | 'created_at' | 'status' | 'awarded_points'> & { status?: any }) => {
    const fullSubmission: StudentSubmission = {
      ...newSub,
      id: `sub-${Date.now()}`,
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      student_roll_no: currentUser.roll_number || '160122733045',
      awarded_points: newSub.status === 'approved' ? newSub.claimed_points : 0,
      status: newSub.status || 'pending_mentor',
      created_at: new Date().toISOString(),
    };
    const nextList = [fullSubmission, ...submissions];
    saveSubmissions(nextList);
  };

  const updateSubmissionStatus = (
    id: string,
    status: 'approved' | 'rejected',
    remarks?: string,
    awardedPoints?: number
  ) => {
    const nextList = submissions.map((sub) => {
      if (sub.id === id) {
        return {
          ...sub,
          status,
          mentor_remarks: remarks || sub.mentor_remarks,
          awarded_points: status === 'approved' ? (awardedPoints ?? sub.claimed_points) : 0,
          approved_by: currentUser.id,
          approver_name: currentUser.full_name,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      return sub;
    });
    saveSubmissions(nextList);
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
      lateral_entry_target_points: DEFAULT_LATERAL_ENTRY_TARGET_POINTS,
      academic_year: "2025-2026",
    });
    localStorage.removeItem('cbit_mar_submissions');
    localStorage.removeItem('cbit_mar_categories');
    localStorage.removeItem('cbit_mar_settings');
  };

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
