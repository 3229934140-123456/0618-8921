import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { useAppStore } from '../../store';
import { formatCurrency, formatDate } from '../../utils';
import { CustomerLevel, GiftRecord } from '../../types';
import {
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  Gift,
  Star,
  Bell,
  Plus,
  CalendarDays,
  MessageSquare,
} from 'lucide-react';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers, addGiftRecord } = useAppStore();
  const customer = customers.find((c) => c.id === id);

  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftDate, setGiftDate] = useState('');
  const [giftOccasion, setGiftOccasion] = useState('');
  const [giftName, setGiftName] = useState('');
  const [giftValue, setGiftValue] = useState('');
  const [giftFeedback, setGiftFeedback] = useState('');
  const [giftRating, setGiftRating] = useState(4);
  const [giftNotes, setGiftNotes] = useState('');

  if (!customer) {
    return (
      <PageContainer title="客户不存在" subtitle="">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-text-light">未找到该客户</p>
            <Button className="mt-4" onClick={() => navigate('/customers')}>返回列表</Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const handleAddGift = () => {
    if (!giftDate || !giftOccasion || !giftName || !giftValue) return;
    const record: GiftRecord = {
      id: `gr_${Date.now()}`,
      date: giftDate,
      occasion: giftOccasion,
      giftName,
      giftValue: Number(giftValue),
      feedback: giftFeedback,
      feedbackRating: giftRating,
      notes: giftNotes,
    };
    addGiftRecord(customer.id, record);
    setShowGiftModal(false);
    setGiftDate('');
    setGiftOccasion('');
    setGiftName('');
    setGiftValue('');
    setGiftFeedback('');
    setGiftRating(4);
    setGiftNotes('');
  };

  return (
    <PageContainer title={customer.name} subtitle={customer.company}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/customers')}>
            <ArrowLeft className="w-4 h-4" /> 返回列表
          </Button>
          <Button onClick={() => setShowGiftModal(true)}>
            <Plus className="w-4 h-4" /> 添加送礼记录
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardContent className="p-6 text-center">
              <img src={customer.avatar} alt={customer.name} className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-white shadow-lg" />
              <h2 className="text-xl font-bold text-text mt-4 font-display">{customer.name}</h2>
              <p className="text-sm text-text-light mt-1">{customer.position}</p>
              <div className="mt-3 flex justify-center">
                <StatusBadge status={customer.level as CustomerLevel} />
              </div>
              <div className="mt-6 space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-text">
                  <Building2 className="w-4 h-4 text-text-light" />
                  <span>{customer.company}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text">
                  <Phone className="w-4 h-4 text-text-light" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text">
                  <Mail className="w-4 h-4 text-text-light" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text">
                  <CalendarDays className="w-4 h-4 text-text-light" />
                  <span>生日：{customer.birthday}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {customer.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-bg rounded text-xs text-text-light">{tag}</span>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-text font-display">{customer.giftRecords.length}</p>
                  <p className="text-xs text-text-light">送礼次数</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent font-display">{formatCurrency(customer.totalGiftValue)}</p>
                  <p className="text-xs text-text-light">累计金额</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>重要日期提醒</CardTitle>
                  <Bell className="w-5 h-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                {customer.importantDates.length > 0 ? (
                  <div className="space-y-3">
                    {customer.importantDates.map((d) => (
                      <div key={d.id} className="flex items-center gap-4 p-3 rounded-lg bg-bg">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Bell className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-text">{d.title}</p>
                          <p className="text-sm text-text-light">{formatDate(d.date)}</p>
                        </div>
                        <span className="text-xs text-accent">提前 {d.remindDays} 天提醒</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-light text-center py-4">暂无重要日期</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>送礼记录</CardTitle>
              </CardHeader>
              <CardContent>
                {customer.giftRecords.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-6">
                      {customer.giftRecords.map((record, index) => (
                        <div key={record.id} className="relative flex gap-4 pl-12">
                          <div className="absolute left-3 w-5 h-5 rounded-full bg-primary border-4 border-white shadow-sm z-10" />
                          <div className="flex-1 p-4 rounded-xl border border-border hover:border-primary/20 transition-all bg-white">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Gift className="w-4 h-4 text-accent" />
                                  <h4 className="font-medium text-text">{record.giftName}</h4>
                                </div>
                                <p className="text-sm text-text-light mt-1">
                                  {formatDate(record.date)} · {record.occasion}
                                </p>
                              </div>
                              <span className="text-lg font-bold text-accent font-display">
                                {formatCurrency(record.giftValue)}
                              </span>
                            </div>
                            {record.feedback && (
                              <div className="mt-3 pt-3 border-t border-border">
                                <div className="flex items-center gap-2 mb-1">
                                  <MessageSquare className="w-3.5 h-3.5 text-text-light" />
                                  <span className="text-xs text-text-light">客户反馈</span>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`w-3 h-3 ${i < record.feedbackRating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-text">{record.feedback}</p>
                              </div>
                            )}
                            {record.notes && (
                              <p className="text-xs text-text-light mt-2">备注：{record.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-text-light text-center py-8">暂无送礼记录</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Modal open={showGiftModal} onClose={() => setShowGiftModal(false)} title="添加送礼记录">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">送礼日期 *</label>
              <input type="date" value={giftDate} onChange={(e) => setGiftDate(e.target.value)}
                className="w-full h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">送礼场合 *</label>
              <select value={giftOccasion} onChange={(e) => setGiftOccasion(e.target.value)}
                className="w-full h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">请选择</option>
                <option value="春节拜访">春节拜访</option>
                <option value="中秋节问候">中秋节问候</option>
                <option value="项目交付答谢">项目交付答谢</option>
                <option value="生日祝福">生日祝福</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">礼品名称 *</label>
              <input type="text" value={giftName} onChange={(e) => setGiftName(e.target.value)}
                className="w-full h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="请输入礼品名称" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">礼品价值（元）*</label>
              <input type="number" value={giftValue} onChange={(e) => setGiftValue(e.target.value)}
                className="w-full h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="请输入价值" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">客户反馈</label>
            <textarea value={giftFeedback} onChange={(e) => setGiftFeedback(e.target.value)} rows={2}
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="客户反馈内容..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">反馈评分</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setGiftRating(n)} className="p-0.5">
                  <Star className={`w-6 h-6 ${n <= giftRating ? 'text-amber-400 fill-current' : 'text-gray-300'} transition-colors`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">备注</label>
            <input type="text" value={giftNotes} onChange={(e) => setGiftNotes(e.target.value)}
              className="w-full h-10 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="备注信息..." />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setShowGiftModal(false)}>取消</Button>
            <Button onClick={handleAddGift} disabled={!giftDate || !giftOccasion || !giftName || !giftValue}>确认添加</Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
