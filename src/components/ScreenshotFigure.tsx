import React from 'react';
import { RefreshCw, AlertCircle, Globe } from 'lucide-react';
import { useScreenshot } from '../hooks/useScreenshot';

interface ScreenshotFigureProps {
    domain: string;
    className?: string;
    style?: React.CSSProperties;
    showOverlay?: boolean;
    overlayContent?: React.ReactNode;
}

const ScreenshotFigure: React.FC<ScreenshotFigureProps> = ({
    domain,
    className = "w-full h-full object-cover object-top",
    style,
    showOverlay = false,
    overlayContent
}) => {
    const { data: screenshot, loading, error } = useScreenshot(`https://${domain.replace(/^https?:\/\//, '')}`);

    if (loading) {
        return (
            <div className="relative w-full h-full bg-neutral-100 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-3" />
                    <h3 className="font-medium text-neutral-900 mb-1">Capturing Screenshot</h3>
                    <p className="text-sm text-neutral-600">Taking a snapshot of {domain}...</p>
                </div>
                {showOverlay && overlayContent && (
                    <div className="absolute inset-0">
                        {overlayContent}
                    </div>
                )}
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative w-full h-full bg-neutral-100 flex items-center justify-center">
                <div className="text-center px-4">
                    <AlertCircle className="w-8 h-8 text-error-500 mx-auto mb-3" />
                    <h3 className="font-medium text-neutral-900 mb-1">Screenshot Unavailable</h3>
                    <p className="text-sm text-neutral-600 mb-2">{domain}</p>
                    <p className="text-xs text-error-600">{error}</p>
                </div>
                {showOverlay && overlayContent && (
                    <div className="absolute inset-0">
                        {overlayContent}
                    </div>
                )}
            </div>
        );
    }

    if (!screenshot) {
        return (
            <div className="relative w-full h-full bg-neutral-100 flex items-center justify-center">
                <div className="text-center">
                    <Globe className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                    <h3 className="font-medium text-neutral-900 mb-1">Website Preview</h3>
                    <p className="text-sm text-neutral-600">{domain}</p>
                </div>
                {showOverlay && overlayContent && (
                    <div className="absolute inset-0">
                        {overlayContent}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            <img
                src={screenshot}
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
};

export default ScreenshotFigure; 