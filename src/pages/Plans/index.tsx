import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { useAppStore } from '../../store';
import { formatCurrency, formatDate } from '../../utils';
import { PlanStatus } from '../../types';
import {
  Plus,
  Search,
  Filter,
  CalendarDays,
  MoreHorizontal,
  Eye,
  Edit,
} from 'lucide-react';

const statusFilters = [
  { value: 'all', label: '全部状态' },
  { value: 'draft', label: '草稿' },
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已通过' },
  { value: 'shipping', label: '发货中' },
  { value: 'completed', label: '已完成' },
];

const festivalOptions = ['春节', '元宵节', '妇女节', '劳动节', '端午节', '中秋节', '国庆节', '圣诞节', '周年庆'];
const giftOptions = [
  { id: 'g1', name: '端午臻品粽子礼盒', price: 268 },
  { id: 'g2', name: '中秋明月月饼礼盒', price: 398 },
  { id: 'g3', name: '定制logo保温杯', price: 89 },
  { id: 'g4', name: '星巴克电子礼品卡', price: 500 },
  { id: 'g5', name: '精美护肤套装', price: 298 },
  { id: 'g6', name: '周年定制金箔徽章', price: 158 },
  { id: 'g7', name: '京东E卡', price: 300 },
  { id: 'g8', name: '春节坚果大礼包', price: 198 },
];

