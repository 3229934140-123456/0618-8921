import { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { useAppStore } from '../../store';
import { formatDate } from '../../utils';
import {
  Search,
  Package,
  TrendingDown,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  PackageCheck,
  Users,
} from 'lucide-react';

export default function Inventory() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<'stock' | 'records' | 'unclaimed'>('stock');
  const [stockModalType, setStockModalType] = useState<'in' | 'out' | null>(null);
  const [selectedGiftId, setSelectedGiftId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [operator, setOperator] = useState('');
  const [reason, setReason] = useState('');
  const [toast, setToast] = useState('');

  const inventory = useAppStore((s) => s.inventory);
  const stockRecords = useAppStore((s) => s.stockRecords);
  const unclaimedList = useAppStore((s) => s.unclaimedList);
  const addStockRecord = useAppStore((s) => s.addStockRecord);
  const remindUnclaimed = useAppStore((s) => s.remindUnclaimed);
  const remindSingleUnclaimed = useAppStore((s) => s.remindSingleUnclaimed);

  const filteredItems = inventory.filter((item) =>
    item.giftName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const lowStockItems = inventory.filter((item) => item.quantity < item.minThreshold);

  const totalValue = inventory.reduce((sum, item) => sum + item.quantity * 50, 0);

  const selectedGift = inventory.find((i) => i.giftId === selectedGiftId);

  const openStockModal = (type: 'in' | 'out') => {
    setStockModalType(type);
    setSelectedGiftId('');
    setQuantity('');
    setOperator('');
    setReason('');
  };

  const closeStockModal = () => {
    setStockModalType(null);
  };

  const handleSubmitStock = () => {
    if (!selectedGiftId || !quantity || !operator || !reason) return;
    addStockRecord({
      id: String(Date.now()),
      type: stockModalType!,
      giftId: selectedGiftId,
      giftName: selectedGift?.giftName ?? '',
      quantity: Number(quantity),
      operator,
      reason,
      time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    closeStockModal();
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleBatchRemind = () => {
    const unremindedIds = unclaimedList.filter(u => !u.reminded).map(u => u.id);
    if (unremindedIds.length === 0) {
      showToast('所有员工均已提醒过');
      return;
    }
    const reminded = remindUnclaimed(unremindedIds);
    showToast(`已向 ${reminded.length} 名员工发送领取提醒`);
  };

  const handleSingleRemind = (id: string, name: string) => {
    remindSingleUnclaimed(id);
    showToast(`已向 ${name} 发送领取提醒`);
  };

  return (
    <PageContainer title="库存管理" subtitle="礼品库存管理与领取发放追踪">
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-5">
          {[
            { label: '库存总SKU', value: inventory.length, icon: Package, color: 'from-blue-500 to-blue-600' },
            { label: '库存总金额', value: `¥${totalValue.toLocaleString()}`, icon: TrendingDown, color: 'from-violet-500 to-purple-500' },
            { label: '预警商品', value: lowStockItems.length, icon: AlertTriangle, color: 'from-amber-500 to-orange-500' },
            { label: '本月出库', value: '325件', icon: ArrowUpFromLine, color: 'from-emerald-500 to-green-500' },
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-light">{stat.label}</p>
                    <p className="text-2xl font-bold text-text mt-2 font-display">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'stock'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-text-light hover:text-text hover:bg-bg'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            库存列表
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'records'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-text-light hover:text-text hover:bg-bg'
            }`}
          >
            <ArrowDownToLine className="w-4 h-4 inline mr-2" />
            出入库记录
          </button>
          <button
            onClick={() => setActiveTab('unclaimed')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'unclaimed'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-text-light hover:text-text hover:bg-bg'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            未领取名单
          </button>
        </div>

        {activeTab === 'stock' && (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                    <input
                      type="text"
                      placeholder="搜索礼品名称..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-64 h-10 pl-9 pr-4 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => openStockModal('in')}>
                      <ArrowDownToLine className="w-4 h-4" />
                      入库登记
                    </Button>
                    <Button onClick={() => openStockModal('out')}>
                      <ArrowUpFromLine className="w-4 h-4" />
                      出库登记
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-bg/50">
                      <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                        礼品信息
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                        当前库存
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                        预警阈值
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                        库存状态
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                        存放位置
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                        最后更新
                      </th>
                      <th className="text-right py-3 px-5 text-xs font-medium text-text-light">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-bg/30 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.giftImage}
                              alt={item.giftName}
                              className="w-12 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-text">{item.giftName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span className={`text-lg font-semibold font-display ${
                            item.quantity < item.minThreshold ? 'text-red-500' : 'text-text'
                          }`}>
                            {item.quantity} 件
                          </span>
                        </td>
                        <td className="py-4 px-5 text-sm text-text-light">
                          {item.minThreshold} 件
                        </td>
                        <td className="py-4 px-5">
                          {item.quantity < item.minThreshold ? (
                            <StatusBadge status="exception">库存不足</StatusBadge>
                          ) : (
                            <StatusBadge status="active">正常</StatusBadge>
                          )}
                        </td>
                        <td className="py-4 px-5 text-sm text-text">{item.location}</td>
                        <td className="py-4 px-5 text-sm text-text-light">
                          {formatDate(item.lastUpdated)}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <Button variant="ghost" size="sm">详情</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'records' && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-bg/50">
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                      时间
                    </th>
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                      类型
                    </th>
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                      礼品名称
                    </th>
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                      数量
                    </th>
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                      操作人
                    </th>
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                      事由
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stockRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-bg/30 transition-colors">
                      <td className="py-4 px-5 text-sm text-text-light">
                        {record.time}
                      </td>
                      <td className="py-4 px-5">
                        {record.type === 'in' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                            <ArrowDownToLine className="w-3 h-3" />
                            入库
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                            <ArrowUpFromLine className="w-3 h-3" />
                            出库
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 font-medium text-text">{record.giftName}</td>
                      <td className="py-4 px-5 text-text">
                        {record.type === 'in' ? '+' : '-'}{record.quantity} 件
                      </td>
                      <td className="py-4 px-5 text-sm text-text-light">{record.operator}</td>
                      <td className="py-4 px-5 text-sm text-text-light">{record.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'unclaimed' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>端午节礼品未领取名单</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    导出名单
                  </Button>
                  <Button onClick={handleBatchRemind}>
                    <PackageCheck className="w-4 h-4" />
                    批量提醒
                  </Button>
                </div>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-bg/50">
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                      员工
                    </th>
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                      部门
                    </th>
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                      礼品名称
                    </th>
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                      档位
                    </th>
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                      发放日期
                    </th>
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                      未领取原因
                    </th>
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                      提醒状态
                    </th>
                    <th className="text-center py-3 px-5 text-xs font-medium text-text-light">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {unclaimedList.map((item, index) => (
                    <tr key={item.id} className="hover:bg-bg/30 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://i.pravatar.cc/40?img=${index + 10}`}
                            alt={item.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="font-medium text-text">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-sm text-text">{item.dept}</td>
                      <td className="py-4 px-5 text-sm text-text">{item.gift}</td>
                      <td className="py-4 px-5">
                        <StatusBadge status={item.tier as any} />
                      </td>
                      <td className="py-4 px-5 text-sm text-text-light">{item.date}</td>
                      <td className="py-4 px-5 text-sm text-text-light">{item.reason}</td>
                      <td className="py-4 px-5">
                        {item.reminded ? (
                          <div>
                            <StatusBadge status="active">已提醒</StatusBadge>
                            <p className="text-xs text-text-light mt-1">{item.remindTime}</p>
                          </div>
                        ) : (
                          <StatusBadge status="inactive">未提醒</StatusBadge>
                        )}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSingleRemind(item.id, item.name)}
                          disabled={item.reminded}
                        >
                          {item.reminded ? '已提醒' : '发送提醒'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <Modal
        open={stockModalType !== null}
        onClose={closeStockModal}
        title={stockModalType === 'in' ? '入库登记' : '出库登记'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">礼品</label>
            <select
              value={selectedGiftId}
              onChange={(e) => setSelectedGiftId(e.target.value)}
              className="w-full h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            >
              <option value="">请选择礼品</option>
              {inventory.map((item) => (
                <option key={item.giftId} value={item.giftId}>
                  {item.giftName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">数量</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="请输入数量"
              className="w-full h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">操作人</label>
            <input
              type="text"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              placeholder="请输入操作人"
              className="w-full h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">事由</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="请输入事由"
              className="w-full h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={closeStockModal}>取消</Button>
            <Button
              onClick={handleSubmitStock}
              disabled={!selectedGiftId || !quantity || !operator || !reason}
            >
              确认{stockModalType === 'in' ? '入库' : '出库'}
            </Button>
          </div>
        </div>
      </Modal>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-text text-white rounded-xl shadow-lg text-sm font-medium animate-fade-in">
          {toast}
        </div>
      )}
    </PageContainer>
  );
}
