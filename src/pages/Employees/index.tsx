import { useState, useEffect } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAppStore } from '../../store';
import { departmentsList, levelsList } from '../../data/mockEmployees';
import {
  Search,
  Filter,
  Upload,
  Download,
  Send,
  MapPin,
  CheckCircle,
  AlertCircle,
  Users,
} from 'lucide-react';

export default function Employees() {
  const employees = useAppStore((s) => s.employees);
  const syncEmployeesToSupplier = useAppStore((s) => s.syncEmployeesToSupplier);
  const [departmentFilter, setDepartmentFilter] = useState('全部部门');
  const [levelFilter, setLevelFilter] = useState('全部级别');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [addressFilter, setAddressFilter] = useState<'all' | 'complete' | 'incomplete'>('all');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleSync = () => {
    const synced = syncEmployeesToSupplier();
    setToast(`已成功同步 ${synced.length} 名员工地址至供应商`);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchDept = departmentFilter === '全部部门' || emp.department === departmentFilter;
    const matchLevel = levelFilter === '全部级别' || emp.level === levelFilter;
    const matchSearch = emp.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                       emp.department.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchAddress = addressFilter === 'all' ||
                         (addressFilter === 'complete' && emp.addressComplete) ||
                         (addressFilter === 'incomplete' && !emp.addressComplete);
    return matchDept && matchLevel && matchSearch && matchAddress;
  });

  const completeCount = employees.filter(e => e.addressComplete).length;
  const completeRate = Math.round((completeCount / employees.length) * 100);

  return (
    <PageContainer title="员工地址管理" subtitle="管理员工收货地址，支持批量操作">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-5">
          {[
            { label: '员工总数', value: employees.length, icon: Users, color: 'from-blue-500 to-blue-600' },
            { label: '地址已完善', value: completeCount, icon: CheckCircle, color: 'from-emerald-500 to-green-500' },
            { label: '待完善地址', value: employees.length - completeCount, icon: AlertCircle, color: 'from-amber-500 to-orange-500' },
            { label: '地址完整率', value: `${completeRate}%`, icon: MapPin, color: 'from-violet-500 to-purple-500' },
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
              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                  <input
                    type="text"
                    placeholder="搜索姓名/部门..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-56 h-10 pl-9 pr-4 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-text-light" />
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {departmentsList.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {levelsList.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>

                  <select
                    value={addressFilter}
                    onChange={(e) => setAddressFilter(e.target.value as 'all' | 'complete' | 'incomplete')}
                    className="h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">全部地址状态</option>
                    <option value="complete">已完善</option>
                    <option value="incomplete">待完善</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <Upload className="w-4 h-4" />
                  批量导入
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4" />
                  导出
                </Button>
                <Button onClick={handleSync}>
                  <Send className="w-4 h-4" />
                  同步供应商
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 员工列表 */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-5 text-xs font-medium text-text-light uppercase tracking-wider">
                    员工信息
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-text-light uppercase tracking-wider">
                    部门
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-text-light uppercase tracking-wider">
                    职级
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-text-light uppercase tracking-wider">
                    联系方式
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-text-light uppercase tracking-wider">
                    收货地址
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-text-light uppercase tracking-wider">
                    地址状态
                  </th>
                  <th className="text-right py-3 px-5 text-xs font-medium text-text-light uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-bg/50 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-text">{emp.name}</p>
                          <p className="text-xs text-text-light">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-sm text-text">{emp.department}</td>
                    <td className="py-3 px-5">
                      <span className="px-2 py-1 bg-bg rounded text-xs text-text">
                        {emp.level}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-sm text-text-light">{emp.phone}</td>
                    <td className="py-3 px-5 max-w-xs">
                      {emp.address ? (
                        <p className="text-sm text-text line-clamp-1">
                          {emp.address.province} {emp.address.city} {emp.address.district} {emp.address.detail}
                        </p>
                      ) : (
                        <p className="text-sm text-text-light">未填写</p>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <StatusBadge status={emp.addressComplete ? 'active' : 'inactive'} />
                    </td>
                    <td className="py-3 px-5 text-right">
                      <Button variant="ghost" size="sm">
                        编辑
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredEmployees.length === 0 && (
            <div className="py-16 text-center">
              <Users className="w-12 h-12 text-text-light mx-auto mb-4" />
              <p className="text-text-light">暂无匹配的员工</p>
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}
