import { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { formatCurrency } from '../../utils';
import {
  BarChart3,
  TrendingUp,
  Package,
  Users,
  Calendar,
} from 'lucide-react';

const monthlyData = [
  { month: '1月', 采购金额: 128000, 发放数量: 350 },
  { month: '2月', 采购金额: 85000, 发放数量: 220 },
  { month: '3月', 采购金额: 76000, 发放数量: 180 },
  { month: '4月', 采购金额: 92000, 发放数量: 250 },
  { month: '5月', 采购金额: 142500, 发放数量: 400 },
  { month: '6月', 采购金额: 156000, 发放数量: 420 },
];

const categoryData = [
  { name: '节日礼盒', value: 45, color: '#1a365d' },
  { name: '电子卡券', value: 28, color: '#d4a857' },
  { name: '定制周边', value: 15, color: '#81b29a' },
  { name: '美妆个护', value: 12, color: '#e07a5f' },
];

const supplierData = [
  { name: '五芳斋', 合作金额: 256000 },
  { name: '杏花楼', 合作金额: 198000 },
  { name: '优品定制', 合作金额: 156000 },
  { name: '星巴克', 合作金额: 125000 },
  { name: '三只松鼠', 合作金额: 98000 },
  { name: '京东', 合作金额: 86000 },
];

const festivalData = [
  { name: '春节', 金额: 320000, 人数: 520 },
  { name: '端午节', 金额: 142500, 人数: 200 },
  { name: '中秋节', 金额: 198000, 人数: 350 },
  { name: '妇女节', 金额: 76500, 人数: 85 },
  { name: '周年庆', 金额: 158000, 人数: 300 },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState<'purchase' | 'distribution' | 'expense'>('purchase');

  return (
    <PageContainer title="数据报表" subtitle="采购、发放、费用多维度数据分析">
      <div className="space-y-6">
        {/* 关键指标 */}
        <div className="grid grid-cols-4 gap-5">
          {[
            { label: '年度采购总额', value: '¥856,500', change: '+12.5%', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
            { label: '礼品发放总数', value: '1,820件', change: '+8.3%', icon: Package, color: 'from-violet-500 to-purple-500' },
            { label: '覆盖员工数', value: '520人', change: '+15%', icon: Users, color: 'from-emerald-500 to-green-500' },
            { label: '供应商数量', value: '12家', change: '+3家', icon: Calendar, color: 'from-amber-500 to-orange-500' },
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-light">{stat.label}</p>
                    <p className="text-2xl font-bold text-text mt-2 font-display">{stat.value}</p>
                    <p className="text-xs text-emerald-600 mt-1">{stat.change} 较去年</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tab切换 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('purchase')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'purchase'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-text-light hover:text-text hover:bg-bg'
            }`}
          >
            采购统计
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'distribution'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-text-light hover:text-text hover:bg-bg'
            }`}
          >
            发放统计
          </button>
          <button
            onClick={() => setActiveTab('expense')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'expense'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-text-light hover:text-text hover:bg-bg'
            }`}
          >
            费用分析
          </button>
        </div>

        {activeTab === 'purchase' && (
          <>
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>月度采购趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e8e4de" />
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e8e4de',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => formatCurrency(value)}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="采购金额"
                          stroke="#1a365d"
                          strokeWidth={3}
                          dot={{ fill: '#1a365d', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>节日采购分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={festivalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e8e4de" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e8e4de',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number, name: string) => [
                            name === '人数' ? `${value}人` : formatCurrency(value),
                            name,
                          ]}
                        />
                        <Legend />
                        <Bar dataKey="金额" fill="#1a365d" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="人数" fill="#d4a857" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'distribution' && (
          <>
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>月度发放数量</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e8e4de" />
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e8e4de',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`${value}件`, '发放数量']}
                        />
                        <Bar dataKey="发放数量" fill="#81b29a" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>礼品类型分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e8e4de',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`${value}%`, '占比']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>发放率统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-6">
                  {[
                    { name: '春节礼品', total: 520, delivered: 505, rate: 97 },
                    { name: '端午礼品', total: 200, delivered: 185, rate: 92.5 },
                    { name: '中秋礼品', total: 350, delivered: 338, rate: 96.6 },
                    { name: '妇女节礼品', total: 85, delivered: 82, rate: 96.5 },
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <p className="text-sm font-medium text-text mb-3">{item.name}</p>
                      <div className="relative w-24 h-24 mx-auto">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="#e8e4de"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="#1a365d"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${item.rate * 2.51} 251`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-text font-display">{item.rate}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-text-light mt-3">
                        已发放 {item.delivered} / 总计 {item.total}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'expense' && (
          <>
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>供应商合作金额</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={supplierData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e8e4de" />
                        <XAxis type="number" stroke="#6b7280" fontSize={12} />
                        <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={80} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e8e4de',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => formatCurrency(value)}
                        />
                        <Bar dataKey="合作金额" fill="#d4a857" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>礼品类型费用占比</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e8e4de',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`${value}%`, '占比']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>预算执行情况</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {[
                    { name: '春节礼品采购', budget: 350000, actual: 320000, rate: 91.4 },
                    { name: '端午礼品采购', budget: 150000, actual: 142500, rate: 95 },
                    { name: '中秋礼品采购', budget: 200000, actual: 0, rate: 0 },
                    { name: '日常客户礼品', budget: 100000, actual: 86000, rate: 86 },
                    { name: '周年庆礼品', budget: 180000, actual: 158000, rate: 87.8 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-text">{item.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-text-light">
                            预算 {formatCurrency(item.budget)}
                          </span>
                          <span className="text-sm font-medium text-accent">
                            实际 {formatCurrency(item.actual)}
                          </span>
                          <span className={`text-sm font-semibold ${
                            item.rate >= 100 ? 'text-red-500' : 'text-emerald-500'
                          }`}>
                            {item.rate}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-bg rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            item.rate >= 100
                              ? 'bg-red-500'
                              : item.rate >= 80
                              ? 'bg-gradient-to-r from-primary to-accent'
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${Math.min(item.rate, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PageContainer>
  );
}
