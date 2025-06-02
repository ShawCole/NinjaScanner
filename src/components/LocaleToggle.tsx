import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Locale } from '../data/types';

interface LocaleToggleProps {
    currentLocale: string;
    onLocaleChange: (locale: string) => void;
    className?: string;
}

const LocaleToggle: React.FC<LocaleToggleProps> = ({
    currentLocale,
    onLocaleChange,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const supportedLocales: Locale[] = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'es', name: 'Español', flag: '🇪🇸' }
    ];

    const currentLocaleData = supportedLocales.find(locale => locale.code === currentLocale) || supportedLocales[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
            buttonRef.current?.focus();
        } else if (event.key === 'ArrowDown' && !isOpen) {
            setIsOpen(true);
        }
    };

    const handleLocaleSelect = (localeCode: string) => {
        onLocaleChange(localeCode);
        setIsOpen(false);
        buttonRef.current?.focus();
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                className="
          flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-300 
          bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 
          focus:ring-primary-500 focus:border-primary-500 transition-all duration-200
        "
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-label={`Change language. Current: ${currentLocaleData.name}`}
                data-testid="locale-toggle-button"
            >
                <Globe className="w-4 h-4 text-neutral-600" aria-hidden="true" />
                <span className="text-sm font-medium text-neutral-700" aria-hidden="true">
                    {currentLocaleData.flag}
                </span>
                <span className="text-sm text-neutral-600">
                    {currentLocaleData.code.toUpperCase()}
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                    aria-hidden="true"
                />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div
                    className="
            absolute top-full left-0 mt-2 w-48 bg-white border border-neutral-200 
            rounded-xl shadow-soft-lg z-50 py-2 animate-fade-in
          "
                    role="listbox"
                    aria-label="Select language"
                    data-testid="locale-dropdown"
                >
                    {supportedLocales.map((locale) => {
                        const isSelected = locale.code === currentLocale;

                        return (
                            <button
                                key={locale.code}
                                onClick={() => handleLocaleSelect(locale.code)}
                                className={`
                  w-full px-4 py-3 text-left hover:bg-neutral-50 
                  focus:outline-none focus:bg-neutral-50 transition-colors duration-150
                  ${isSelected ? 'bg-primary-50 text-primary-700' : 'text-neutral-700'}
                `}
                                role="option"
                                aria-selected={isSelected}
                                data-testid={`locale-option-${locale.code}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg" aria-hidden="true">
                                        {locale.flag}
                                    </span>
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            {locale.name}
                                        </div>
                                        <div className="text-xs text-neutral-500">
                                            {locale.code.toUpperCase()}
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="text-primary-600" aria-hidden="true">
                                            ✓
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Screen reader announcement */}
            <div className="sr-only" aria-live="polite">
                {isOpen && `Language menu opened. ${supportedLocales.length} options available.`}
            </div>
        </div>
    );
};

export default LocaleToggle; 