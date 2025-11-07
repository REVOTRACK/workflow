
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/icons/Logo';
import { Button } from '../components/Button';

export const LoginPage: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, signup } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isLoginView) {
                login(username, password);
            } else {
                signup(username, password);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl border border-slate-200">
                <div className="text-center">
                    <div className="flex justify-center text-slate-800">
                      <Logo />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-slate-800">
                        {isLoginView ? 'Sign in to your account' : 'Create a new account'}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 bg-white placeholder-slate-400 text-slate-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 bg-white placeholder-slate-400 text-slate-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <div>
                        <Button type="submit" fullWidth size="lg">
                            {isLoginView ? 'Sign in' : 'Sign up'}
                        </Button>
                    </div>
                </form>
                <p className="text-sm text-center text-slate-600">
                    {isLoginView ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button
                        onClick={() => {
                            setIsLoginView(!isLoginView);
                            setError('');
                        }}
                        className="font-medium text-green-600 hover:text-green-700"
                    >
                        {isLoginView ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );
};
