import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Category } from '../data/types';
import EnhancedIssueCard from './EnhancedIssueCard';

interface IssuePanelProps {
    isOpen: boolean;
    category: Category | null;
    onClose: () => void;
}

const IssuePanel: React.FC<IssuePanelProps> = ({
    isOpen,
    category,
    onClose
}) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const firstFocusableRef = useRef<HTMLButtonElement>(null);

    // Focus management and escape key handling
    useEffect(() => {
        if (isOpen) {
            // Focus the first focusable element when panel opens
            setTimeout(() => {
                firstFocusableRef.current?.focus();
            }, 100);

            // Handle escape key
            const handleEscape = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    onClose();
                }
            };

            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    // Focus trap
    useEffect(() => {
        if (!isOpen || !panelRef.current) return;

        const focusableElements = panelRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        document.addEventListener('keydown', handleTabKey);
        return () => document.removeEventListener('keydown', handleTabKey);
    }, [isOpen]);

    if (!isOpen || !category) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className="fixed right-0 top-0 h-full w-full max-w-3xl bg-white shadow-soft-xl z-50 transform transition-transform animate-slide-in overflow-y-auto"
                role="dialog"
                aria-modal="true"
                aria-labelledby="panel-title"
                data-testid="issue-panel"
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 id="panel-title" className="text-xl font-bold text-neutral-900">
                                {category.name} Issues
                            </h2>
                            <p className="text-sm text-neutral-600 mt-1">
                                {category.failed} failed • {category.passed} passed • {category.total} total
                            </p>
                        </div>
                        <button
                            ref={firstFocusableRef}
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                            aria-label="Close panel"
                            data-testid="close-panel-button"
                        >
                            <X className="w-5 h-5 text-neutral-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Enhanced Summary stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-neutral-50 rounded-xl">
                            <div className="text-2xl font-bold text-neutral-900">{category.score}%</div>
                            <div className="text-sm text-neutral-600">Score</div>
                        </div>
                        <div className="text-center p-4 bg-success-50 rounded-xl">
                            <div className="text-2xl font-bold text-success-600">{category.passed}</div>
                            <div className="text-sm text-neutral-600">Passed</div>
                        </div>
                        <div className="text-center p-4 bg-error-50 rounded-xl">
                            <div className="text-2xl font-bold text-error-600">{category.failed}</div>
                            <div className="text-sm text-neutral-600">Failed</div>
                        </div>
                        <div className="text-center p-4 bg-primary-50 rounded-xl">
                            <div className="text-2xl font-bold text-primary-600">
                                {category.aiFixableCount || 0}
                            </div>
                            <div className="text-sm text-neutral-600">AI Fixable</div>
                        </div>
                    </div>

                    {/* Issues list */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-neutral-900">
                            Failed Issues ({category.failed})
                        </h3>

                        {category.issues.length === 0 ? (
                            <div className="text-center py-8 text-neutral-500">
                                No issues found in this category.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {category.issues.map((issue) => (
                                    <EnhancedIssueCard
                                        key={issue.id}
                                        issue={issue}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default IssuePanel; 