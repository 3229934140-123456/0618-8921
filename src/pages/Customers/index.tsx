import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { mockCustomers, customerLevels } from '../../data/mockCustomers';
import { formatCurrency, formatDate } from '../../utils';
import { CustomerLevel } from '../../types';
import {
  Search,
  Filter,
  Plus,
  UserCheck,
  Gift,
  Star,
  Phone,
  Mail,
  Building2,
  ChevronRight,
  Bell,
} from 'lucide-react';

export default function Customers() {
  const navigate = useNavigate();
  const [levelFilter, setLevelFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchLevel = levelFilter === 'all' || customer.level === levelFilter;
    const matchSearch = customer.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                       customer.company.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchLevel && matchSearch;
  });

  return (
    <PageContainer title="客户礼品管理" subtitle="维护重要客户关系，记录送礼历史">
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-5">
          {[
            { label: '客户总数', value: mockCustomers.length, icon: UserCheck, color: 'from-blue-500 to-blue-600' },
            { label: 'A级客户', value: mockCustomers.filter(c => c.level === 'A').length, icon: Star, color: 'from-red-500 to-rose-500' },
            { label: '本年送礼次数', value: '36', icon: Gift, color: 'from-violet-500 to-purple-500' },
            { label: '生日提醒', value: '5', icon: Bell, color: 'from-amber-500 to-orange-500' },
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

        {/* 操作栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                  <input
                    type="text"
                    placeholder="搜索客户姓名/公司..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-64 h-10 pl-9 pr-4 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-text-light" />
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {customerLevels.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button onClick={() => {}}>
                <Plus className="w-4 h-4" />
                添加客户
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 客户列表 */}
        <div className="grid grid-cols-2 gap-5">
          {filteredCustomers.map((customer) => (
            <Card
              key={customer.id}
              hoverable
              onClick={() => navigate(`/customers/${customer.id}`)}
              className="group"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-white shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-text text-lg group-hover:text-primary transition-colors">
                        {customer.name}
                      </h3>
                      <StatusBadge status={customer.level as CustomerLevel} />
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-text-light text-sm">
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="truncate">{customer.company}</span>
                      <span className="mx-1">·</span>
                      <span>{customer.position}</span>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-sm text-text-light">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-text-light">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[150px]">{customer.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {customer.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-bg rounded text-xs text-text-light">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-text-light">累计送礼</p>
                      <p className="text-sm font-medium text-text mt-0.5">
                        {customer.giftRecords.length} 次
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light">累计金额</p>
                      <p className="text-sm font-medium text-accent mt-0.5 font-display">
                        {formatCurrency(customer.totalGiftValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light">生日</p>
                      <p className="text-sm font-medium text-text mt-0.5">
                        {customer.birthday}
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

        {filteredCustomers.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <UserCheck className="w-12 h-12 text-text-light mx-auto mb-4" />
              <p className="text-text-light">暂无匹配的客户</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
