import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconBgColor?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function DashboardCard({
  title,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-primary/10',
  children,
  className,
  headerAction,
}: DashboardCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-xl p-5', className)}>
      {title && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', iconBgColor)}>
                <Icon className="w-5 h-5 text-primary" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          {headerAction}
        </div>
      )}
      {children}
    </div>
  );
}
