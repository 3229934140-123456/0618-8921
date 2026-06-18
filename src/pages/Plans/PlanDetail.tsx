import { useState } from 'react';
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
  Building2,
  Star,
  ExternalLink,
  FileText,
  MessageSquare,
  User,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

export default function PlanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plans, updatePlanStatus, gifts, suppliers, quotations, reviewRecords, addReviewRecord } = useAppStore();
  const plan = plans.find((p) => p.id === id);
  const [reviewer, setReviewer] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'rejected' | 'comment'>('comment');

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

  const findGiftByName = (name: string) => gifts.find((g) => g.name === name);
  const findSupplierById = (sid: string) => suppliers.find((s) => s.id === sid);
  const findQuotationsByGiftName = (giftName: string) =>
    quotations.filter((q) => q.giftName === giftName);
  const planReviewRecords = reviewRecords.filter((r) => r.planId === plan.id);

  const getMinQuotation = (giftName: string) => {
    const qs = findQuotationsByGiftName(giftName);
    if (qs.length === 0) return null;
    return qs.reduce((min, q) => (q.unitPrice < min.unitPrice ? q : min));
  };

  const handleAddReview = () => {
    if (!reviewer || !reviewContent) return;
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    addReviewRecord({
      id: String(Date.now()),
      planId: plan.id,
      reviewer,
      time: now,
      content: reviewContent,
      status: reviewStatus,
    });
    setReviewContent('');
  };

  const handleStatusChangeWithReview = (status: PlanStatus) => {
    updatePlanStatus(plan.id, status);
    if (status === 'approved' && reviewer) {
      addReviewRecord({
        id: String(Date.now()),
        planId: plan.id,
        reviewer,
        time: new Date().toISOString().slice(0, 16).replace('T', ' '),
        content: '审核通过，礼品方案符合要求，可进入下一阶段。',
        status: 'approved',
      });
    }
    if (status === 'draft' && reviewer) {
      addReviewRecord({
        id: String(Date.now()),
        planId: plan.id,
        reviewer,
        time: new Date().toISOString().slice(0, 16).replace('T', ' '),
        content: reviewContent || '方案需要修改，请完善后重新提交。',
        status: 'rejected',
      });
    }
  };

  const reviewStatusColors: Record<string, string> = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    comment: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const reviewStatusLabels: Record<string, string> = {
    approved: '通过',
    rejected: '驳回',
    comment: '意见',
  };

  const reviewStatusIcons: Record<string, any> = {
    approved: ThumbsUp,
    rejected: ThumbsDown,
    comment: MessageSquare,
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
                <Button onClick={() => handleStatusChangeWithReview('approved')}>
                  <CheckCircle2 className="w-4 h-4" />
                  通过审核
                </Button>
                <Button variant="danger" onClick={() => handleStatusChangeWithReview('draft')}>
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

        {/* 礼品与供应商联动 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>礼品方案 & 供应商报价</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                导出方案
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {plan.gifts.length > 0 ? (
              <div className="space-y-5">
                {plan.gifts.map((gift, index) => {
                  const matchedGift = findGiftByName(gift.giftName);
                  const matchedSupplier = matchedGift ? findSupplierById(matchedGift.supplierId) : null;
                  const relatedQuotations = findQuotationsByGiftName(gift.giftName);
                  const minQuotation = getMinQuotation(gift.giftName);
                  return (
                    <div
                      key={index}
                      className="p-5 rounded-xl border border-border hover:border-primary/30 transition-all bg-gradient-to-br from-white to-bg/30"
                    >
                      <div className="flex items-start gap-5">
                        {/* 礼品图片与基本信息 */}
                        {matchedGift ? (
                          <div
                            className="w-28 h-24 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer group"
                            onClick={() => navigate(`/gifts/${matchedGift.id}`)}
                          >
                            <img
                              src={matchedGift.images[0]}
                              alt={matchedGift.name}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                          </div>
                        ) : (
                          <div className="w-28 h-24 rounded-xl bg-bg flex items-center justify-center flex-shrink-0">
                            <Gift className="w-10 h-10 text-text-light" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4
                                  className="font-semibold text-text hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-1"
                                  onClick={() => matchedGift && navigate(`/gifts/${matchedGift.id}`)}
                                >
                                  {gift.giftName}
                                  {matchedGift && <ExternalLink className="w-3.5 h-3.5 text-text-light" />}
                                </h4>
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${tierColors[gift.tier]}`}>
                                  {tierLabels[gift.tier]}
                                </span>
                                {gift.customized && (
                                  <span className="text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                                    含定制
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="text-text-light">
                                  数量：<span className="font-medium text-text">{gift.quantity} 件</span>
                                </span>
                                <span className="text-text-light">
                                  单价：<span className="font-medium text-text">{formatCurrency(gift.unitPrice)}</span>
                                </span>
                                <span className="text-text-light">
                                  小计：
                                  <span className="font-bold text-accent font-display">
                                    {formatCurrency(gift.quantity * gift.unitPrice)}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 供应商信息 */}
                          {matchedSupplier && (
                            <div className="mt-4 p-3 bg-white rounded-lg border border-border">
                              <div className="flex items-start gap-3">
                                <img
                                  src={matchedSupplier.logo}
                                  alt={matchedSupplier.name}
                                  className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <Building2 className="w-3.5 h-3.5 text-text-light" />
                                    <p
                                      className="font-medium text-text hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-1"
                                      onClick={() => navigate(`/suppliers/${matchedSupplier.id}`)}
                                    >
                                      {matchedSupplier.name}
                                      <ChevronRight className="w-3 h-3 text-text-light" />
                                    </p>
                                    <StatusBadge status={matchedSupplier.status}>
                                      {matchedSupplier.status === 'active' ? '合作中' : '已停用'}
                                    </StatusBadge>
                                  </div>
                                  <div className="flex items-center gap-3 mt-1.5 text-xs text-text-light">
                                    <span>联系人：{matchedSupplier.contactPerson}</span>
                                    <span>·</span>
                                    <span>{matchedSupplier.contactPhone}</span>
                                  </div>
                                  <div className="flex items-center gap-0.5 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${
                                          i < Math.floor(matchedSupplier.rating)
                                            ? 'text-amber-400 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                    <span className="text-xs text-text-light ml-1">{matchedSupplier.rating}</span>
                                  </div>
                                </div>
                                {relatedQuotations.length > 0 && (
                                  <div className="ml-4 pl-4 border-l border-border text-right">
                                    <p className="text-xs text-text-light">报价方案</p>
                                    <p className="text-xs text-text mt-0.5">
                                      共 <span className="font-medium text-primary">{relatedQuotations.length}</span> 家
                                    </p>
                                    {minQuotation && (
                                      <div className="mt-1.5 p-1.5 bg-emerald-50 rounded text-right">
                                        <p className="text-xs text-emerald-700">
                                          最低报价
                                          <span className="font-bold ml-1">
                                            {formatCurrency(minQuotation.unitPrice)}
                                          </span>
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* 相关报价列表 */}
                          {relatedQuotations.length > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center gap-1.5 mb-2">
                                <FileText className="w-3.5 h-3.5 text-text-light" />
                                <p className="text-xs font-medium text-text-light">供应商报价对比</p>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {relatedQuotations.slice(0, 4).map((q) => {
                                  const isMin = minQuotation?.id === q.id;
                                  return (
                                    <div
                                      key={q.id}
                                      className={`p-2.5 rounded-lg border flex items-center justify-between ${
                                        isMin
                                          ? 'border-emerald-200 bg-emerald-50/50'
                                          : 'border-border bg-white'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-text">{q.supplierName}</span>
                                        {isMin && (
                                          <span className="inline-flex items-center px-1.5 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-medium">
                                            最优
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-right">
                                        <p className="text-xs font-bold text-accent font-display">
                                          {formatCurrency(q.unitPrice)}
                                        </p>
                                        <p className="text-[10px] text-text-light">
                                          {q.deliveryDays}天交付 · 起订{q.minOrderQty}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-5 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-light">方案合计</p>
                    <p className="text-xs text-text-light mt-0.5">共 {plan.gifts.length} 个礼品方案</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent font-display">
                      {formatCurrency(plan.gifts.reduce((sum, g) => sum + g.quantity * g.unitPrice, 0))}
                    </p>
                    <p className="text-xs text-text-light mt-0.5">
                      预算 {formatCurrency(plan.budget)} · 超支预警
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-text-light">
                暂未分配礼品，请在创建计划时选择礼品方案
              </div>
            )}
          </CardContent>
        </Card>

        {/* 审核意见 */}
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <CardTitle>审核意见</CardTitle>
                  <span className="text-xs text-text-light">共 {planReviewRecords.length} 条</span>
                </div>
              </CardHeader>
              <CardContent>
                {planReviewRecords.length > 0 ? (
                  <div className="space-y-4">
                    {planReviewRecords.map((r) => {
                      const Icon = reviewStatusIcons[r.status];
                      return (
                        <div key={r.id} className="flex gap-4 p-4 bg-bg rounded-xl">
                          <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-text-light" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-text">{r.reviewer}</p>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${reviewStatusColors[r.status]}`}
                              >
                                <Icon className="w-3 h-3" />
                                {reviewStatusLabels[r.status]}
                              </span>
                              <p className="text-xs text-text-light ml-auto">{r.time}</p>
                            </div>
                            <p className="text-sm text-text mt-2 leading-relaxed">{r.content}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <AlertCircle className="w-10 h-10 text-text-light mx-auto mb-3" />
                    <p className="text-text-light">暂无审核意见</p>
                    <p className="text-xs text-text-light mt-1">提交审核后可在此查看审批记录</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>添加意见</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">审核人</label>
                  <input
                    type="text"
                    value={reviewer}
                    onChange={(e) => setReviewer(e.target.value)}
                    placeholder="请输入审核人姓名"
                    className="w-full h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">意见类型</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['comment', 'approved', 'rejected'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setReviewStatus(st)}
                        className={`py-2 rounded-lg text-sm font-medium transition-all border ${
                          reviewStatus === st
                            ? reviewStatusColors[st]
                            : 'bg-white text-text-light border-border hover:border-primary/30'
                        }`}
                      >
                        {reviewStatusLabels[st]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">意见内容</label>
                  <textarea
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="请输入审核意见..."
                    rows={4}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleAddReview}
                  disabled={!reviewer || !reviewContent}
                >
                  <MessageSquare className="w-4 h-4" />
                  提交意见
                </Button>
              </CardContent>
            </Card>

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
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
