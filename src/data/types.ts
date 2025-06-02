export interface Issue {
    id: string;
    wcagId: string;
    enClause: string;
    description: string;
    severity: 'A' | 'AA' | 'AAA';
    category: string;
    impact: 'Low' | 'Medium' | 'High' | 'Critical';
    aiFixable: boolean;
    widgetFixable: boolean;
    element?: string;
    location?: string;
    codeSnippet?: string;
    fixDescription?: string;
    affectedDisabilities: DisabilityType[];
    remediationDifficulty: 'Easy' | 'Medium' | 'Hard';
    isManualReviewRequired: boolean;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    passed: number;
    failed: number;
    total: number;
    score: number;
    issues: Issue[];
    riskLevel: RiskLevel;
    affectedDisabilities: DisabilityType[];
    aiFixableCount: number;
    manualReviewCount: number;
}

export interface ScanResult {
    domain: string;
    lastScanDate: Date;
    overallScore: number;
    wcagScore: number;
    en301549Score: number;
    totalIssues: number;
    categories: Category[];
    complianceStatus: 'Compliant' | 'Semi Compliant' | 'Non Compliant';
    riskLevel: 'Low' | 'Medium' | 'High';
    executiveSummary: {
        totalElements: number;
        passedElements: number;
        failedElements: number;
        compliancePercentage: number;
        quickWinsAvailable: number;
        priorityIssues: number;
        estimatedFixTime: string;
    };
}

export interface Locale {
    code: string;
    name: string;
    flag: string;
}

export type DisabilityType =
    | 'visual'
    | 'motor'
    | 'cognitive'
    | 'hearing'
    | 'speech'
    | 'elderly'
    | 'dyslexia'
    | 'colorblind';

export type SeverityLevel = 'A' | 'AA' | 'AAA';
export type ImpactLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type ComplianceStatus = 'Compliant' | 'Semi Compliant' | 'Non Compliant';
export type RiskLevel = 'Low' | 'Medium' | 'High'; 