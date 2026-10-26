'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CurriculumAuthor } from '../../../components/admin/CurriculumAuthor';
import { localSession } from '../../../lib/storage/localStorage';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = localSession.getAuthUser();
    // Allow access if logged in as admin email or if no auth system is active yet (dev mode)
    if (user && user.email.toLowerCase() === 'admin@platform.com') {
      setAuthorized(true);
    } else if (!user) {
      // Not logged in at all — redirect to login
      router.replace('/auth/login');
    } else {
      // Logged in but not admin
      router.replace('/dashboard/student');
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
          <div className="text-xs text-slate-400">Checking access...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CurriculumAuthor />
    </div>
  );
}
