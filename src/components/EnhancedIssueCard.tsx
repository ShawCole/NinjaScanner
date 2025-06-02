import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronRight,
    Bot,
    Wrench,
    User,
    Eye,
    EyeOff,
    Move,
    Brain,
    Volume2,
    Glasses,
    Code,
    AlertTriangle,
    CheckCircle,
    Clock
} from 'lucide-react';
import { Issue, DisabilityType } from '../data/types';

interface EnhancedIssueCardProps {
    issue: Issue;
    t?: (key: string) => string;
}

const EnhancedIssueCard: React.FC<EnhancedIssueCardProps> = ({
    issue,
    t = (key) => key
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getSeverityColor = (severity: string): string => {
        switch (severity) {
            case 'A': return 'bg-error-100 text-error-800 border-error-200';
            case 'AA': return 'bg-warning-100 text-warning-800 border-warning-200';
            case 'AAA': return 'bg-success-100 text-success-800 border-success-200';
            default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
        }
    };

    const getImpactColor = (impact: string): string => {
        switch (impact) {
            case 'Critical': return 'bg-error-500 text-white';
            case 'High': return 'bg-error-400 text-white';
            case 'Medium': return 'bg-warning-500 text-white';
            case 'Low': return 'bg-success-500 text-white';
            default: return 'bg-neutral-500 text-white';
        }
    };

    const getDifficultyColor = (difficulty: string): string => {
        switch (difficulty) {
            case 'Easy': return 'bg-success-100 text-success-800 border-success-200';
            case 'Medium': return 'bg-warning-100 text-warning-800 border-warning-200';
            case 'Hard': return 'bg-error-100 text-error-800 border-error-200';
            default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
        }
    };

    const getDisabilityIcon = (disability: DisabilityType) => {
        const iconProps = { className: "w-4 h-4" };

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

    const getDisabilityLabel = (disability: DisabilityType): string => {
        switch (disability) {
            case 'visual': return 'Visually Impaired';
            case 'motor': return 'Motor Impaired';
            case 'cognitive': return 'Cognitive Disability';
            case 'hearing': return 'Hearing Impaired';
            case 'elderly': return 'Elderly Users';
            case 'dyslexia': return 'Dyslexia';
            case 'colorblind': return 'Color Blind';
            default: return disability;
        }
    };

    return (
        <div className="border border-neutral-200 rounded-xl bg-white hover:bg-neutral-50 transition-colors">
            {/* Issue Header */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(issue.severity)}`}>
                            WCAG {issue.severity}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getImpactColor(issue.impact)}`}>
                            {issue.impact}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getDifficultyColor(issue.remediationDifficulty)}`}>
                            {issue.remediationDifficulty} Fix
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {issue.aiFixable && (
                            <div className="flex items-center gap-1 text-xs text-success-600 bg-success-50 px-2 py-1 rounded">
                                <Bot className="w-3 h-3" />
                                AI Fixable
                            </div>
                        )}
                        {issue.widgetFixable && (
                            <div className="flex items-center gap-1 text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">
                                <Wrench className="w-3 h-3" />
                                Widget Fix
                            </div>
                        )}
                        {issue.isManualReviewRequired && (
                            <div className="flex items-center gap-1 text-xs text-warning-600 bg-warning-50 px-2 py-1 rounded">
                                <User className="w-3 h-3" />
                                Manual Review
                            </div>
                        )}
                    </div>
                </div>

                {/* Issue Description */}
                <h4 className="font-medium text-neutral-900 mb-3 text-lg">
                    {issue.description}
                </h4>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 mb-4">
                    <span><strong>WCAG:</strong> {issue.wcagId}</span>
                    <span><strong>EN 301 549:</strong> {issue.enClause}</span>
                    {issue.element && <span><strong>Element:</strong> {issue.element}</span>}
                    {issue.location && <span><strong>Location:</strong> {issue.location}</span>}
                </div>

                {/* Affected Disabilities */}
                <div className="mb-4">
                    <h5 className="text-sm font-medium text-neutral-700 mb-2">Who is affected by this issue:</h5>
                    <div className="flex flex-wrap gap-2">
                        {issue.affectedDisabilities.map((disability) => (
                            <div
                                key={disability}
                                className="flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full text-sm text-neutral-700"
                            >
                                {getDisabilityIcon(disability)}
                                <span>{getDisabilityLabel(disability)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expand/Collapse Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                    aria-expanded={isExpanded}
                >
                    {isExpanded ? (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            Show Less Details
                        </>
                    ) : (
                        <>
                            <ChevronRight className="w-4 h-4" />
                            Show Code & Fix Details
                        </>
                    )}
                </button>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-neutral-200 p-5 bg-neutral-50">
                    <div className="space-y-4">
                        {/* Code Snippet */}
                        {issue.codeSnippet && (
                            <div>
                                <h5 className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                    <Code className="w-4 h-4" />
                                    Failing Code Element
                                </h5>
                                <div className="bg-neutral-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                    <code>{issue.codeSnippet}</code>
                                </div>
                            </div>
                        )}

                        {/* Fix Description */}
                        {issue.fixDescription && (
                            <div>
                                <h5 className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Recommended Action
                                </h5>
                                <div className="bg-white border border-neutral-200 rounded-lg p-4">
                                    <p className="text-sm text-neutral-700">{issue.fixDescription}</p>
                                </div>
                            </div>
                        )}

                        {/* Fix Timing */}
                        <div className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-neutral-500" />
                                <div>
                                    <div className="text-sm font-medium text-neutral-900">
                                        Estimated Fix Time
                                    </div>
                                    <div className="text-xs text-neutral-600">
                                        Based on complexity and available tools
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-primary-600">
                                    {issue.aiFixable ? '< 1 min' :
                                        issue.remediationDifficulty === 'Easy' ? '5-15 min' :
                                            issue.remediationDifficulty === 'Medium' ? '30-60 min' : '2-4 hours'}
                                </div>
                                <div className="text-xs text-neutral-500">
                                    {issue.aiFixable ? 'Automated' : 'Manual effort'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedIssueCard; 