'use client';

import { useEffect, useState } from 'react';
import { Droplet, Thermometer, Box, Loader2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { useIpalStore } from '@/store/useIpalStore';
import { StatusPanel } from '@/components/dashboard/StatusPanel';
import { DeviceGrid } from '@/components/dashboard/DeviceGrid';
import { HistoryChart } from '@/components/dashboard/HistoryChart';

export default function DashboardPage() {
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { sensors, setSystemStatus, setDevices, setSensors } = useIpalStore();

    // Initialize Realtime Socket Connection
    useSocket();

    useEffect(() => {
        const fetchLatestData = async () => {
            try {
                const response = await api.get('/latest');
                const data = response.data;

                if (data) {
                    if (data.system_status) setSystemStatus(data.system_status);
                    if (data.devices) setDevices(data.devices);
                    if (data.sensors) setSensors(data.sensors);
                }
            } catch (err: any) {
                console.error('Failed to fetch initial data:', err);
                setError('Failed to connect to the backend API. Showing offline/mock data.');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchLatestData();
    }, [setSystemStatus, setDevices, setSensors]);

    if (initialLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading system data...</p>
            </div>
        );
    }

    // Find sensor values
    const phSensor = sensors.find(s => s.sensor_type === 'ph');
    const volSensor = sensors.find(s => s.sensor_type === 'volume');
    const tempSensor = sensors.find(s => s.sensor_type === 'temperature');

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Top Banner / Navigation substitute if needed visually */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">System Overview</h1>
                    <p className="text-slate-500 mt-1">Realtime monitoring and control status</p>
                </div>
            </div>

            {/* Status Panel spans across layout on LG if needed */}
            <div className="grid grid-cols-1 gap-6">
                <StatusPanel />
            </div>

            <div className="grid grid-cols-1 gap-6">
                <HistoryChart />
            </div>

            <div className="grid grid-cols-1 gap-6">
                <DeviceGrid />
            </div>
        </div>
    );
}
