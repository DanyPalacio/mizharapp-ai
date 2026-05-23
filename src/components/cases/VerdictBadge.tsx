/**
 * VerdictBadge Component
 *
 * Displays VC verdict status with color coding.
 * Used throughout case study displays.
 */

interface VerdictBadgeProps {
  verdict: 'PASS' | 'CONDITIONAL' | 'FAIL' | 'UNKNOWN';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function VerdictBadge({
  verdict,
  size = 'md',
  showLabel = true,
}: VerdictBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const verdictClasses = {
    PASS: 'bg-green-100 text-green-800 border border-green-300',
    CONDITIONAL: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    FAIL: 'bg-red-100 text-red-800 border border-red-300',
    UNKNOWN: 'bg-gray-100 text-gray-800 border border-gray-300',
  };

  const verdictIcons = {
    PASS: '✓',
    CONDITIONAL: '⚠',
    FAIL: '✕',
    UNKNOWN: '?',
  };

  const labels = {
    PASS: 'Ready to Fund',
    CONDITIONAL: 'Needs Work',
    FAIL: 'Major Issues',
    UNKNOWN: 'Not Analyzed',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-2 font-semibold rounded-full
        ${sizeClasses[size]}
        ${verdictClasses[verdict]}
      `}
      title={`Verdict: ${verdict}`}
    >
      <span className="font-bold">{verdictIcons[verdict]}</span>
      {showLabel && labels[verdict]}
    </span>
  );
}
