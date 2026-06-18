import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAppStore } from '../../store';
import { formatCurrency } from '../../utils';
import { GiftType } from '../../types';
import {
  ArrowLeft,
  Building2,
  Ruler,
  Palette,
  Target,
  Star,
  Tag,
  ShoppingCart,
  Package,
} from 'lucide-react';

export default function GiftDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { gifts, suppliers } = useAppStore();
  const gift = gifts.find((g) => g.id === id);
  const supplier = suppliers.find((s) => s.id === gift?.supplierId);

  if (!gift) {
    return (
      <PageContainer title="礼品不存在" subtitle="">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-text-light">未找到该礼品方案</p>
            <Button className="mt-4" onClick={() => navigate('/gifts')}>
              返回列表
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const typeColors: Record<GiftType, string> = {
    physical: 'bg-emerald-50 text-emerald-700',
    ecard: 'bg-blue-50 text-blue-700',
    custom: 'bg-violet-50 text-violet-700',
  };

  const typeLabels: Record<GiftType, string> = {
    physical: '实物礼盒',
    ecard: '电子卡券',
    custom: '定制周边',
  };

  const applicableScenarios = [
    '春节送礼',
    '端午福利',
    '中秋礼品',
    '员工生日',
    '周年纪念',
    '客户答谢',
    '年会抽奖',
  ];

  return (
    <PageContainer title={gift.name} subtitle={gift.description}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/gifts')}>
            <ArrowLeft className="w-4 h-4" />
            返回列表
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <ShoppingCart className="w-4 h-4" />
              加入采购单
            </Button>
            <Button>
              <Package className="w-4 h-4" />
              查看库存
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3 space-y-6">
            <Card>
              <CardContent className="p-0 overflow-hidden">
                <div className="relative aspect-[4/3] bg-bg">
                  <img
                    src={gift.images[0]}
                    alt={gift.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${typeColors[gift.type]}`}>
                      {typeLabels[gift.type]}
                    </span>
                    {gift.customizable && (
                      <span className="px-3 py-1 rounded text-sm font-medium bg-accent/10 text-accent">
                        可定制
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>礼品介绍</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text leading-relaxed">{gift.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>规格参数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(gift.specs).map(([key, value], index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-bg rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Ruler className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-text-light">{key}</p>
                        <p className="text-sm font-medium text-text">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>适用场景</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {applicableScenarios.map((scenario, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-4 py-2 bg-bg rounded-full group hover:bg-primary/10 transition-colors"
                    >
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm text-text">{scenario}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {gift.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-bg rounded text-xs text-text-light">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="text-sm text-text-light mb-1">参考价格</p>
                    <p className="text-3xl font-bold text-accent font-display">
                      {formatCurrency(gift.price)}
                    </p>
                    <p className="text-xs text-text-light mt-1">起批量 {gift.specs['起批量'] || '50'}件</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(gift.rating)
                            ? 'text-amber-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm font-medium text-text ml-1">{gift.rating}</span>
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-light">礼品类型</span>
                    <span className={`px-2.5 py-1 rounded text-xs font-medium ${typeColors[gift.type]}`}>
                      {typeLabels[gift.type]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-light">所属分类</span>
                    <span className="text-sm font-medium text-text">{gift.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-light">支持定制</span>
                    <StatusBadge status={gift.customizable ? 'active' : 'inactive'}>
                      {gift.customizable ? '支持' : '不支持'}
                    </StatusBadge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>供应商信息</CardTitle>
              </CardHeader>
              <CardContent>
                {supplier ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={supplier.logo}
                        alt={supplier.name}
                        className="w-14 h-14 rounded-xl object-cover border border-border"
                      />
                      <div>
                        <h4 className="font-semibold text-text">{supplier.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
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
                          <span className="text-xs text-text-light ml-1">{supplier.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 pt-3 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-text-light">
                        <Building2 className="w-4 h-4" />
                        <span>联系人：{supplier.contactPerson}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-light">
                        <Package className="w-4 h-4" />
                        <span>报价次数：{supplier.quoteCount} 次</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-light">
                        <Palette className="w-4 h-4" />
                        <span>合作时长：{supplier.cooperateSince}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-text-light mb-2">可供品类</p>
                      <div className="flex flex-wrap gap-1.5">
                        {supplier.categories.map((cat, i) => (
                          <span key={i} className="px-2 py-0.5 bg-bg rounded text-xs text-text-light">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/suppliers/${supplier.id}`)}
                    >
                      查看供应商档案
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-text-light">供应商信息暂不可用</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
