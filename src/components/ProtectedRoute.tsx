import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactElement;
  role: 'admin' | 'student' | 'jury' | 'registration' | 'beginner';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const userRole = sessionStorage.getItem('classroom_role');
    const hasAccess = sessionStorage.getItem('classroom_access') === 'granted';

    if (hasAccess && userRole === role) {
      setIsAuthorized(true);
    } else {
      router.replace(`/login?from=${pathname}`);
    }
  }, [role, router, pathname]);

  if (!isAuthorized) {
    return null; // Or a loading spinner
  }

  return children;
};

export default ProtectedRoute;
