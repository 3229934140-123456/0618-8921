import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAppStore } from '../../store';
import { formatCurrency, formatDate } from '../../utils';
import { PlanStatus, PlanGift } from '../../types';
import {
  ArrowLeft,
  CalendarDays,
  Users,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Gift,
  Download,
} from 'lucide-react';

export default function PlanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plans, updatePlanStatus } = useAppStore();
  const plan = plans.find((p) => p.id === id);

  if (!plan) {
    return (
      <PageContainer title="计划不存在" subtitle="">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-text-light">未找到该采购计划</p>
            <Button className="mt-4" onClick={() => navigate('/plans')}>
              返回列表
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const tierLabels: Record<string, string> = {
    standard: '标准档',
    premium: '高级档',
    luxury: '尊享档',
  };

  const tierColors: Record<string, string> = {
    standard: 'bg-sky-50 text-sky-700 border-sky-200',
    premium: 'bg-violet-50 text-violet-700 border-violet-200',
    luxury: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <PageContainer title={plan.name} subtitle={plan.description}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/plans')}>
            <ArrowLeft className="w-4 h-4" />
            返回列表
          </Button>
          <div className="flex items-center gap-3">
            {plan.status === 'draft' && (
              <Button onClick={() => updatePlanStatus(plan.id, 'pending')}>
                提交审核
              </Button>
            )}
            {plan.status === 'pending' && (
              <>
                <Button onClick={() => updatePlanStatus(plan.id, 'approved')}>
                  <CheckCircle2 className="w-4 h-4" />
                  通过审核
                </Button>
                <Button variant="danger" onClick={() => updatePlanStatus(plan.id, 'draft')}>
                  <XCircle className="w-4 h-4" />
                  驳回
                </Button>
              </>
            )}
            {plan.status === 'approved' && (
              <Button onClick={() => updatePlanStatus(plan.id, 'shipping')}>
                开始发货
              </Button>
            )}
            {plan.status === 'shipping' && (
              <Button onClick={() => updatePlanStatus(plan.id, 'completed')}>
                <CheckCircle2 className="w-4 h-4" />
                标记完成
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-text-light">节日</p>
                <p className="text-lg font-semibold text-text">{plan.festival}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-text-light">预算/实际</p>
                <p className="text-lg font-semibold text-text font-display">
                  {formatCurrency(plan.budget)}
                </p>
                <p className="text-sm text-accent font-display">
                  {plan.actualCost > 0 ? formatCurrency(plan.actualCost) : '待结算'}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-text-light">覆盖员工</p>
                <p className="text-lg font-semibold text-text">{plan.employeeCount} 人</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-text-light">当前状态</p>
                <StatusBadge status={plan.status as PlanStatus} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>执行进度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {['draft', 'pending', 'approved', 'shipping', 'completed'].map((step, i) => {
                const currentIdx = ['draft', 'pending', 'approved', 'shipping', 'completed'].indexOf(plan.status);
                const isActive = i <= currentIdx;
                const stepLabels = ['草稿', '待审核', '已通过', '发货中', '已完成'];
                return (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-bg text-text-light border border-border'
                        }`}
                      >
                        {isActive ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </div>
                      <p className={`text-xs mt-2 ${isActive ? 'text-primary font-medium' : 'text-text-light'}`}>
                        {stepLabels[i]}
                      </p>
                    </div>
                    {i < 4 && (
                      <div className={`h-0.5 flex-1 mx-1 ${i < currentIdx ? 'bg-primary' : 'bg-border'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>礼品档位分配</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                导出分配表
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {plan.gifts.length > 0 ? (
              <div className="space-y-4">
                {plan.gifts.map((gift, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-border hover:border-primary/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <Gift className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-text">{gift.giftName}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${tierColors[gift.tier]}`}>
                              {tierLabels[gift.tier]}
                            </span>
                            <span className="text-sm text-text-light">
                              数量：{gift.quantity} 件
                            </span>
                            <span className="text-sm text-text-light">
                              单价：{formatCurrency(gift.unitPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-accent font-display">
                          {formatCurrency(gift.quantity * gift.unitPrice)}
                        </p>
                        {gift.customized && (
                          <span className="text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded mt-1 inline-block">
                            含定制
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-text-light">合计</span>
                  <span className="text-xl font-bold text-accent font-display">
                    {formatCurrency(plan.gifts.reduce((sum, g) => sum + g.quantity * g.unitPrice, 0))}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-text-light">
                暂未分配礼品，请在创建计划时选择礼品方案
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                {[
                  { label: '计划名称', value: plan.name },
                  { label: '节日', value: plan.festival },
                  { label: '预算金额', value: formatCurrency(plan.budget) },
                  { label: '实际花费', value: plan.actualCost > 0 ? formatCurrency(plan.actualCost) : '待结算' },
                  { label: '创建时间', value: formatDate(plan.createdAt) },
                  { label: '截止日期', value: formatDate(plan.deadline) },
                  { label: '覆盖人数', value: `${plan.employeeCount} 人` },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <dt className="text-sm text-text-light">{item.label}</dt>
                    <dd className="text-sm font-medium text-text">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>计划描述</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text leading-relaxed">{plan.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
