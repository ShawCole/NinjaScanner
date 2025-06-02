import { useState, useEffect } from 'react';

interface ScreenshotState {
    data: string | null;
    loading: boolean;
    error: string | null;
}

export function useScreenshot(url?: string): ScreenshotState {
    const [state, setState] = useState<ScreenshotState>({
        data: null,
        loading: false,
        error: null
    });

    useEffect(() => {
        if (!url || !url.trim()) {
            setState({ data: null, loading: false, error: null });
            return;
        }

        setState({ data: null, loading: true, error: null });

        // Multiple screenshot service URLs with fallbacks
        const getScreenshotUrls = (targetUrl: string): string[] => {
            const cleanUrl = targetUrl.replace(/^https?:\/\//, '');
            const encodedUrl = encodeURIComponent(`https://${cleanUrl}`);

            return [
                // Option 1: WordPress mShots (reliable and free)
                `https://s0.wp.com/mshots/v1/${encodedUrl}?w=1200&h=800`,

                // Option 2: Microlink API (good fallback)
                `https://api.microlink.io/screenshot?url=${encodedUrl}&viewport.width=1200&viewport.height=800&type=jpeg`,

                // Option 3: PagePeeker (simple but works)
                `https://free.pagepeeker.com/v2/thumbs.php?size=l&url=${encodedUrl}`,

                // Option 4: Website Screenshot Machine (demo)
                `https://api.screenshotmachine.com/?key=demo&url=${encodedUrl}&dimension=1200x800&format=png`,

                // Final fallback: Placeholder with domain info
                `https://via.placeholder.com/1200x800/f1f5f9/64748b?text=${encodeURIComponent(`${cleanUrl.split('/')[0]}\nWebsite\nPreview`)}`
            ];
        };

        const screenshotUrls = getScreenshotUrls(url);
        let currentIndex = 0;

        const tryNextUrl = () => {
            if (currentIndex >= screenshotUrls.length) {
                setState({
                    data: null,
                    loading: false,
                    error: 'All screenshot services failed'
                });
                return;
            }

            const currentUrl = screenshotUrls[currentIndex];

            // Test if the image loads
            const testImage = new Image();
            testImage.crossOrigin = 'anonymous';

            testImage.onload = () => {
                setState({
                    data: currentUrl,
                    loading: false,
                    error: null
                });
            };

            testImage.onerror = () => {
                currentIndex++;
                if (currentIndex < screenshotUrls.length) {
                    // Try next URL after a short delay
                    setTimeout(tryNextUrl, 500);
                } else {
                    setState({
                        data: null,
                        loading: false,
                        error: 'Unable to capture website screenshot'
                    });
                }
            };

            testImage.src = currentUrl;
        };

        // Start trying URLs
        tryNextUrl();

        // Cleanup function
        return () => {
            setState({ data: null, loading: false, error: null });
        };
    }, [url]);

    return state;
} 