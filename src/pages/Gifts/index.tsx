import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { giftCategories, giftTypes } from '../../data/mockGifts';
import { useAppStore } from '../../store';
import { formatCurrency } from '../../utils';
import { GiftType } from '../../types';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Tag,
  Palette,
} from 'lucide-react';

export default function Gifts() {
  const navigate = useNavigate();
  const gifts = useAppStore((s) => s.gifts);
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredGifts = gifts.filter((gift) => {
    const matchCategory = categoryFilter === '全部' || gift.category === categoryFilter;
    const matchType = typeFilter === 'all' || gift.type === typeFilter;
    const matchSearch = gift.name.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchCategory && matchType && matchSearch;
  });

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

  return (
    <PageContainer title="礼品方案库" subtitle="精选节日礼品，满足不同场景需求">
      <div className="space-y-6">
        {/* 筛选栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
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

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-text-light" />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {giftTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1 bg-bg rounded-lg p-1 border border-border">
                    {giftCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                          categoryFilter === cat
                            ? 'bg-white text-primary shadow-sm font-medium'
                            : 'text-text-light hover:text-text'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-bg rounded-lg p-1 border border-border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-text-light'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-text-light'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 礼品列表 */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-5">
            {filteredGifts.map((gift) => (
              <Card
                key={gift.id}
                hoverable
                onClick={() => navigate(`/gifts/${gift.id}`)}
                className="overflow-hidden group"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-bg">
                  <img
                    src={gift.images[0]}
                    alt={gift.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[gift.type]}`}>
                      {typeLabels[gift.type]}
                    </span>
                    {gift.customizable && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-accent/10 text-accent">
                        可定制
                      </span>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-text line-clamp-1 group-hover:text-primary transition-colors">
                    {gift.name}
                  </h3>
                  <p className="text-xs text-text-light mt-1 line-clamp-2 min-h-[32px]">
                    {gift.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-medium ml-0.5">{gift.rating}</span>
                    </div>
                    <span className="text-xs text-text-light">·</span>
                    <span className="text-xs text-text-light">{gift.supplierName}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <div>
                      <span className="text-xl font-bold text-accent font-display">
                        {formatCurrency(gift.price)}
                      </span>
                      <span className="text-xs text-text-light ml-1">起</span>
                    </div>
                    <Button size="sm" variant="outline">
                      查看详情
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGifts.map((gift) => (
              <Card key={gift.id} hoverable onClick={() => navigate(`/gifts/${gift.id}`)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={gift.images[0]}
                      alt={gift.name}
                      className="w-24 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-text hover:text-primary transition-colors">
                          {gift.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[gift.type]}`}>
                          {typeLabels[gift.type]}
                        </span>
                        {gift.customizable && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-accent/10 text-accent">
                            可定制
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-light mt-1 line-clamp-1">
                        {gift.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-text-light">{gift.supplierName}</span>
                        <div className="flex items-center text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs ml-0.5">{gift.rating}</span>
                        </div>
                        <span className="text-xs text-text-light">{gift.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-accent font-display">
                        {formatCurrency(gift.price)}
                      </p>
                      <p className="text-xs text-text-light">起批量 {gift.specs['起批量'] || '50'}件</p>
                      <Button size="sm" className="mt-2">
                        查看详情
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredGifts.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-text-light">暂无匹配的礼品方案</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
