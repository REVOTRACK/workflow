
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_CHAT_HISTORY } from '../constants';
import type { ChatMessage, User } from '../types';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

const getStoredMessages = (): ChatMessage[] => {
    const stored = localStorage.getItem('chatHistory');
    return stored ? JSON.parse(stored) : MOCK_CHAT_HISTORY;
};

export const ChatTool: React.FC = () => {
    const { user: currentUser, users } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>(getStoredMessages);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Find a bot user from the list of all users, excluding the current user
    const botUser = users.find(u => u.id !== currentUser?.id) || users[0] || { id: 'bot', name: 'Bot', avatar: 'B', status: 'online' };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !currentUser) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            author: currentUser,
            text: newMessage,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');

        // Simulate a bot response
        setTimeout(() => {
            const botMessage: ChatMessage = {
                id: Date.now() + 1,
                author: botUser,
                text: `Thanks for your message, ${currentUser.name}! I've received "${newMessage.substring(0, 20)}...". I'll process this shortly.`,
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, botMessage]);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.author.id === currentUser?.id ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white ${msg.author.id === currentUser?.id ? 'bg-green-500' : 'bg-slate-400'}`}>
                            {msg.author.avatar}
                        </div>
                        <div className={`p-3 rounded-lg max-w-lg ${msg.author.id === currentUser?.id ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.author.id === currentUser?.id ? 'text-green-100' : 'text-slate-500'}`}>
                                {msg.author.name} - {msg.timestamp}
                            </p>
                        </div>
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={handleSendMessage} className="flex gap-4">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    />
                    <Button type="submit" size="md">Send</Button>
                </form>
            </div>
        </div>
    );
};
