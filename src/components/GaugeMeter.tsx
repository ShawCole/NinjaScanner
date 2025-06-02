import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeMeterProps {
    value: number;
    maxValue: number;
    primaryColor?: string;
    secondaryColor?: string;
    size?: number;
    label?: string;
}

const GaugeMeter: React.FC<GaugeMeterProps> = ({
    value,
    maxValue,
    primaryColor = '#634bff', // Brand Purple
    secondaryColor = '#e2e8f0', // Light gray for empty portion
    size = 200,
    label
}) => {
    const percentage = (value / maxValue) * 100;

    // Create data for single half donut
    const data = [
        { name: 'filled', value: percentage, color: primaryColor },
        { name: 'empty', value: 100 - percentage, color: secondaryColor }
    ];

    // Calculate stroke width based on size
    const strokeWidth = Math.max(size * 0.15, 12);
    const radius = (size / 2) - (strokeWidth / 2);

    return (
        <div className="flex flex-col items-center" role="img" aria-label={`${label} score: ${value} out of ${maxValue}`}>
            <div className="relative" style={{ width: size, height: size * 0.6 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            cx="50%"
                            cy="90%"
                            outerRadius={radius + strokeWidth / 2}
                            innerRadius={radius - strokeWidth / 2}
                            startAngle={180}
                            endAngle={0}
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
                    <div className="text-3xl font-bold text-primary-900" aria-hidden="true">
                        {Math.round(value)}%
                    </div>
                    {label && (
                        <div className="text-sm font-medium text-neutral-600 mt-1" aria-hidden="true">
                            {label}
                        </div>
                    )}
                </div>
            </div>

            {/* Accessibility improvements */}
            <div className="sr-only">
                {label} compliance score: {value} out of {maxValue} ({Math.round(percentage)}%)
            </div>
        </div>
    );
};

export default GaugeMeter; 