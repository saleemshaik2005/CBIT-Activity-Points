'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';

const ROLE_PRIMARY_DASHBOARDS: Record<UserRole, string> = {
  student: '/student',
  mentor: '/mentor',
  class_teacher: '/teacher',
  hod: '/hod',
  admin: '/admin',
};

const ROLE_ALLOWED_PREFIXES: Record<UserRole, string[]> = {
  student: ['/student', '/settings', '/notifications'],
  mentor: ['/mentor', '/settings', '/notifications'],
  class_teacher: ['/teacher', '/settings', '/notifications'],
  hod: ['/hod', '/settings', '/notifications'],
  admin: ['/admin', '/settings', '/notifications'],
};

const PROTECTED_PREFIXES = ['/student', '/mentor', '/teacher', '/hod', '/admin'];

export const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAuthenticated } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Check if the current route is one of the role-protected prefixes
    const matchingProtectedPrefix = PROTECTED_PREFIXES.find((prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

    if (matchingProtectedPrefix) {
      const allowedPrefixes = ROLE_ALLOWED_PREFIXES[currentUser.role] || [];
      const isAllowed = allowedPrefixes.some((prefix) =>
        pathname === prefix || pathname.startsWith(`${prefix}/`)
      );

      if (!isAllowed) {
        const target = ROLE_PRIMARY_DASHBOARDS[currentUser.role] || '/';
        router.replace(target);
      }
    }
  }, [pathname, currentUser.role, isAuthenticated, router]);

  return <>{children}</>;
};
