
import type { EncodingMethod } from '../types';

// Core encoder functions
const encodeHex = (s: string): string => [...s].map(c => '&#x' + c.charCodeAt(0).toString(16) + ';').join('');
const encodeDec = (s: string): string => [...s].map(c => '&#' + c.charCodeAt(0) + ';').join('');

const htmlMap: Record<string, string> = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
const encodeNamed = (s: string): string => s.replace(/[&<>"']/g, c => htmlMap[c] || c);

const encodePercent = (s: string): string => {
    try {
        return encodeURIComponent(s);
    } catch {
        return s; // Fallback for invalid URI components
    }
};

const encodeMixed = (s: string): string => [...s].map((c, i) => {
    const encoders = [encodeHex, encodeDec, encodeNamed, encodePercent];
    return encoders[i % 4](c);
}).join('');

const encodeCustom = (s: string, map: Record<string, string>): string => [...s].map(c => map[c] || c).join('');

const encoders: Record<EncodingMethod, (s: string, map?: Record<string, string>) => string> = {
    hex: encodeHex,
    dec: encodeDec,
    named: encodeNamed,
    percent: encodePercent,
    mixed: encodeMixed,
    custom: (s, map) => encodeCustom(s, map || {}),
};

export const encodeUrlSmart = (url: string, method: EncodingMethod, customMap: Record<string, string> = {}): string => {
    const encoder = (s: string) => encoders[method](s, customMap);

    // This regex splits the URL by separators, keeping the separators in the resulting array.
    // Separators are things like '://', '.', '/', '?', '&', '=', '#'.
    // The capturing group ( ... ) ensures the separators are kept.
    const separators = /(\:\/\/|\.|\/|\?|\&|\=|\#)/g;
    
    // An empty string part can result if the url starts with a separator. We filter it out.
    const parts = url.split(separators).filter(part => part);

    return parts.map(part => {
        // If the part is a known separator, return it as is.
        if (separators.test(part)) {
            return part;
        }
        // Otherwise, it's a token that needs to be encoded.
        return encoder(part);
    }).join('');
};
