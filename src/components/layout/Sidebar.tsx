import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarClock,
  Gift,
  Palette,
  Users,
  Truck,
  UserCheck,
  Building2,
  Package,
  BarChart3,
} from 'lucide-react';
import { cn } from '../../utils';

const navItems = [
  { path: '/', label: '工作台', icon: LayoutDashboard },
  { path: '/plans', label: '采购计划', icon: CalendarClock },
  { path: '/gifts', label: '礼品方案库', icon: Gift },
  { path: '/customize', label: '定制设计', icon: Palette },
  { path: '/employees', label: '员工地址', icon: Users },
  { path: '/logistics', label: '物流追踪', icon: Truck },
  { path: '/customers', label: '客户礼品', icon: UserCheck },
  { path: '/suppliers', label: '供应商', icon: Building2 },
  { path: '/inventory', label: '库存管理', icon: Package },
  { path: '/reports', label: '数据报表', icon: BarChart3 },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-gradient-to-b from-primary to-primary-light text-white flex flex-col transition-all duration-300 z-30',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className={cn('h-16 flex items-center border-b border-white/10', collapsed ? 'justify-center px-2' : 'px-6')}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-white text-lg font-bold font-display flex-shrink-0">
            礼
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-base font-display">礼享采购</span>
              <span className="text-xs text-white/60">企业礼品管理平台</span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                    collapsed && 'justify-center px-2',
                    isActive
                      ? 'bg-accent text-white shadow-lg shadow-accent/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn('w-5 h-5 flex-shrink-0 transition-transform', collapsed ? '' : 'group-hover:scale-110')} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={cn('border-t border-white/10 p-4', collapsed && 'px-2')}>
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium">管</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">管理员</p>
              <p className="text-xs text-white/60 truncate">admin@company.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
