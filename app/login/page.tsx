'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Droplet, Lock, Mail, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import Image from 'next/image';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            const { token } = response.data;

            if (token) {
                Cookies.set('token', token, { expires: 1, secure: process.env.NODE_ENV === 'production' });
                router.push('/dashboard');
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-950 via-blue-900 to-indigo-950 p-4">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

            <div className="w-full max-w-lg bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-10 relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20 mb-6 backdrop-blur-md shadow-inner border border-blue-400/30">
                        <Image src="/josindo.png" alt="Logo" width={50} height={40} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">Sign In</h1>
                    <p className="text-blue-200/80 mt-3 text-sm font-medium">PT Josindo Prima Sentosa - Monitoring System Dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-blue-300/70 group-focus-within:text-cyan-400 transition-colors" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-12 pr-4 py-3.5 border border-white/10 rounded-2xl leading-5 bg-white/5 text-white placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 sm:text-sm transition-all backdrop-blur-sm"
                                placeholder="Email address"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-blue-300/70 group-focus-within:text-cyan-400 transition-colors" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-12 pr-4 py-3.5 border border-white/10 rounded-2xl leading-5 bg-white/5 text-white placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 sm:text-sm transition-all backdrop-blur-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full relative flex justify-center py-4 px-4 border border-transparent rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-blue-900 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed items-center"
                    >
                        <span className="relative z-10 flex items-center">
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                    Mengautentikasi...
                                </>
                            ) : (
                                'Masuk Dashboard'
                            )}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}
