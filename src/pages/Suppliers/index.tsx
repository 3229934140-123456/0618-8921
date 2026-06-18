import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { mockSuppliers, mockQuotations } from '../../data/mockSuppliers';
import { formatCurrency } from '../../utils';
import {
  Search,
  Filter,
  Plus,
  Building2,
  Star,
  Phone,
  MapPin,
  ChevronRight,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Suppliers() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'compare'>('list');

  const filteredSuppliers = mockSuppliers.filter((supplier) => {
    const matchStatus = statusFilter === 'all' || supplier.status === statusFilter;
    const matchSearch = supplier.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                       supplier.contactPerson.includes(searchKeyword);
    return matchStatus && matchSearch;
  });

  const comparisonData = mockQuotations.map(q => ({
    name: q.supplierName,
    单价: q.unitPrice,
    总价: q.totalPrice / 100,
  }));

  const colors = ['#1a365d', '#d4a857', '#81b29a', '#e07a5f'];

  return (
    <PageContainer title="供应商管理" subtitle="供应商档案管理与报价对比">
      <div className="space-y-6">
        {/* Tab切换 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'list'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-text-light hover:text-text hover:bg-bg'
            }`}
          >
            <Building2 className="w-4 h-4 inline mr-2" />
            供应商列表
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'compare'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-text-light hover:text-text hover:bg-bg'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            报价对比
          </button>
        </div>

        {activeTab === 'list' ? (
          <>
            {/* 操作栏 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                      <input
                        type="text"
                        placeholder="搜索供应商名称/联系人..."
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
                        <option value="all">全部状态</option>
                        <option value="active">合作中</option>
                        <option value="inactive">已停用</option>
                      </select>
                    </div>
                  </div>

                  <Button>
                    <Plus className="w-4 h-4" />
                    添加供应商
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 供应商列表 */}
            <div className="grid grid-cols-2 gap-5">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} hoverable className="group">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <img
                        src={supplier.logo}
                        alt={supplier.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-border"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-text text-lg group-hover:text-primary transition-colors">
                            {supplier.name}
                          </h3>
                          <StatusBadge status={supplier.status} />
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.floor(supplier.rating)
                                  ? 'text-amber-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-text-light ml-1">{supplier.rating}</span>
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-sm text-text-light">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{supplier.contactPerson}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[160px]">{supplier.address}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          {supplier.categories.slice(0, 3).map((cat, i) => (
                            <span key={i} className="px-2 py-0.5 bg-bg rounded text-xs text-text-light">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xs text-text-light">合作时长</p>
                          <p className="text-sm font-medium text-text mt-0.5">
                            {supplier.cooperateSince}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-text-light">报价次数</p>
                          <p className="text-sm font-medium text-text mt-0.5">
                            {supplier.quoteCount} 次
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        查看详情 <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* 报价对比区域 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>端午礼品方案报价对比</CardTitle>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="w-4 h-4" />
                    导出对比报告
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e8e4de',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        }}
                        formatter={(value: number, name: string) => [
                          name === '总价' ? formatCurrency(value * 100) : formatCurrency(value),
                          name,
                        ]}
                      />
                      <Bar dataKey="单价" barSize={20} radius={[0, 4, 4, 0]}>
                        {comparisonData.map((_, index) => (
                          <Cell key={`cell-1-${index}`} fill={colors[index % colors.length]} fillOpacity={0.8} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* 报价对比表格 */}
            <Card>
              <CardHeader>
                <CardTitle>报价详情对比</CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-bg/50">
                      <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                        供应商
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                        礼品名称
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                        单价
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                        总报价（200件）
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                        交货周期
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-medium text-text-light">
                        最小起订
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
                    {mockQuotations.map((quote, index) => (
                      <tr key={quote.id} className="hover:bg-bg/30 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-1 rounded-full"
                              style={{ backgroundColor: colors[index % colors.length] }}
                            />
                            <span className="font-medium text-text">{quote.supplierName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-sm text-text">{quote.giftName}</td>
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
                        <td className="py-4 px-5 text-sm text-text">{quote.deliveryDays}天</td>
                        <td className="py-4 px-5 text-sm text-text">{quote.minOrderQty}件</td>
                        <td className="py-4 px-5">
                          <StatusBadge status={quote.sampleAvailable ? 'active' : 'inactive'}>
                            {quote.sampleAvailable ? '可提供' : '不提供'}
                          </StatusBadge>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <Button variant="ghost" size="sm">
                            选择
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </PageContainer>
  );
}
