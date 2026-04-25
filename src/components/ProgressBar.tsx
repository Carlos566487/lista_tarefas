interface ProgressBarProps {
  percentage: number;
}

export function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-secondary">Progresso Total</span>
        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-3 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden glass-panel border-none shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out shadow-lg"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
