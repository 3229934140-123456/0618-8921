import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { mockDesignDrafts } from '../../data/mockMisc';
import { formatDate } from '../../utils';
import { DesignStatus } from '../../types';
import {
  Upload,
  Palette,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from 'lucide-react';

export default function Customize() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const statusFilters = [
    { value: 'all', label: '全部状态' },
    { value: 'pending', label: '待审核' },
    { value: 'approved', label: '已通过' },
    { value: 'rejected', label: '已驳回' },
  ];

  const filteredDrafts = mockDesignDrafts.filter((draft) => {
    const matchStatus = statusFilter === 'all' || draft.status === statusFilter;
    const matchSearch = draft.planName.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchStatus && matchSearch;
  });

  const pendingCount = mockDesignDrafts.filter(d => d.status === 'pending').length;

  return (
    <PageContainer title="定制设计管理" subtitle="设计稿审核与定制礼品管理">
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-5">
          {[
            { label: '待审核设计', value: pendingCount, icon: Clock, color: 'from-amber-500 to-orange-500' },
            { label: '本月通过', value: '12', icon: CheckCircle, color: 'from-emerald-500 to-green-500' },
            { label: '本月驳回', value: '3', icon: XCircle, color: 'from-red-500 to-rose-500' },
            { label: '进行中定制', value: '5', icon: Palette, color: 'from-violet-500 to-purple-500' },
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
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button>
                <Upload className="w-4 h-4" />
                上传设计稿
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 设计稿列表 */}
        <div className="grid grid-cols-3 gap-5">
          {filteredDrafts.map((draft) => (
            <Card
              key={draft.id}
              hoverable
              onClick={() => navigate(`/customize/${draft.id}`)}
              className="overflow-hidden group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-bg">
                <img
                  src={draft.imageUrl}
                  alt={draft.planName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                    查看详情
                  </Button>
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge status={draft.status as DesignStatus} />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-text line-clamp-1 group-hover:text-primary transition-colors">
                  {draft.planName}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-text-light">版本 {draft.version}</span>
                  <span className="text-xs text-text-light">{formatDate(draft.submitTime)}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-text-light">
                    提交人：{draft.submitter}
                  </p>
                  {draft.reviewer && (
                    <p className="text-xs text-text-light mt-1">
                      审核人：{draft.reviewer}
                    </p>
                  )}
                  {draft.reviewComment && (
                    <p className="text-xs text-text-light mt-1 line-clamp-1">
                      审核意见：{draft.reviewComment}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDrafts.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Palette className="w-12 h-12 text-text-light mx-auto mb-4" />
              <p className="text-text-light">暂无设计稿</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
