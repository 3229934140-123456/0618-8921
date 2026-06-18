import { cn } from '../../utils';

type StatusType = 
  | 'draft' 
  | 'pending' 
  | 'approved' 
  | 'shipping' 
  | 'completed' 
  | 'rejected'
  | 'in_transit'
  | 'delivered'
  | 'exception'
  | 'shipped'
  | 'active'
  | 'inactive'
  | 'standard'
  | 'premium'
  | 'luxury'
  | 'A'
  | 'B'
  | 'C'
  | 'high'
  | 'medium'
  | 'low';

const statusStyles: Record<StatusType, string> = {
  draft: 'bg-gray-100 text-gray-600',
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  shipping: 'bg-blue-50 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
  in_transit: 'bg-blue-50 text-blue-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  exception: 'bg-red-50 text-red-700',
  shipped: 'bg-blue-50 text-blue-700',
  active: 'bg-emerald-50 text-emerald-700',
  inactive: 'bg-gray-100 text-gray-600',
  standard: 'bg-sky-50 text-sky-700',
  premium: 'bg-violet-50 text-violet-700',
  luxury: 'bg-amber-50 text-amber-700',
  A: 'bg-red-50 text-red-700',
  B: 'bg-amber-50 text-amber-700',
  C: 'bg-gray-100 text-gray-600',
  high: 'bg-red-50 text-red-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-gray-100 text-gray-600',
};

const statusLabels: Record<StatusType, string> = {
  draft: '草稿',
  pending: '待审核',
  approved: '已通过',
  shipping: '发货中',
  completed: '已完成',
  rejected: '已驳回',
  in_transit: '运输中',
  delivered: '已签收',
  exception: '异常',
  shipped: '已发货',
  active: '合作中',
  inactive: '已停用',
  standard: '标准档',
  premium: '高级档',
  luxury: '尊享档',
  A: 'A级',
  B: 'B级',
  C: 'C级',
  high: '高',
  medium: '中',
  low: '低',
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  children?: React.ReactNode;
}

export function StatusBadge({ status, className, children }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusStyles[status],
        className
      )}
    >
      {children || statusLabels[status]}
    </span>
  );
}
