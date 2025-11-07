
import type { EncodingMethod, User, ChatMessage } from './types';

export const ENCODING_METHODS: { value: EncodingMethod; label: string }[] = [
    { value: 'hex', label: 'HTML Hexadecimal Entities' },
    { value: 'dec', label: 'HTML Decimal Entities' },
    { value: 'named', label: 'HTML Named Entities' },
    { value: 'percent', label: 'Percent Encoding' },
    { value: 'mixed', label: 'Mixed Hybrid' },
    { value: 'custom', label: 'Custom Mapping' },
];

const defaultUser: User = { id: '2', name: 'Alex', avatar: 'A', status: 'online' };
const anotherUser: User = { id: '3', name: 'Casey', avatar: 'C', status: 'online' };


export const MOCK_CHAT_HISTORY: ChatMessage[] = [
    {
        id: 1,
        author: defaultUser,
        text: 'Hey team, just pushing the latest updates for the encoding module. Let me know what you think.',
        timestamp: '10:30 AM',
    },
    {
        id: 2,
        author: anotherUser,
        text: 'Looks good! The new UI is much cleaner. Did you manage to fix that issue with the custom map parsing?',
        timestamp: '10:32 AM',
    },
];
