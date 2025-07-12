import FingerprintJS from '@fingerprintjs/fingerprintjs';

function getDeviceType() {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return 'Mobile';
    if (/tablet/i.test(ua)) return 'Tablet';
    return 'Desktop';
}

function getOS() {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes('win')) return 'Windows';
    if (platform.includes('mac')) return 'macOS';
    if (platform.includes('linux')) return 'Linux';
    return 'Unknown';
}

export async function getFingerprint() {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
}

export async function getVisitorInfo() {
    const fingerprint = await getFingerprint();
    return {
        FingerprintValue: fingerprint,
        Browser: navigator.userAgent,
        OS: getOS(),
        DeviceType: getDeviceType(),
        FirstVisit: new Date().toISOString(),
        LastVisit: new Date().toISOString(),
        IsActive: true,
    };
}
