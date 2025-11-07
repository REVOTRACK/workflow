import { useCallback } from 'react';

// A short, cybernetic confirmation sound, base64 encoded.
const soundData = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU0AAAAAx9/9/8//5/7/8P/3/+P/7v/1//r/9//5/+f/6v/w/+P/4//b/9//6//k//f/8//v//P/9v/w/+n/7//2//j/9//4/+f/7//1//n/8v/x/+f/8f/v/+P/6v/t//L/8P/y/+X/6//m//H/8P/v/+f/6//j/+v/7v/x/+v/6//p/+f/5v/l/+P/4v/f/9//2//b/9v/3P/b/9r/2f/a/9r/2//c/9z/3f/e/97/3//g/+H/4v/j/+X/5//q/+v/7//w//H/8v/z//T/9f/2//f/+P/5//r//P/9//8//v/+//3//f/9//7//v/+//7//f/9//7//f/9//3//f/9//3//f/9//3//f/9//3//Q==';

export const useSound = () => {
    const playSound = useCallback(() => {
        try {
            const audio = new Audio(soundData);
            audio.play().catch(error => {
                // Autoplay was prevented, which is common in browsers.
                // We can safely ignore this error in this context.
                if (error.name !== 'NotAllowedError') {
                   console.error("Audio playback failed:", error);
                }
            });
        } catch (error) {
            console.error("Failed to create audio element", error);
        }
    }, []);

    return { playSound };
};
