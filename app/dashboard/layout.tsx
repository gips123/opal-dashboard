'use client';

import { ReactNode } from 'react';
import { Activity, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    // In Next.js client component, we use router for logout
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20 hidden md:flex">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="">
                        <Image src="/josindo.png" alt="Logo" width={50} height={40} />
                    </div>
                    <div className='flex flex-col'>
                        <span className="text-xl font-bold tracking-tight">PT Josindo</span>
                        <span className="text-[10px] font-medium tracking-tight">Monitoring System Dashboard</span>         
                    </div>
                    
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-600/20 text-blue-400 rounded-xl transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Overview</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden bg-slate-900 text-white p-4 flex items-center shadow-md z-20 justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                        <Image src="/josindo.png" alt="Logo" width={50} height={40} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold">PT Josindo</span>
                            <span className="text-[10px] font-medium tracking-tight">Monitoring System Dashboard</span>         
                        </div>
                    </div>       
                    <div>
                        <LogoutButton mobile />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
                    {children}
                </div>
            </main>
        </div>
    );
}

function LogoutButton({ mobile }: { mobile?: boolean }) {
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('token');
        router.push('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full transition-colors ${mobile
                ? 'text-slate-300 hover:text-white'
                : 'px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl'
                }`}
        >
            <LogOut className="w-5 h-5" />
            {!mobile && <span className="font-medium">Sign Out</span>}
        </button>
    );
}
