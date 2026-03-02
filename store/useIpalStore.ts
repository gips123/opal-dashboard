import { create } from 'zustand';

export interface SystemStatus {
    mode: 'auto' | 'manual' | string;
    state: 'fill' | 'drain' | 'idle' | string;
    updated_at?: string;
}

export interface Device {
    name: string;
    type: 'pump' | 'blower';
    is_active: boolean;
}

export interface Sensor {
    sensor_type: string;
    value: string | number;
    recorded_at?: string;
}

interface IpalState {
    system_status: SystemStatus;
    devices: Device[];
    sensors: Sensor[];
    setSystemStatus: (status: SystemStatus) => void;
    setDevices: (devices: Device[]) => void;
    setSensors: (sensors: Sensor[]) => void;
    updateFromPayload: (payload: any) => void;
}

export const useIpalStore = create<IpalState>((set) => ({
    system_status: { mode: 'manual', state: 'idle' },
    devices: [
        { name: 'Pump Inlet', type: 'pump', is_active: false },
        { name: 'Pump Outlet', type: 'pump', is_active: false },
        { name: 'Blower A', type: 'blower', is_active: false },
        { name: 'Blower B', type: 'blower', is_active: false },
    ],
    sensors: [
        { sensor_type: 'ph', value: 0 },
        { sensor_type: 'volume', value: 0 },
        { sensor_type: 'temperature', value: 0 },
    ],
    setSystemStatus: (status) => set({ system_status: status }),
    setDevices: (devices) => set({ devices }),
    setSensors: (sensors) => set({ sensors }),
    updateFromPayload: (payload) => set((state) => ({
        system_status: {
            mode: payload.mode || state.system_status.mode,
            state: payload.state || state.system_status.state,
            updated_at: new Date().toISOString(),
        },
        devices: [
            { name: 'Pump Inlet', type: 'pump', is_active: payload.pump_inlet ?? state.devices[0].is_active },
            { name: 'Pump Outlet', type: 'pump', is_active: payload.pump_outlet ?? state.devices[1].is_active },
            { name: 'Blower A', type: 'blower', is_active: payload.blower_a ?? state.devices[2].is_active },
            { name: 'Blower B', type: 'blower', is_active: payload.blower_b ?? state.devices[3].is_active },
        ],
        sensors: [
            { sensor_type: 'ph', value: payload.ph ?? state.sensors[0].value, recorded_at: new Date().toISOString() },
            { sensor_type: 'volume', value: payload.volume ?? state.sensors[1].value, recorded_at: new Date().toISOString() },
            { sensor_type: 'temperature', value: payload.temperature ?? state.sensors[2].value, recorded_at: new Date().toISOString() },
        ]
    }))
}));
