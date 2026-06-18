import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { mockPlans, festivals } from '../../data/mockPlans';
import { formatCurrency, formatDate } from '../../utils';
import {
  Plus,
  Search,
  Filter,
  CalendarDays,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { PlanStatus } from '../../types';

const statusFilters: { value: string; label: string }[] = [
  { value: 'all', label: '全部状态' },
  { value: 'draft', label: '草稿' },
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已通过' },
  { value: 'shipping', label: '发货中' },
  { value: 'completed', label: '已完成' },
];

export default function Plans() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [festivalFilter, setFestivalFilter] = useState<string>('全部');
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredPlans = mockPlans.filter((plan) => {
    const matchStatus = statusFilter === 'all' || plan.status === statusFilter;
    const matchFestival = festivalFilter === '全部' || plan.festival === festivalFilter;
    const matchSearch = plan.name.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchStatus && matchFestival && matchSearch;
  });

  return (
    <PageContainer title="采购计划" subtitle="管理企业节日礼品采购计划">
      <div className="space-y-6">
        {/* 操作栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                  <input
                    type="text"
                    placeholder="搜索计划名称..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-64 h-10 pl-9 pr-4 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-text-light" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {statusFilters.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={festivalFilter}
                    onChange={(e) => setFestivalFilter(e.target.value)}
                    className="h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {festivals.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button onClick={() => navigate('/plans/create')}>
                <Plus className="w-4 h-4" />
                新建采购计划
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 计划列表 */}
        <div className="space-y-4">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} hoverable onClick={() => navigate(`/plans/${plan.id}`)}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-text font-display hover:text-primary transition-colors">
                          {plan.name}
                        </h3>
                        <StatusBadge status={plan.status as PlanStatus} />
                        <span className="px-2 py-0.5 bg-bg rounded text-xs text-text-light">
                          {plan.festival}
                        </span>
                      </div>

                      <p className="text-sm text-text-light mt-1 line-clamp-1">
                        {plan.description}
                      </p>

                      <div className="flex items-center gap-6 mt-3">
                        <div>
                          <p className="text-xs text-text-light">预算金额</p>
                          <p className="text-base font-semibold text-text font-display">
                            {formatCurrency(plan.budget)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-text-light">实际花费</p>
                          <p className="text-base font-semibold text-accent font-display">
                            {plan.actualCost > 0 ? formatCurrency(plan.actualCost) : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-text-light">员工人数</p>
                          <p className="text-base font-semibold text-text font-display">
                            {plan.employeeCount} 人
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-text-light">创建时间</p>
                          <p className="text-sm text-text">{formatDate(plan.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-light">截止日期</p>
                          <p className="text-sm text-text">{formatDate(plan.deadline)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <button
                      className="p-2 rounded-lg text-text-light hover:text-text hover:bg-bg transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>

                    <div className="w-40">
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

                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/plans/${plan.id}`);
                      }}>
                        <Eye className="w-4 h-4" />
                        查看
                      </Button>
                      <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                        <Edit className="w-4 h-4" />
                        编辑
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPlans.length === 0 && (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-text-light">暂无匹配的采购计划</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
