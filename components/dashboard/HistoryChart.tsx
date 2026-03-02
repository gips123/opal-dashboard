'use client';

import { useEffect, useState, useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Loader2, TrendingUp, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import api from '@/lib/api';
import { WaterTankWidget } from './WaterTankWidget';
import { useIpalStore } from '@/store/useIpalStore';

interface HistoryRecord {
    sensor_type: string;
    value: string;
    recorded_at: string;
}

export function HistoryChart() {
    const [data, setData] = useState<HistoryRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const liveSensors = useIpalStore((s) => s.sensors);
    const updatedAt = useIpalStore((s) => s.system_status.updated_at);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/history');
                if (Array.isArray(response.data)) {
                    console.log('RAW HISTORY DATA:', response.data.slice(0, 3));
                    setData(response.data);
                } else {
                    console.log('HISTORY RESPONSE IS NOT ARRAY:', response.data);
                }
            } catch (err: any) {
                console.error('Failed to fetch history:', err);
                setError('Failed to load historical charts. Backend might be unreachable.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Listen to real-time updates and append to the chart data history 
    useEffect(() => {
        if (updatedAt && liveSensors.length > 0 && !loading) {
            const newRecords = liveSensors.map(s => ({
                sensor_type: s.sensor_type,
                value: String(s.value),
                recorded_at: updatedAt
            }));

            setData(prev => {
                // Prevent duplicate exact timestamp entries on fast renders
                const isDuplicate = prev.some(r => r.recorded_at === updatedAt);
                if (isDuplicate) return prev;

                // Append new data and optionally slice to keep array size manageable (e.g. max 5000 records)
                const updatedData = [...prev, ...newRecords];
                if (updatedData.length > 3000) {
                    return updatedData.slice(updatedData.length - 3000);
                }
                return updatedData;
            });
        }
    }, [updatedAt, liveSensors, loading]);

    // Transform raw data array into time-series buckets
    const chartData = useMemo(() => {
        if (!data.length) return [];

        // Group by recorded_at timestamp (ignoring seconds roughly if needed, but assuming exact times or rounding)
        const grouped = data.reduce((acc: any, curr) => {
            const timeLabel = format(parseISO(curr.recorded_at), 'HH:mm'); // e.g. "14:30"
            if (!acc[timeLabel]) {
                acc[timeLabel] = { time: timeLabel, fullTime: curr.recorded_at };
            }

            const val = parseFloat(curr.value);
            if (curr.sensor_type === 'ph') acc[timeLabel].ph = val;
            if (curr.sensor_type === 'volume') acc[timeLabel].volume = val;
            if (curr.sensor_type === 'temperature') acc[timeLabel].temperature = val;

            return acc;
        }, {});

        // Convert grouped object back to sorted array
        const result = Object.values(grouped).sort((a: any, b: any) =>
            new Date(a.fullTime).getTime() - new Date(b.fullTime).getTime()
        );

        return result as any[];
    }, [data]);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-[400px] flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                <p className="text-slate-500 text-sm font-medium">Loading historical trends...</p>
            </div>
        );
    }

    if (error || chartData.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-[400px] flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
                <h3 className="text-slate-700 font-medium mb-1">No Historical Data</h3>
                <p className="text-slate-500 text-sm max-w-sm">{error || "The system hasn't recorded enough data yet for the charts."}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-indigo-500" />
                        24-Hour Trend Analysis & Live Tank
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Detailed history for pH, Temperature, and Live Volume</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* pH Chart */}
                <SensorLineChart
                    title="pH Level"
                    liveValue={liveSensors.find(s => s.sensor_type === 'ph')?.value}
                    data={chartData}
                    dataKey="ph"
                    color="#10b981"
                    unit="pH"
                />

                {/* Replaced Volume Chart with Live Animated Tank */}
                <WaterTankWidget />

                {/* Temperature Chart */}
                <SensorLineChart
                    title="Temperature"
                    liveValue={liveSensors.find(s => s.sensor_type === 'temperature')?.value}
                    data={chartData}
                    dataKey="temperature"
                    color="#f97316"
                    unit="°C"
                />
            </div>
        </div>
    );
}

// Reusable Component for Individual Charts
interface SensorLineChartProps {
    title: string;
    liveValue?: string | number;
    data: any[];
    dataKey: string;
    color: string;
    unit: string;
}

function SensorLineChart({ title, liveValue, data, dataKey, color, unit }: SensorLineChartProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <h4 className="text-md font-bold text-slate-700">{title}</h4>
                {liveValue !== undefined && (
                    <div className="text-right">
                        <span className="text-2xl font-black tracking-tight" style={{ color }}>
                            {Number(liveValue).toFixed(2)}
                        </span>
                        <span className="text-sm font-bold text-slate-400 ml-1">{unit}</span>
                    </div>
                )}
            </div>

            <div className="h-[250px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            tickFormatter={(val) => `${val}`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: any) => [`${value} ${unit}`, title]}
                        />
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 0, fill: color }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
