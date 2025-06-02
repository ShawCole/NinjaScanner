import React from 'react';
import { Download, FileText, Table, FileCheck } from 'lucide-react';

interface ExportButtonsProps {
    domain: string;
    accessibilityData: any;
    t: (key: string) => string;
    className?: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({
    domain,
    accessibilityData,
    t,
    className = ''
}) => {
    const handleExport = (format: 'pdf' | 'csv' | 'vpat') => {
        // In a real implementation, this would trigger the actual export
        console.log(`Exporting ${format} for ${domain}`, accessibilityData);

        // Simulate download
        const filename = `${domain}-accessibility-report.${format}`;

        // For demo purposes, we'll just show an alert
        alert(`${t('downloading')} ${filename}...`);
    };

    const exportOptions = [
        {
            id: 'pdf',
            label: t('exportPDF'),
            description: t('pdfDescription'),
            icon: FileText,
            color: 'text-error-600 bg-error-50 hover:bg-error-100 focus:ring-error-500 border-error-200',
            format: 'pdf' as const
        },
        {
            id: 'csv',
            label: t('exportCSV'),
            description: t('csvDescription'),
            icon: Table,
            color: 'text-success-600 bg-success-50 hover:bg-success-100 focus:ring-success-500 border-success-200',
            format: 'csv' as const
        },
        {
            id: 'vpat',
            label: t('exportVPAT'),
            description: t('vpatDescription'),
            icon: FileCheck,
            color: 'text-primary-600 bg-primary-50 hover:bg-primary-100 focus:ring-primary-500 border-primary-200',
            format: 'vpat' as const
        }
    ];

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="grid gap-3">
                {exportOptions.map((option) => {
                    const IconComponent = option.icon;

                    return (
                        <button
                            key={option.id}
                            onClick={() => handleExport(option.format)}
                            className={`
                                w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                                hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2
                                ${option.color}
                            `}
                            aria-label={`${option.label}: ${option.description}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 p-2 rounded-lg bg-white border border-current">
                                    <IconComponent className="w-5 h-5" aria-hidden="true" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{option.label}</span>
                                        <Download className="w-4 h-4" aria-hidden="true" />
                                    </div>
                                    <p className="text-sm text-neutral-600 mt-1">
                                        {option.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Bulk export option */}
            <div className="pt-4 border-t border-neutral-200">
                <button
                    onClick={() => {
                        exportOptions.forEach(option => handleExport(option.format));
                    }}
                    className="
                        w-full p-4 rounded-xl border-2 border-dashed border-neutral-300 
                        text-neutral-600 hover:border-primary-300 hover:text-primary-700
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                        transition-all duration-200
                    "
                    aria-label={t('downloadAllFormats')}
                >
                    <div className="flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" aria-hidden="true" />
                        <span className="font-medium">{t('downloadAll')}</span>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">
                        {t('getAllFormats')}
                    </p>
                </button>
            </div>

            {/* Export info */}
            <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
                <p className="text-xs text-primary-700 leading-relaxed">
                    <strong>{t('note')}:</strong> {t('exportNote')}
                </p>
            </div>
        </div>
    );
};

export default ExportButtons; 