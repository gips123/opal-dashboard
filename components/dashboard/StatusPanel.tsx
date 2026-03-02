'use client';

import { Activity, Power, Settings2 } from 'lucide-react';
import { useIpalStore } from '@/store/useIpalStore';
import { cn } from '@/lib/utils';

export function StatusPanel() {
    const { mode, state, updated_at } = useIpalStore((s) => s.system_status);

    return (
        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>

            <div className="flex justify-between items-start relative z-10 mb-8">
                <div>
                    <h2 className="text-xl font-bold tracking-tight mb-1 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        System Status
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Last updated: {updated_at ? new Date(updated_at).toLocaleTimeString() : 'Waiting...'}
                    </p>
                </div>

                <div className="flex gap-2">
                    {updated_at ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                            Live
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/30">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
                            Connecting...
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-white/10 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                        <Settings2 className="w-4 h-4" />
                        Operation Mode
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={cn(
                            "text-2xl font-bold capitalize",
                            mode === 'auto' ? "text-cyan-400" : "text-orange-400"
                        )}>
                            {mode}
                        </span>
                    </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                        <Power className="w-4 h-4" />
                        Process State
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={cn(
                            "text-2xl font-bold capitalize",
                            state === 'fill' ? "text-blue-400" :
                                state === 'drain' ? "text-amber-400" :
                                    "text-slate-300"
                        )}>
                            {state}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