export default function Plans() {
  const navigate = useNavigate();
  const { plans, addPlan } = useAppStore();
  const [statusFilter, setStatusFilter] = useState('all');
  const [festivalFilter, setFestivalFilter] = useState('全部');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formName, setFormName] = useState('');
  const [formFestival, setFormFestival] = useState('春节');
  const [formBudget, setFormBudget] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formGifts, setFormGifts] = useState<Array<{ giftId: string; giftName: string; tier: 'standard' | 'premium' | 'luxury'; quantity: number; unitPrice: number; customized: boolean }>>([]);

  const filteredPlans = plans.filter((plan) => {
    const matchStatus = statusFilter === 'all' || plan.status === statusFilter;
    const matchFestival = festivalFilter === '全部' || plan.festival === festivalFilter;
    const matchSearch = plan.name.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchStatus && matchFestival && matchSearch;
  });

  const resetForm = () => {
    setFormName('');
    setFormFestival('春节');
    setFormBudget('');
    setFormDeadline('');
    setFormDesc('');
    setFormGifts([]);
  };

  const handleCreate = () => {
    if (!formName || !formBudget || !formDeadline) return;
    const newPlan = {
      id: `plan_${Date.now()}`,
      name: formName,
      festival: formFestival,
      status: 'draft' as PlanStatus,
      budget: Number(formBudget),
      actualCost: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      deadline: formDeadline,
      description: formDesc,
      gifts: formGifts,
      employeeCount: formGifts.reduce((s, g) => s + g.quantity, 0),
      progress: 5,
    };
    addPlan(newPlan);
    resetForm();
    setShowCreateModal(false);
  };

  const addGiftToForm = (giftId: string) => {
    const g = giftOptions.find((o) => o.id === giftId);
    if (!g) return;
    if (formGifts.find((f) => f.giftId === giftId)) return;
    setFormGifts([
      ...formGifts,
      { giftId: g.id, giftName: g.name, tier: 'standard', quantity: 50, unitPrice: g.price, customized: false },
    ]);
  };

  const removeGiftFromForm = (giftId: string) => {
    setFormGifts(formGifts.filter((g) => g.giftId !== giftId));
  };

  const updateFormGift = (giftId: string, field: string, value: any) => {
    setFormGifts(
      formGifts.map((g) => (g.giftId === giftId ? { ...g, [field]: value } : g))
    );
  };

  return (
    <PageContainer title="采购计划" subtitle="管理企业节日礼品采购计划">
      <div className="space-y-6">
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
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                  <select
                    value={festivalFilter}
                    onChange={(e) => setFestivalFilter(e.target.value)}
                    className="h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {['全部', ...festivalOptions].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4" />
                新建采购计划
              </Button>
            </div>
          </CardContent>
        </Card>

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
                        <span className="px-2 py-0.5 bg-bg rounded text-xs text-text-light">{plan.festival}</span>
                      </div>
                      <p className="text-sm text-text-light mt-1 line-clamp-1">{plan.description}</p>
                      <div className="flex items-center gap-6 mt-3">
                        <div>
                          <p className="text-xs text-text-light">预算金额</p>
                          <p className="text-base font-semibold text-text font-display">{formatCurrency(plan.budget)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-light">实际花费</p>
                          <p className="text-base font-semibold text-accent font-display">
                            {plan.actualCost > 0 ? formatCurrency(plan.actualCost) : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-text-light">员工人数</p>
                          <p className="text-base font-semibold text-text font-display">{plan.employeeCount} 人</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-light">截止日期</p>
                          <p className="text-sm text-text">{formatDate(plan.deadline)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
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
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/plans/${plan.id}`); }}>
                      <Eye className="w-4 h-4" /> 查看详情
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredPlans.length === 0 && (
            <Card><CardContent className="py-16 text-center"><p className="text-text-light">暂无匹配的采购计划</p></CardContent></Card>
          )}
        </div>
      </div>

      <Modal open={showCreateModal} onClose={() => { resetForm(); setShowCreateModal(false); }} title="新建采购计划" width="max-w-2xl">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">计划名称 *</label>
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                className="w-full h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="如：2024年中秋礼品采购" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">节日 *</label>
              <select value={formFestival} onChange={(e) => setFormFestival(e.target.value)}
                className="w-full h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20">
                {festivalOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">预算金额（元）*</label>
              <input type="number" value={formBudget} onChange={(e) => setFormBudget(e.target.value)}
                className="w-full h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="请输入预算金额" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">截止日期 *</label>
              <input type="date" value={formDeadline} onChange={(e) => setFormDeadline(e.target.value)}
                className="w-full h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">计划描述</label>
            <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={3}
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="描述计划内容..." />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-text">礼品档位分配</label>
              <select
                className="h-8 px-2 bg-bg border border-border rounded-lg text-xs text-text focus:outline-none"
                value=""
                onChange={(e) => { if (e.target.value) addGiftToForm(e.target.value); }}
              >
                <option value="">+ 添加礼品</option>
                {giftOptions.map((g) => (
                  <option key={g.id} value={g.id}>{g.name} - ¥{g.price}</option>
                ))}
              </select>
            </div>
            {formGifts.length > 0 ? (
              <div className="space-y-3">
                {formGifts.map((gift) => (
                  <div key={gift.giftId} className="p-3 rounded-lg border border-border bg-bg/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text">{gift.giftName}</span>
                      <button onClick={() => removeGiftFromForm(gift.giftId)} className="text-xs text-red-500 hover:text-red-700">移除</button>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-text-light mb-1">档位</label>
                        <select value={gift.tier} onChange={(e) => updateFormGift(gift.giftId, 'tier', e.target.value)}
                          className="w-full h-8 px-2 bg-white border border-border rounded text-xs text-text focus:outline-none">
                          <option value="standard">标准档</option>
                          <option value="premium">高级档</option>
                          <option value="luxury">尊享档</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-text-light mb-1">数量</label>
                        <input type="number" value={gift.quantity}
                          onChange={(e) => updateFormGift(gift.giftId, 'quantity', Number(e.target.value))}
                          className="w-full h-8 px-2 bg-white border border-border rounded text-xs text-text focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-text-light mb-1">单价</label>
                        <input type="number" value={gift.unitPrice}
                          onChange={(e) => updateFormGift(gift.giftId, 'unitPrice', Number(e.target.value))}
                          className="w-full h-8 px-2 bg-white border border-border rounded text-xs text-text focus:outline-none" />
                      </div>
                      <div className="flex items-end gap-2">
                        <label className="flex items-center gap-1.5 text-xs text-text-light">
                          <input type="checkbox" checked={gift.customized}
                            onChange={(e) => updateFormGift(gift.giftId, 'customized', e.target.checked)} />
                          定制
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-border text-right">
                  <span className="text-sm text-text-light">合计：</span>
                  <span className="text-lg font-bold text-accent font-display">
                    {formatCurrency(formGifts.reduce((s, g) => s + g.quantity * g.unitPrice, 0))}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-light text-center py-4">请从上方下拉添加礼品</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => { resetForm(); setShowCreateModal(false); }}>取消</Button>
            <Button onClick={handleCreate} disabled={!formName || !formBudget || !formDeadline}>创建计划</Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
