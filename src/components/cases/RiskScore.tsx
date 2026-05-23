/**
 * RiskScore Component
 *
 * Displays risk score (0-10) with color-coded visualization.
 */

interface RiskScoreProps {
  score: number;
  showPercentage?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskScore({
  score,
  showPercentage = true,
  showLabel = true,
  size = 'md',
}: RiskScoreProps) {
  // Clamp score to 0-10
  const normalizedScore = Math.max(0, Math.min(10, score));
  const percentage = (normalizedScore / 10) * 100;

  // Color based on risk level
  let colorClass = 'bg-green-500'; // Low risk (0-3)
  let riskLabel = 'Low Risk';

  if (normalizedScore > 3 && normalizedScore <= 7) {
    colorClass = 'bg-yellow-500'; // Medium risk (4-7)
    riskLabel = 'Medium Risk';
  } else if (normalizedScore > 7) {
    colorClass = 'bg-red-500'; // High risk (8-10)
    riskLabel = 'High Risk';
  }

  const sizeClasses = {
    sm: { bar: 'h-1.5', text: 'text-xs' },
    md: { bar: 'h-2', text: 'text-sm' },
    lg: { bar: 'h-3', text: 'text-base' },
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className={`font-semibold ${sizeClasses[size].text}`}>
            Risk Assessment
          </span>
          <span className={`font-bold ${sizeClasses[size].text}`}>
            {normalizedScore.toFixed(1)}/10
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${colorClass} transition-all duration-300 ${sizeClasses[size].bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Risk label */}
      <div className="flex items-center justify-between">
        <span className={`text-gray-600 ${sizeClasses[size].text}`}>
          {riskLabel}
        </span>
        {showPercentage && (
          <span className={`text-gray-500 ${sizeClasses[size].text}`}>
            {percentage.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
}
