interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-12 w-12'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="spinner"></div>
    </div>
  )
} 