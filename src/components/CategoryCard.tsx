import React from 'react';
import { ChevronDown, ChevronRight, Eye, Move, Brain, Volume2, User, Glasses, EyeOff, Bot, AlertTriangle } from 'lucide-react';
import type { Category, DisabilityType } from '../data/types';

interface CategoryCardProps {
    category: Category & { isExpanded?: boolean };
    onClick: (category: Category) => void;
    isSelected?: boolean;
    t?: (key: string) => string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
    category,
    onClick,
    isSelected = false,
    t = (key) => key // Default translation function
}) => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick(category);
        }
    };

    // Calculate percentage
    const totalIssues = category.passed + category.failed;
    const passPercentage = totalIssues > 0 ? (category.passed / totalIssues) * 100 : category.score;

    // Determine color scheme based on compliance level
    const getStatusColors = () => {
        if (category.score >= 80) {
            return {
                bg: 'from-success-50 to-success-100',
                border: 'border-success-200',
                text: 'text-success-700',
                badge: 'bg-success-100 text-success-800',
                icon: 'text-success-600'
            };
        } else if (category.score >= 60) {
            return {
                bg: 'from-warning-50 to-warning-100',
                border: 'border-warning-200',
                text: 'text-warning-700',
                badge: 'bg-warning-100 text-warning-800',
                icon: 'text-warning-600'
            };
        } else {
            return {
                bg: 'from-error-50 to-error-100',
                border: 'border-error-200',
                text: 'text-error-700',
                badge: 'bg-error-100 text-error-800',
                icon: 'text-error-600'
            };
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'High': return 'bg-error-100 text-error-800 border-error-200';
            case 'Medium': return 'bg-warning-100 text-warning-800 border-warning-200';
            case 'Low': return 'bg-success-100 text-success-800 border-success-200';
            default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
        }
    };

    const getDisabilityIcon = (disability: DisabilityType) => {
        const iconProps = { className: "w-3 h-3" };

        switch (disability) {
            case 'visual': return <Eye {...iconProps} />;
            case 'motor': return <Move {...iconProps} />;
            case 'cognitive': return <Brain {...iconProps} />;
            case 'hearing': return <Volume2 {...iconProps} />;
            case 'elderly': return <User {...iconProps} />;
            case 'dyslexia': return <Glasses {...iconProps} />;
            case 'colorblind': return <EyeOff {...iconProps} />;
            default: return <User {...iconProps} />;
        }
    };

    const colors = getStatusColors();

    return (
        <div
            className={`
        bg-gradient-to-br ${colors.bg} ${colors.border} border-2 rounded-xl p-6 
        cursor-pointer transition-all duration-200 hover:shadow-soft-lg
        focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2
        ${isSelected ? 'ring-2 ring-primary-500 shadow-soft-lg' : ''}
      `}
            onClick={() => onClick(category)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-expanded={isSelected}
            aria-label={`${category.name} category, ${category.passed} passed, ${category.failed} failed. ${isSelected ? 'Selected' : 'Not selected'}`}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${colors.text}`}>
                    {category.name}
                </h3>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}>
                        {Math.round(category.score)}%
                    </span>
                    {category.riskLevel && (
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(category.riskLevel)}`}>
                            {category.riskLevel}
                        </span>
                    )}
                    {isSelected ? (
                        <ChevronDown className={`w-5 h-5 ${colors.icon}`} aria-hidden="true" />
                    ) : (
                        <ChevronRight className={`w-5 h-5 ${colors.icon}`} aria-hidden="true" />
                    )}
                </div>
            </div>

            {/* Disability Impact Indicators */}
            {category.affectedDisabilities && category.affectedDisabilities.length > 0 && (
                <div className="mb-4">
                    <div className="text-xs text-neutral-600 mb-2">Affects:</div>
                    <div className="flex flex-wrap gap-1">
                        {category.affectedDisabilities.slice(0, 3).map((disability) => (
                            <div
                                key={disability}
                                className="flex items-center gap-1 px-2 py-1 bg-white/60 rounded text-xs text-neutral-700"
                                title={disability}
                            >
                                {getDisabilityIcon(disability)}
                            </div>
                        ))}
                        {category.affectedDisabilities.length > 3 && (
                            <div className="px-2 py-1 bg-white/60 rounded text-xs text-neutral-600">
                                +{category.affectedDisabilities.length - 3}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-600">{t('progress')}</span>
                        <span className={`font-medium ${colors.text}`}>
                            {category.passed}/{totalIssues} {t('passed')}
                        </span>
                    </div>
                    <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300"
                            style={{ width: `${category.score}%` }}
                            role="progressbar"
                            aria-valuenow={category.score}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${category.name} compliance: ${Math.round(category.score)}%`}
                        />
                    </div>
                </div>

                {/* Enhanced Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-success-600">
                            {category.passed}
                        </div>
                        <div className="text-sm text-neutral-600">{t('passed')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-error-600">
                            {category.failed}
                        </div>
                        <div className="text-sm text-neutral-600">{t('failed')}</div>
                    </div>
                </div>

                {/* AI Fixable Indicator */}
                {category.aiFixableCount && category.aiFixableCount > 0 && (
                    <div className="flex items-center justify-center gap-2 p-2 bg-success-50 rounded-lg">
                        <Bot className="w-4 h-4 text-success-600" />
                        <span className="text-sm font-medium text-success-700">
                            {category.aiFixableCount} AI Fixable
                        </span>
                    </div>
                )}
            </div>

            {/* Screen reader content */}
            <div className="sr-only">
                Click or press Enter to {isSelected ? 'view details for' : 'select'} {category.name} category.
                Category contains {category.total} total issues.
                {category.aiFixableCount && category.aiFixableCount > 0 &&
                    ` ${category.aiFixableCount} issues can be automatically fixed.`
                }
            </div>
        </div>
    );
};

export default CategoryCard; 