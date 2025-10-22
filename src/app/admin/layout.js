'use client';

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

function FloatingLogoutButton() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  // Não mostrar na página de login
  if (pathname === '/admin/login' || status === 'unauthenticated') {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/admin/login');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Botão Flutuante */}
      <div
        className="relative"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <button
          onClick={handleLogout}
          className="group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-vermelho to-red-700 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-vermelho/50"
          title="Sair da conta"
        >
          <svg
            className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>

        {/* Tooltip Expandido */}
        {isExpanded && (
          <div className="absolute bottom-0 left-16 mb-2 whitespace-nowrap">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl text-sm font-medium animate-fadeIn">
              <div className="flex items-center space-x-2">
                <span>Sair</span>
                {session?.user?.email && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-300 text-xs">
                      {session.user.email}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
        <FloatingLogoutButton />
      </div>
    </SessionProvider>
  );
}
