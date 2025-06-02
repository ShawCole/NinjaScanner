import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, MessageCircle, X } from 'lucide-react';
import GaugeMeter from '../components/GaugeMeter';
import CategoryCard from '../components/CategoryCard';
import IssuePanel from '../components/IssuePanel';
import ExportButtons from '../components/ExportButtons';
import LocaleToggle from '../components/LocaleToggle';
import PersistentScreenshot from '../components/PersistentScreenshot';
import ExecutiveSummary from '../components/ExecutiveSummary';
import { ScanResult, Category } from '../data/types';
import sampleData from '../data/sampleIssues.json';

// Load translations
import en from '../i18n/en.json';
import de from '../i18n/de.json';
import fr from '../i18n/fr.json';
import it from '../i18n/it.json';
import es from '../i18n/es.json';

const translations: Record<string, any> = { en, de, fr, it, es };

type DashboardState = 'initial' | 'scanning' | 'results';

const Dashboard: React.FC = () => {
    const [currentState, setCurrentState] = useState<DashboardState>('initial');
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [currentLocale, setCurrentLocale] = useState('en');
    const [domainInput, setDomainInput] = useState('');
    const [scanProgress, setScanProgress] = useState(0);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [currentScanDomain, setCurrentScanDomain] = useState<string>('');
    const [capturedScreenshot, setCapturedScreenshot] = useState<string | null>(null);

    const t = (key: string): string => {
        return translations[currentLocale]?.[key] || key;
    };

    const scanSteps = [
        t('scanningWebsite'),
        t('evaluatingAccessibility'),
        t('evaluatingClickables'),
        t('evaluatingTitles'),
        t('evaluatingForms'),
        t('evaluatingGraphics'),
        t('analyzingWCAG'),
        t('analyzingEN301549'),
        t('generatingReport'),
        t('finalizingResults')
    ];

    const handleStartScan = () => {
        if (!domainInput.trim()) return;

        setCurrentScanDomain(domainInput.trim());
        setCurrentState('scanning');
        setScanProgress(0);
        setCurrentStepIndex(0);
        setScanResult(null);
        setCapturedScreenshot(null);

        // Simulate progressive scanning
        let stepIndex = 0;
        const progressInterval = setInterval(() => {
            stepIndex++;
            const progress = (stepIndex / scanSteps.length) * 100;
            setScanProgress(progress);

            if (stepIndex < scanSteps.length) {
                setCurrentStepIndex(stepIndex);
            } else {
                // Scan complete - load results
                clearInterval(progressInterval);
                setTimeout(() => {
                    const data = {
                        ...sampleData,
                        domain: currentScanDomain,
                        lastScanDate: new Date()
                    } as ScanResult;
                    setScanResult(data);
                    setCurrentState('results');
                    setScanProgress(0);
                    setCurrentStepIndex(0);
                }, 1000);
            }
        }, 1500);
    };

    const handleCategoryClick = (category: Category) => {
        setSelectedCategory(category);
        setIsPanelOpen(true);
    };

    // Create enhanced accessibility data for the new interface
    const accessibilityData = scanResult ? {
        wcagScore: scanResult.wcagScore,
        en301549Score: scanResult.en301549Score,
        categories: scanResult.categories.map(cat => ({
            ...cat,
            passCount: cat.passed,
            failCount: cat.failed,
            isExpanded: false
        }))
    } : null;

    if (currentState === 'initial') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
                            NinjaScan.ai
                        </h1>
                        <p className="text-xl text-neutral-600 mb-8">
                            {t('heroSubtitle')}
                        </p>

                        <div className="bg-white rounded-xl shadow-soft-lg p-8 max-w-2xl mx-auto">
                            <div className="mb-6">
                                <label
                                    htmlFor="domain-input"
                                    className="block text-sm font-medium text-neutral-700 mb-2"
                                >
                                    {t('enterWebsite')}
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        id="domain-input"
                                        type="text"
                                        value={domainInput}
                                        onChange={(e) => setDomainInput(e.target.value)}
                                        placeholder="example.com"
                                        className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                                        onKeyPress={(e) => e.key === 'Enter' && handleStartScan()}
                                    />
                                    <button
                                        onClick={handleStartScan}
                                        disabled={!domainInput.trim()}
                                        className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {t('scanNow')}
                                    </button>
                                </div>
                            </div>

                            <div className="text-sm text-neutral-500 space-y-1">
                                <p>• {t('comprehensiveAnalysis')}</p>
                                <p>• {t('detailedReports')}</p>
                                <p>• {t('exportFormats')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (currentState === 'scanning') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary-900 mb-2">
                            NinjaScan.ai
                        </h1>
                        <p className="text-neutral-600">
                            {t('scanning')} {currentScanDomain}...
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        {/* Left: Website Screenshot */}
                        <div className="relative">
                            <div className="bg-white rounded-xl shadow-soft-lg overflow-hidden">
                                <div className="relative">
                                    <PersistentScreenshot
                                        domain={currentScanDomain}
                                        className="w-full h-96 object-cover object-top"
                                        showOverlay={true}
                                        overlayContent={
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                                <div className="text-white text-center">
                                                    <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                                                    <div className="text-lg font-medium">{t('scanning')}...</div>
                                                </div>
                                            </div>
                                        }
                                        onScreenshotCaptured={setCapturedScreenshot}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right: Scanning Progress */}
                        <div className="space-y-6">
                            {/* Progress Bar */}
                            <div className="bg-white rounded-xl shadow-soft p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-primary-700">
                                        {t('scanProgress')}
                                    </span>
                                    <span className="text-sm text-neutral-500">{Math.round(scanProgress)}%</span>
                                </div>
                                <div className="w-full bg-neutral-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-primary-600 to-secondary-500 h-2 rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${scanProgress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Current Scan Step */}
                            <div className="bg-white rounded-xl shadow-soft p-6">
                                <h3 className="text-lg font-semibold text-primary-900 mb-4">
                                    {t('currentlyScanning')}
                                </h3>
                                <div className="space-y-3">
                                    {scanSteps.map((step, index) => (
                                        <div key={index} className={`flex items-center p-3 rounded-lg transition-colors ${index < currentStepIndex ?
                                            'bg-success-50 text-success-700' :
                                            index === currentStepIndex ?
                                                'bg-primary-50 text-primary-700' :
                                                'bg-neutral-50 text-neutral-500'
                                            }`}>
                                            <div className={`w-2 h-2 rounded-full mr-3 ${index < currentStepIndex ?
                                                'bg-success-500' :
                                                index === currentStepIndex ?
                                                    'bg-primary-500 animate-pulse' :
                                                    'bg-neutral-300'
                                                }`}></div>
                                            {step}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cancel Button */}
                            <button
                                onClick={() => setCurrentState('initial')}
                                className="w-full px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
                            >
                                {t('cancelScan')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Results state
    if (!accessibilityData) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 relative">
            {/* Blurred Background */}
            <div className="absolute inset-0 z-0">
                <PersistentScreenshot
                    domain={currentScanDomain}
                    className="w-full h-full object-cover"
                    showOverlay={false}
                    persistedScreenshot={capturedScreenshot}
                />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-md"></div>
            </div>

            {/* Top Bar Matching Background Layer */}
            <div className="absolute inset-0 z-5" style={{
                background: 'linear-gradient(180deg, #0A2540 0%, #0A2540 200px, transparent 400px)'
            }}></div>

            {/* Main Content Container with Dynamic Margins */}
            <div
                className="relative z-10 min-h-screen py-5"
                style={{
                    paddingLeft: 'clamp(6px, calc(9px + (36 - 9) * ((100vw - 249px) / (1730 - 249))), 36px)',
                    paddingRight: 'clamp(6px, calc(9px + (36 - 9) * ((100vw - 249px) / (1730 - 249))), 36px)'
                }}
            >
                {/* Rounded Content Container with Complex Responsive Behavior */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative z-20">
                    {/* Header - Redesigned Layout */}
                    <header className="bg-white border-b border-neutral-100">
                        <div className="responsive-container-padding py-4">
                            <div className="responsive-inner-container flex items-center justify-between gap-4">
                                {/* Left: Logo */}
                                <div className="flex items-center">
                                    <h1 className="text-2xl font-bold text-primary-900">
                                        NinjaScan.ai
                                    </h1>
                                </div>

                                {/* Center: Domain Display */}
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="flex items-center gap-3 bg-neutral-100 rounded-full px-4 py-2 max-w-md">
                                        <div className="w-6 h-6 bg-neutral-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                            N
                                        </div>
                                        <span className="text-neutral-700 font-medium">
                                            {currentScanDomain}
                                        </span>
                                        <button className="text-neutral-500 hover:text-neutral-700">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Right: Actions */}
                                <div className="flex items-center gap-4">
                                    <LocaleToggle currentLocale={currentLocale} onLocaleChange={setCurrentLocale} />
                                    <button
                                        onClick={() => {
                                            setCurrentState('initial');
                                            setCurrentScanDomain('');
                                            setCapturedScreenshot(null);
                                        }}
                                        className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                                    >
                                        {t('newScan')}
                                    </button>
                                    <button className="p-2 text-neutral-600 hover:text-neutral-800">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="responsive-container-padding pb-8">
                        <div className="responsive-inner-container">
                            {/* Website Status Card */}
                            {scanResult && (
                                <div className="bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden mb-8">
                                    {/* Status Information with embedded screenshot */}
                                    <div className="px-3 py-4 md:p-4">
                                        <div className="flex flex-col md:flex-row items-start mb-0">
                                            {/* Mobile: Accessibility System Detection Indicator (shown above screenshot) */}
                                            <div className="w-full flex justify-center md:hidden mb-2.5">
                                                <div className="flex items-center gap-2 text-sm text-neutral-500">
                                                    <div className="w-4 h-4 border-2 border-neutral-400 rounded-full flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                                                    </div>
                                                    <span>No accessibility system detected</span>
                                                </div>
                                            </div>

                                            {/* Website Screenshot - responsive sizing */}
                                            <div className="flex-shrink-0 w-full md:w-auto">
                                                <div className="w-full h-[calc((100vw-24px)*214/380)] max-w-full md:w-[250px] md:h-[141px] md:mx-auto lg:w-[380px] lg:h-[214px] rounded-lg overflow-hidden border border-neutral-300">
                                                    <PersistentScreenshot
                                                        domain={currentScanDomain}
                                                        className="w-full h-full object-cover object-top"
                                                        showOverlay={false}
                                                        persistedScreenshot={capturedScreenshot}
                                                    />
                                                </div>
                                            </div>

                                            {/* Status Content Container */}
                                            <div className="flex-1 w-full md:w-auto relative md:ml-6 lg:ml-8">
                                                {/* Desktop: Accessibility System Detection Indicator (top-right) */}
                                                <div className="absolute top-0 right-0 hidden md:flex items-center gap-2 text-sm text-neutral-500">
                                                    <div className="w-4 h-4 border-2 border-neutral-400 rounded-full flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                                                    </div>
                                                    <span>No accessibility system detected</span>
                                                </div>

                                                {/* Main Status Display */}
                                                <div className="mt-8">
                                                    {/* Status Icon and Title */}
                                                    <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left lg:pb-4" style={{ gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                                                        <div
                                                            className={`flex-shrink-0 rounded-full flex items-center justify-center ${scanResult.overallScore >= 80
                                                                ? 'bg-green-100'
                                                                : scanResult.overallScore >= 60
                                                                    ? 'bg-orange-100'
                                                                    : 'bg-red-100'
                                                                }`}
                                                            style={{
                                                                width: 'clamp(3.5rem, 8vw, 4.5rem)',
                                                                height: 'clamp(3.5rem, 8vw, 4.5rem)'
                                                            }}
                                                        >
                                                            {scanResult.overallScore >= 80 ? (
                                                                <svg
                                                                    className="text-green-600"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                    style={{
                                                                        width: 'clamp(1.75rem, 4vw, 2.25rem)',
                                                                        height: 'clamp(1.75rem, 4vw, 2.25rem)'
                                                                    }}
                                                                >
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            ) : scanResult.overallScore >= 60 ? (
                                                                <svg
                                                                    className="text-orange-600"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                    style={{
                                                                        width: 'clamp(1.75rem, 4vw, 2.25rem)',
                                                                        height: 'clamp(1.75rem, 4vw, 2.25rem)'
                                                                    }}
                                                                >
                                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                </svg>
                                                            ) : (
                                                                <svg
                                                                    className="text-red-600"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                    style={{
                                                                        width: 'clamp(1.75rem, 4vw, 2.25rem)',
                                                                        height: 'clamp(1.75rem, 4vw, 2.25rem)'
                                                                    }}
                                                                >
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h2 className="text-[20px] md:text-[24px] lg:text-[32px] font-bold text-neutral-900">
                                                                {scanResult.overallScore >= 80
                                                                    ? 'Accessible'
                                                                    : scanResult.overallScore >= 60
                                                                        ? 'Mostly Accessible'
                                                                        : 'Needs Attention'
                                                                }
                                                            </h2>
                                                            <p
                                                                className="text-neutral-600 leading-normal mt-1"
                                                                style={{ fontSize: 'clamp(0.875rem, 2.5vw, 0.9375rem)' }}
                                                            >
                                                                {scanResult.overallScore >= 80
                                                                    ? 'Great work! Our scan indicates that your webpage is accessible and conforms with WCAG. Thanks for being inclusive!'
                                                                    : scanResult.overallScore >= 60
                                                                        ? 'Good progress! Your site shows decent accessibility compliance, but some improvements are needed for full WCAG conformance.'
                                                                        : 'Your website has accessibility barriers that need attention. We\'ve identified issues that may prevent some users from accessing your content.'
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* CTA Section - Large screens only (inside right column) */}
                                                <div className="pt-4 border-t border-neutral-200 hidden lg:block">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-neutral-600">
                                                                View the report and get more info on our remediation solutions
                                                            </p>
                                                        </div>
                                                        <button
                                                            className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex-shrink-0 whitespace-nowrap flex items-center justify-center gap-1"
                                                            style={{ width: '140px' }}
                                                        >
                                                            Get Free Report
                                                            <svg className="w-2.5 h-4 flex-shrink-0" viewBox="0 0 9.5 16" fill="currentColor">
                                                                <path d="M1.5,0L0,1.5L6.5,8L0,14.5L1.5,16l8-8L1.5,0z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA Section - Mobile and Medium screens (spans full width) */}
                                        <div className="pt-6 border-t border-neutral-200 lg:hidden mt-5">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-neutral-600">
                                                        View the report and get more info on our remediation solutions
                                                    </p>
                                                </div>
                                                <button
                                                    className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex-shrink-0 whitespace-nowrap flex items-center justify-center gap-1"
                                                    style={{ width: '140px' }}
                                                >
                                                    Get Free Report
                                                    <svg className="w-2.5 h-4 flex-shrink-0" viewBox="0 0 9.5 16" fill="currentColor">
                                                        <path d="M1.5,0L0,1.5L6.5,8L0,14.5L1.5,16l8-8L1.5,0z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Executive Summary */}
                            {scanResult && (
                                <ExecutiveSummary
                                    scanResult={scanResult}
                                    t={t}
                                />
                            )}

                            {/* Gauge Meters */}
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-100">
                                    <h2 className="text-xl font-semibold text-primary-900 mb-6">{t('wcagCompliance')}</h2>
                                    <GaugeMeter
                                        value={accessibilityData.wcagScore}
                                        maxValue={100}
                                        primaryColor="#11e5b3"
                                        secondaryColor="#634bff"
                                        size={200}
                                        label="WCAG 2.2"
                                    />
                                </div>

                                <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-100">
                                    <h2 className="text-xl font-semibold text-primary-900 mb-6">{t('en301549Compliance')}</h2>
                                    <GaugeMeter
                                        value={accessibilityData.en301549Score}
                                        maxValue={100}
                                        primaryColor="#11e5b3"
                                        secondaryColor="#634bff"
                                        size={200}
                                        label="EN 301 549"
                                    />
                                </div>
                            </div>

                            {/* Category Cards */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {accessibilityData.categories.map((category) => (
                                    <CategoryCard
                                        key={category.id}
                                        category={category}
                                        onClick={handleCategoryClick}
                                        isSelected={selectedCategory?.id === category.id}
                                        t={t}
                                    />
                                ))}
                            </div>

                            {/* Export Options */}
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-100">
                                <h2 className="text-xl font-semibold text-primary-900 mb-4">{t('exportReport')}</h2>
                                <ExportButtons
                                    domain={currentScanDomain}
                                    accessibilityData={accessibilityData}
                                    t={t}
                                />
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Issue Panel */}
            <IssuePanel
                isOpen={isPanelOpen}
                category={selectedCategory}
                onClose={() => {
                    setIsPanelOpen(false);
                    setSelectedCategory(null);
                }}
            />

            {/* Floating support button */}
            <button
                className="
                    fixed bottom-6 right-6 p-4 bg-primary-600 text-white rounded-full shadow-2xl
                    hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    transition-all duration-200 z-30
                "
                aria-label="Contact support"
            >
                <MessageCircle className="w-6 h-6" />
            </button>
        </div>
    );
};

export default Dashboard;