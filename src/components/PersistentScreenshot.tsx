import React, { useEffect } from 'react';
import ScreenshotFigure from './ScreenshotFigure';
import { useScreenshot } from '../hooks/useScreenshot';

interface PersistentScreenshotProps {
    domain: string;
    className?: string;
    style?: React.CSSProperties;
    showOverlay?: boolean;
    overlayContent?: React.ReactNode;
    onScreenshotCaptured?: (screenshotUrl: string | null) => void;
    persistedScreenshot?: string | null;
}

const PersistentScreenshot: React.FC<PersistentScreenshotProps> = ({
    domain,
    className,
    style,
    showOverlay,
    overlayContent,
    onScreenshotCaptured,
    persistedScreenshot
}) => {
    const { data: screenshot } = useScreenshot(persistedScreenshot ? undefined : `https://${domain.replace(/^https?:\/\//, '')}`);

    // Notify parent when screenshot is captured
    useEffect(() => {
        if (screenshot && onScreenshotCaptured && !persistedScreenshot) {
            console.log('🖼️ Screenshot captured:', screenshot.substring(0, 50) + '...');
            onScreenshotCaptured(screenshot);
        }
    }, [screenshot, onScreenshotCaptured, persistedScreenshot]);

    console.log('🔍 PersistentScreenshot render:', {
        domain,
        hasPersisted: !!persistedScreenshot,
        hasLive: !!screenshot,
        persistedPreview: persistedScreenshot?.substring(0, 50)
    });

    if (persistedScreenshot) {
        // Show persisted screenshot with overlay - same structure as ScreenshotFigure
        return (
            <div className="relative w-full h-full">
                <img
                    src={persistedScreenshot}
                    alt={`Screenshot of ${domain}`}
                    className={className}
                    style={style}
                    loading="lazy"
                />
                {showOverlay && overlayContent && (
                    <div className="absolute inset-0">
                        {overlayContent}
                    </div>
                )}
            </div>
        );
    }

    // Show live screenshot figure for initial loading
    return (
        <ScreenshotFigure
            domain={domain}
            className={className}
            style={style}
            showOverlay={showOverlay}
            overlayContent={overlayContent}
        />
    );
};

export default PersistentScreenshot; 