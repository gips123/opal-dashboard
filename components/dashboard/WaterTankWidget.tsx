'use client';

import { cn } from '@/lib/utils';
import { useIpalStore } from '@/store/useIpalStore';
import { Box, Droplets } from 'lucide-react';

export function WaterTankWidget() {
    const sensors = useIpalStore((s) => s.sensors);
    const volSensor = sensors.find((s) => s.sensor_type === 'volume');

    // Assume a max capacity of 1000 Liters for calculation. 
    // You can adjust this to whatever your real tank capacity is.
    const MAX_CAPACITY = 1000;

    const currentVolume = Number(volSensor?.value || 0);

    // Calculate percentage (0 to 100)
    const percentage = Math.min(Math.max((currentVolume / MAX_CAPACITY) * 100, 0), 100);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center justify-center">
            <div className="w-full flex justify-between items-center mb-6">
                <div>
                    <h4 className="text-md font-bold text-slate-700 flex items-center gap-2">
                        <Box className="w-5 h-5 text-blue-500" />
                        Live Water Tank
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">Capacity: {MAX_CAPACITY} L</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-black text-blue-600 font-mono tracking-tight">
                        {currentVolume.toFixed(1)}
                    </span>
                    <span className="text-sm font-bold text-slate-400 ml-1">L</span>
                </div>
            </div>

            <div className="relative w-40 h-56 rounded-t-sm rounded-b-3xl border-4 border-slate-300 bg-slate-50 overflow-hidden shadow-inner flex flex-col justify-end">

                {/* Fill Percentage Overlay (Optional decorative lines) */}
                <div className="absolute inset-0 z-10 opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                {/* Scale Markers */}
                <div className="absolute left-0 top-0 bottom-0 w-4 border-r border-slate-200/50 z-20 flex flex-col justify-between py-2 items-center">
                    <span className="w-2 h-[1px] bg-slate-400"></span>
                    <span className="w-1.5 h-[1px] bg-slate-300"></span>
                    <span className="w-2 h-[1px] bg-slate-400"></span>
                    <span className="w-1.5 h-[1px] bg-slate-300"></span>
                    <span className="w-2 h-[1px] bg-slate-400"></span>
                </div>

                {/* The Animated Water Fill */}
                <div
                    className="relative w-full bg-gradient-to-t from-blue-600 via-blue-500 to-cyan-400 transition-all duration-1000 ease-in-out flex items-start justify-center overflow-hidden group"
                    style={{ height: `${percentage}%` }}
                >
                    {/* Waves Effect at the top of the water */}
                    <div className="absolute top-0 inset-x-0 h-4 w-[200%] bg-blue-300/30 animate-wave -ml-[50%] skew-x-12"></div>

                    {/* Bubbles */}
                    <Droplets className="absolute bottom-4 text-white/20 w-8 h-8 animate-bounce opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between w-full text-sm font-medium">
                <span className="text-slate-400">Empty</span>
                <span className={cn(
                    percentage > 80 ? "text-red-500" : "text-emerald-500"
                )}>
                    {percentage.toFixed(0)}% Filled
                </span>
                <span className="text-slate-400">Full</span>
            </div>
        </div>
    );
}
