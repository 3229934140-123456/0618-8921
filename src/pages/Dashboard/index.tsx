import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../store';
import { formatCurrency, formatDate } from '../../utils';
import {
  TrendingUp,
  Package,
  Clock,
  AlertTriangle,
  ChevronRight,
  Gift,
  CalendarDays,
  UserCheck,
  Plus,
  FileEdit,
  Truck,
  Boxes,
  Palette,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PlanStatus } from '../../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { plans, festivals, todos, inventory, customers } = useAppStore();

  const stats = [
    {
      label: '年度采购金额',
      value: formatCurrency(plans.reduce((s, p) => s + p.budget, 0)),
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: '进行中计划',
      value: String(plans.filter((p) => p.status !== 'completed').length),
      change: '+2',
      trend: 'up',
      icon: Package,
      color: 'from-violet-500 to-violet-600',
    },
    {
      label: '待处理事项',
      value: String(todos.filter((t) => t.status === 'pending').length),
      change: '-3',
      trend: 'down',
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
    },
    {
      label: '库存预警',
      value: String(inventory.filter((i) => i.quantity < i.minThreshold).length),
      change: '+1',
      trend: 'up',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <PageContainer title="工作台" subtitle="欢迎回来，今天是美好的一天">
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <Card key={index} hoverable>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-text-light">{stat.label}</p>
                    <p className="text-2xl font-bold text-text mt-2 font-display">{stat.value}</p>
                    <p className={`text-xs mt-2 ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {stat.change} 较上月
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>节日倒计时</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/plans')}>
                  <Plus className="w-4 h-4" />
                  创建采购计划
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {festivals.slice(0, 4).map((festival) => (
                  <div
                    key={festival.id}
                    className={`relative p-5 rounded-xl text-center transition-all duration-300 hover:scale-105 cursor-pointer ${
                      festival.daysLeft <= 7
                        ? 'bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200'
                        : 'bg-bg border border-border'
                    }`}
                    onClick={() => navigate('/plans')}
                  >
                    <div className="text-3xl mb-2">{festival.icon}</div>
                    <p className="font-medium text-text">{festival.name}</p>
                    <div className="mt-3">
                      <span className={`text-3xl font-bold font-display ${
                        festival.daysLeft <= 7 ? 'text-amber-600' : 'text-primary'
                      }`}>
                        {festival.daysLeft}
                      </span>
                      <span className="text-sm text-text-light ml-1">天</span>
                    </div>
                    <p className="text-xs text-text-light mt-1">{formatDate(festival.date)}</p>
                    {festival.daysLeft <= 7 && (
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-danger text-white text-xs rounded-full">
                        临近
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>待办事项</CardTitle>
                <span className="text-xs text-text-light">{todos.filter(t => t.status === 'pending').length} 项待处理</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-3">
                {todos.slice(0, 5).map((todo) => {
                  const iconMap: Record<string, typeof FileEdit> = {
                    plan: FileEdit,
                    design: Palette,
                    delivery: Truck,
                    inventory: Boxes,
                  };
                  const Icon = iconMap[todo.type] || FileEdit;
                  return (
                    <li key={todo.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-bg transition-colors cursor-pointer group">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        todo.priority === 'high' ? 'bg-red-50 text-red-500' :
                        todo.priority === 'medium' ? 'bg-amber-50 text-amber-500' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate group-hover:text-primary transition-colors">{todo.title}</p>
                        <p className="text-xs text-text-light mt-0.5">截止：{formatDate(todo.deadline)}</p>
                      </div>
                      <StatusBadge status={todo.priority as any} />
                    </li>
                  );
                })}
              </ul>
              <button className="w-full mt-4 py-2 text-sm text-primary hover:text-primary-light transition-colors flex items-center justify-center gap-1">
                查看全部 <ChevronRight className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>最近采购计划</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/plans')}>
                  查看全部 <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {plans.slice(0, 4).map((plan) => (
                  <div
                    key={plan.id}
                    className="p-4 rounded-lg border border-border hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group"
                    onClick={() => navigate(`/plans/${plan.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <CalendarDays className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-text group-hover:text-primary transition-colors">{plan.name}</h4>
                          <p className="text-xs text-text-light mt-0.5">
                            {plan.festival} · {plan.employeeCount}人 · 预算{formatCurrency(plan.budget)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={plan.status as PlanStatus} />
                        <p className="text-xs text-text-light mt-1">{formatDate(plan.deadline)} 截止</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-text-light">执行进度</span>
                        <span className="font-medium text-text">{plan.progress}%</span>
                      </div>
                      <div className="h-2 bg-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                          style={{ width: `${plan.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Plus, label: '新建计划', path: '/plans' },
                    { icon: Gift, label: '礼品库', path: '/gifts' },
                    { icon: UserCheck, label: '客户送礼', path: '/customers' },
                    { icon: Boxes, label: '库存管理', path: '/inventory' },
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(item.path)}
                      className="flex flex-col items-center justify-center p-4 rounded-lg bg-bg hover:bg-primary/5 hover:text-primary transition-all duration-200 text-text-light hover:text-primary group"
                    >
                      <item.icon className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>库存预警</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3">
                  {inventory.filter(item => item.quantity < item.minThreshold).map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg transition-colors cursor-pointer"
                      onClick={() => navigate('/inventory')}
                    >
                      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">{item.giftName}</p>
                        <p className="text-xs text-text-light">现有 {item.quantity} 件 · 阈值 {item.minThreshold} 件</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>近期客户生日/重要日期</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/customers')}>
                查看全部客户 <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-4 gap-4">
              {customers.slice(0, 4).map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg transition-colors cursor-pointer group"
                  onClick={() => navigate(`/customers/${customer.id}`)}
                >
                  <img src={customer.avatar} alt={customer.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-text truncate group-hover:text-primary transition-colors">{customer.name}</p>
                      <StatusBadge status={customer.level as any} />
                    </div>
                    <p className="text-xs text-text-light truncate">{customer.company}</p>
                    <p className="text-xs text-accent mt-1">🎂 {customer.birthday}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
