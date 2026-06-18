import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAppStore } from '../../store';
import { formatCurrency, formatDate } from '../../utils';
import {
  ArrowLeft,
  Building2,
  Phone,
  MapPin,
  Star,
  CalendarDays,
  TrendingUp,
  Package,
  History,
  Layers,
  User,
  FileText,
  ExternalLink,
  Gift,
} from 'lucide-react';

export default function SupplierDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { suppliers, quotations, gifts } = useAppStore();
  const supplier = suppliers.find((s) => s.id === id);
  const supplierQuotations = quotations.filter((q) => q.supplierId === id);
  const findGiftByQuotation = (giftName: string) => {
    return gifts.find((g) => g.name === giftName);
  };

  if (!supplier) {
    return (
      <PageContainer title="供应商不存在" subtitle="">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-text-light">未找到该供应商档案</p>
            <Button className="mt-4" onClick={() => navigate('/suppliers')}>
              返回列表
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={supplier.name} subtitle="供应商档案详情">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/suppliers')}>
            <ArrowLeft className="w-4 h-4" />
            返回列表
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <FileText className="w-4 h-4" />
              导出档案
            </Button>
            <Button>
              <Phone className="w-4 h-4" />
              联系供应商
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-text-light">合作起始</p>
                <p className="text-lg font-semibold text-text">{supplier.cooperateSince}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-text-light">历史报价</p>
                <p className="text-lg font-semibold text-text font-display">{supplier.quoteCount} 次</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-text-light">可供品类</p>
                <p className="text-lg font-semibold text-text">{supplier.categories.length} 类</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-text-light">综合评分</p>
                <p className="text-lg font-semibold text-text">{supplier.rating}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={supplier.logo}
                    alt={supplier.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-border shadow-md"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-text">{supplier.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={supplier.status}>
                        {supplier.status === 'active' ? '合作中' : '已停用'}
                      </StatusBadge>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(supplier.rating)
                                ? 'text-amber-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-text-light">联系人</p>
                      <p className="text-sm font-medium text-text">{supplier.contactPerson}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-text-light">联系电话</p>
                      <p className="text-sm font-medium text-text">{supplier.contactPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-text-light">公司地址</p>
                      <p className="text-sm font-medium text-text">{supplier.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>合作状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-light">当前状态</span>
                    <StatusBadge status={supplier.status}>
                      {supplier.status === 'active' ? '正常合作' : '合作暂停'}
                    </StatusBadge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-light">合作起始日期</span>
                    <span className="text-sm font-medium text-text">{supplier.cooperateSince}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-light">累计报价次数</span>
                    <span className="text-sm font-medium text-text">{supplier.quoteCount} 次</span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-text-light mb-3">可供品类</p>
                    <div className="flex flex-wrap gap-2">
                      {supplier.categories.map((cat, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-primary/5 text-primary rounded-lg text-sm font-medium"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>历史报价记录</CardTitle>
                  <span className="text-xs text-text-light">共 {supplierQuotations.length} 条记录</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {supplierQuotations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-bg/50">
                          <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                            礼品名称
                          </th>
                          <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                            适用节日
                          </th>
                          <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                            礼品类型
                          </th>
                          <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                            单价
                          </th>
                          <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                            总报价
                          </th>
                          <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                            交货周期
                          </th>
                          <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                            样品
                          </th>
                          <th className="text-center py-3 px-5 text-xs font-medium text-text-light">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {supplierQuotations.map((quote) => {
                          const matchedGift = findGiftByQuotation(quote.giftName);
                          return (
                            <tr key={quote.id} className="hover:bg-bg/30 transition-colors">
                              <td className="py-4 px-5">
                                <div className="flex items-center gap-2">
                                  <Package className="w-4 h-4 text-text-light" />
                                  <span className="font-medium text-text">{quote.giftName}</span>
                                </div>
                              </td>
                              <td className="py-4 px-5 text-sm text-text">
                                {quote.festival || '-'}
                              </td>
                              <td className="py-4 px-5">
                                <span className="px-2 py-0.5 bg-bg rounded text-xs text-text-light">
                                  {quote.giftType || '-'}
                                </span>
                              </td>
                              <td className="py-4 px-5">
                                <span className="font-semibold text-text">
                                  {formatCurrency(quote.unitPrice)}
                                </span>
                              </td>
                              <td className="py-4 px-5">
                                <span className="text-lg font-bold text-accent font-display">
                                  {formatCurrency(quote.totalPrice)}
                                </span>
                              </td>
                              <td className="py-4 px-5 text-sm text-text">
                                {quote.deliveryDays} 天
                              </td>
                              <td className="py-4 px-5">
                                <StatusBadge status={quote.sampleAvailable ? 'active' : 'inactive'}>
                                  {quote.sampleAvailable ? '可提供' : '不提供'}
                                </StatusBadge>
                              </td>
                              <td className="py-4 px-5 text-center">
                                {matchedGift ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(`/gifts/${matchedGift.id}`)}
                                  >
                                    <Gift className="w-3.5 h-3.5 mr-1" />
                                    查看礼品
                                  </Button>
                                ) : (
                                  <span className="text-xs text-text-light">--</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <History className="w-12 h-12 text-text-light mx-auto mb-4" />
                    <p className="text-text-light">暂无历史报价记录</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>可供礼品品类</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {supplier.categories.map((cat, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Layers className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-text group-hover:text-primary transition-colors">
                            {cat}
                          </p>
                          <p className="text-xs text-text-light mt-0.5">点击查看礼品</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
