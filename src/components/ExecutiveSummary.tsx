import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Zap, Target, TrendingUp } from 'lucide-react';
import { ScanResult } from '../data/types';
import GaugeMeter from './GaugeMeter';

interface ExecutiveSummaryProps {
    scanResult: ScanResult;
    t: (key: string) => string;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ scanResult, t }) => {
    const { executiveSummary, overallScore, complianceStatus, riskLevel } = scanResult;

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'High': return 'bg-error-100 text-error-800 border-error-200';
            case 'Medium': return 'bg-warning-100 text-warning-800 border-warning-200';
            case 'Low': return 'bg-success-100 text-success-800 border-success-200';
            default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
        }
    };

    const getComplianceColor = (status: string) => {
        switch (status) {
            case 'Compliant': return 'bg-success-100 text-success-800 border-success-200';
            case 'Semi Compliant': return 'bg-warning-100 text-warning-800 border-warning-200';
            case 'Non Compliant': return 'bg-error-100 text-error-800 border-error-200';
            default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
        }
    };

    const getScoreDescription = (score: number) => {
        if (score >= 80) return 'Great! Your site shows strong accessibility compliance.';
        if (score >= 60) return 'Good progress! Some improvements needed for full compliance.';
        return 'Attention needed! Multiple accessibility issues require fixing.';
    };

    return (
        <div className="bg-white rounded-xl shadow-soft-lg p-6 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                        Accessibility Overview
                    </h2>
                    <p className="text-neutral-600">
                        {getScoreDescription(overallScore)}
                    </p>
                </div>
                <div className="flex gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getComplianceColor(complianceStatus)}`}>
                        {complianceStatus}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(riskLevel)}`}>
                        {riskLevel} Risk
                    </span>
                </div>
            </div>

            {/* Main Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-neutral-50 rounded-xl">
                        <div className="text-2xl font-bold text-neutral-900">
                            {executiveSummary.totalElements}
                        </div>
                        <div className="text-sm text-neutral-600">Total Elements</div>
                    </div>

                    <div className="text-center p-4 bg-error-50 rounded-xl">
                        <div className="text-2xl font-bold text-error-600">
                            {executiveSummary.failedElements}
                        </div>
                        <div className="text-sm text-neutral-600">Failed</div>
                    </div>

                    <div className="text-center p-4 bg-success-50 rounded-xl">
                        <div className="text-2xl font-bold text-success-600">
                            {executiveSummary.passedElements}
                        </div>
                        <div className="text-sm text-neutral-600">Passed</div>
                    </div>

                    <div className="text-center p-4 bg-primary-50 rounded-xl">
                        <div className="text-2xl font-bold text-primary-600">
                            {executiveSummary.compliancePercentage}%
                        </div>
                        <div className="text-sm text-neutral-600">Compliant</div>
                    </div>
                </div>
            </div>

            {/* Action Items Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Quick Wins */}
                <div className="bg-gradient-to-br from-success-50 to-success-100 border border-success-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-5 h-5 text-success-600" />
                        <h3 className="font-semibold text-success-800">Quick Wins</h3>
                    </div>
                    <div className="text-2xl font-bold text-success-700 mb-1">
                        {executiveSummary.quickWinsAvailable}
                    </div>
                    <p className="text-sm text-success-600">
                        AI-fixable issues available
                    </p>
                </div>

                {/* Priority Issues */}
                <div className="bg-gradient-to-br from-warning-50 to-warning-100 border border-warning-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Target className="w-5 h-5 text-warning-600" />
                        <h3 className="font-semibold text-warning-800">Priority Issues</h3>
                    </div>
                    <div className="text-2xl font-bold text-warning-700 mb-1">
                        {executiveSummary.priorityIssues}
                    </div>
                    <p className="text-sm text-warning-600">
                        High-impact accessibility barriers
                    </p>
                </div>

                {/* Estimated Fix Time */}
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-primary-600" />
                        <h3 className="font-semibold text-primary-800">Fix Time</h3>
                    </div>
                    <div className="text-2xl font-bold text-primary-700 mb-1">
                        {executiveSummary.estimatedFixTime}
                    </div>
                    <p className="text-sm text-primary-600">
                        Estimated development effort
                    </p>
                </div>
            </div>

            {/* Call-to-Action */}
            <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-primary-600" />
                        <span className="text-sm font-medium text-neutral-700">
                            Start with {executiveSummary.quickWinsAvailable} quick wins to boost your score by ~15 points
                        </span>
                    </div>
                    <button className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
                        View Action Plan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveSummary; 