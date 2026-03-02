'use client';

import { useIpalStore, Device } from '@/store/useIpalStore';
import { Power, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DeviceGrid() {
    const devices = useIpalStore((s) => s.devices);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-slate-500" />
                Equipment Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {devices.map((device, idx) => (
                    <DeviceCard key={idx} device={device} />
                ))}
            </div>
        </div>
    );
}

function SettingsIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function DeviceCard({ device }: { device: Device }) {
    const Icon = device.type === 'pump' ? Power : Wind;

    return (
        <div className={cn(
            "relative p-5 rounded-xl border transition-all duration-300 overflow-hidden group",
            device.is_active
                ? "bg-green-50 border-green-200 hover:border-green-300 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                : "bg-slate-50 border-slate-200 hover:border-slate-300"
        )}>
            {/* Background Pulse Effect when active */}
            {device.is_active && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            )}

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={cn(
                    "p-2.5 rounded-lg transition-colors duration-500",
                    device.is_active ? "bg-green-500 text-white shadow-md shadow-green-500/30" : "bg-slate-200 text-slate-500"
                )}>
                    <Icon className={cn("w-5 h-5", device.is_active && "animate-pulse")} />
                </div>

                <div className={cn(
                    "px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider",
                    device.is_active ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-500"
                )}>
                    {device.is_active ? 'ON' : 'OFF'}
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-sm text-slate-500 font-medium mb-1 capitalize">{device.type}</p>
                <h4 className={cn(
                    "font-bold text-lg",
                    device.is_active ? "text-green-900" : "text-slate-700"
                )}>
                    {device.name}
                </h4>
            </div>

            {/* Decorative Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-slate-200 w-full">
                <div className={cn(
                    "h-full transition-all duration-1000 ease-in-out",
                    device.is_active ? "bg-green-500 w-full" : "w-0"
                )}></div>
            </div>
        </div>
    );
}
