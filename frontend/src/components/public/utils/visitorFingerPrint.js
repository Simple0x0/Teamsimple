import { getVisitorInfo } from './getVisitorInfo';

const backendURL = import.meta.env.VITE_API_URL;

export async function trackVisitor() {
    try {
        const visitorData = await getVisitorInfo();

        const response = await fetch(`${backendURL}/api/fingerprint`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(visitorData),
        });

        if (!response.ok) {
            throw new Error('Visitor tracking failed');
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
