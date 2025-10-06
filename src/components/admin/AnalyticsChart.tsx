import React from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface AnalyticsChartProps {
  title: string;
  data: Array<{ label: string; value: number; color?: string }>;
  type?: 'bar' | 'line' | 'pie';
  showTrend?: boolean;
  trendValue?: number;
  trendLabel?: string;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  title,
  data,
  type = 'bar',
  showTrend = false,
  trendValue = 0,
  trendLabel = ''
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const isPositiveTrend = trendValue >= 0;

  return (
    <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-playfair text-pm-gold">{title}</h3>
        {showTrend && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            isPositiveTrend ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {isPositiveTrend ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(trendValue)}% {trendLabel}
            </span>
          </div>
        )}
      </div>

      {type === 'bar' && (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-pm-off-white/70 text-sm">{item.label}</span>
                <span className="text-pm-gold font-semibold">{item.value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-pm-gold/10 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    item.color || 'bg-pm-gold'
                  }`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'line' && (
        <div className="space-y-4">
          <div className="h-32 flex items-end justify-between gap-2">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 rounded-t ${
                    item.color || 'bg-pm-gold'
                  } transition-all duration-500`}
                  style={{ height: `${(item.value / maxValue) * 100}px` }}
                />
                <span className="text-xs text-pm-off-white/70">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${item.color || 'bg-pm-gold'}`} />
                <span className="text-pm-off-white/70">{item.label}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === 'pie' && (
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-pm-gold/20"
              />
              {data.map((item, index) => {
                const percentage = (item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100;
                const circumference = 2 * Math.PI * 40;
                const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = data.slice(0, index).reduce((sum, d) => {
                  const p = (d.value / data.reduce((s, d) => s + d.value, 0)) * 100;
                  return sum - (p / 100) * circumference;
                }, 0);

                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={item.color || 'bg-pm-gold'}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-pm-gold font-bold text-lg">
                {data.reduce((sum, d) => sum + d.value, 0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsChart;
