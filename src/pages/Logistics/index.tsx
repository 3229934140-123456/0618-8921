import { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { mockLogistics } from '../../data/mockMisc';
import { useAppStore } from '../../store';
import { formatDate } from '../../utils';
import { LogisticsStatus } from '../../types';
import {
  Search,
  Filter,
  Truck,
  PackageCheck,
  AlertTriangle,
  Clock,
  MapPin,
  ChevronRight,
} from 'lucide-react';

export default function Logistics() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const logistics = useAppStore((s) => s.logistics);

  const statusFilters = [
    { value: 'all', label: '全部状态' },
    { value: 'shipped', label: '已发货' },
    { value: 'in_transit', label: '运输中' },
    { value: 'delivered', label: '已签收' },
    { value: 'exception', label: '异常' },
  ];

  const filteredOrders = logistics.filter((order) => {
    const matchStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchSearch = order.recipientName.includes(searchKeyword) ||
                       order.trackingNumber.includes(searchKeyword) ||
                       order.planName.includes(searchKeyword);
    return matchStatus && matchSearch;
  });

  const stats = [
    { label: '总发货数', value: logistics.length, icon: Truck, color: 'from-blue-500 to-blue-600' },
    { label: '运输中', value: logistics.filter(l => l.status === 'in_transit').length, icon: Clock, color: 'from-amber-500 to-orange-500' },
    { label: '已签收', value: logistics.filter(l => l.status === 'delivered').length, icon: PackageCheck, color: 'from-emerald-500 to-green-500' },
    { label: '异常件', value: logistics.filter(l => l.status === 'exception').length, icon: AlertTriangle, color: 'from-red-500 to-rose-500' },
  ];

  const deliveredRate = logistics.length > 0 
    ? Math.round((logistics.filter(l => l.status === 'delivered').length / logistics.length) * 100) 
    : 0;

  return (
    <PageContainer title="物流追踪" subtitle="批量发货与物流状态实时追踪">
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-5">
          {stats.map((stat, index) => (
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

        {/* 签收率卡片 */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light">整体签收率</p>
                <p className="text-3xl font-bold text-text mt-1 font-display">{deliveredRate}%</p>
              </div>
              <div className="w-48">
                <div className="h-3 bg-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                    style={{ width: `${deliveredRate}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 操作栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                  <input
                    type="text"
                    placeholder="搜索运单号/收件人/计划..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-72 h-10 pl-9 pr-4 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
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
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  批量导出
                </Button>
                <Button>
                  <Truck className="w-4 h-4" />
                  批量发货
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 物流列表 */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} hoverable>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      order.status === 'delivered' ? 'bg-emerald-50 text-emerald-500' :
                      order.status === 'exception' ? 'bg-red-50 text-red-500' :
                      'bg-blue-50 text-blue-500'
                    }`}>
                      {order.status === 'delivered' ? (
                        <PackageCheck className="w-6 h-6" />
                      ) : order.status === 'exception' ? (
                        <AlertTriangle className="w-6 h-6" />
                      ) : (
                        <Truck className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-text">{order.planName}</h3>
                        <StatusBadge status={order.status as LogisticsStatus} />
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-text-light">
                        <span>运单号：{order.trackingNumber}</span>
                        <span>承运商：{order.carrier}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-xs text-text-light">收件人</p>
                      <p className="text-sm font-medium text-text mt-0.5">{order.recipientName}</p>
                    </div>
                    <div className="max-w-xs">
                      <p className="text-xs text-text-light">收货地址</p>
                      <p className="text-sm text-text mt-0.5 line-clamp-1">{order.recipientAddress}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light">预计送达</p>
                      <p className="text-sm text-text mt-0.5">{formatDate(order.estimatedDelivery)}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      查看物流 <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* 物流进度 */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    {order.trackingHistory.slice(0, 4).map((event, index) => (
                      <div key={index} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            index === order.trackingHistory.slice(0, 4).length - 1 
                              ? 'bg-primary ring-4 ring-primary/20' 
                              : 'bg-emerald-400'
                          }`} />
                          <p className="text-xs text-text-light mt-1 truncate max-w-[100px]">
                            {event.status}
                          </p>
                        </div>
                        {index < order.trackingHistory.slice(0, 4).length - 1 && (
                          <div className={`flex-1 h-0.5 mx-2 ${
                            index < order.trackingHistory.slice(0, 4).length - 2 
                              ? 'bg-emerald-300' 
                              : 'bg-border'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredOrders.length === 0 && (
            <Card>
              <CardContent className="py-16 text-center">
                <Truck className="w-12 h-12 text-text-light mx-auto mb-4" />
                <p className="text-text-light">暂无物流记录</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
