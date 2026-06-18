import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAppStore } from '../../store';
import { formatDateTime } from '../../utils';
import { DesignStatus } from '../../types';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Tag,
  MessageSquare,
} from 'lucide-react';

export default function DesignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { designDrafts, updateDesignDraft } = useAppStore();
  const [rejectComment, setRejectComment] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const draft = designDrafts.find((d) => d.id === id);

  if (!draft) {
    return (
      <PageContainer title="设计稿不存在" subtitle="">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-text-light">未找到该设计稿</p>
            <Button className="mt-4" onClick={() => navigate('/customize')}>
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const isPending = draft.status === 'pending';

  const handleApprove = () => {
    updateDesignDraft(draft.id, {
      status: 'approved',
      reviewer: '当前用户',
      reviewTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
  };

  const handleReject = () => {
    if (!rejectComment.trim()) return;
    updateDesignDraft(draft.id, {
      status: 'rejected',
      reviewer: '当前用户',
      reviewTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      reviewComment: rejectComment.trim(),
    });
    setShowRejectInput(false);
    setRejectComment('');
  };

  return (
    <PageContainer title="设计稿详情" subtitle={draft.planName}>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/customize')}>
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </Button>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={draft.imageUrl}
                    alt={draft.planName}
                    className="w-full rounded-t-2xl object-cover max-h-[520px]"
                  />
                  <div className="absolute top-4 right-4">
                    <StatusBadge status={draft.status as DesignStatus} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="text-lg font-semibold text-text font-display">基本信息</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Tag className="w-4 h-4 text-text-light" />
                    <div>
                      <p className="text-xs text-text-light">版本</p>
                      <p className="text-sm text-text font-medium">{draft.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-text-light" />
                    <div>
                      <p className="text-xs text-text-light">提交人</p>
                      <p className="text-sm text-text font-medium">{draft.submitter}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-text-light" />
                    <div>
                      <p className="text-xs text-text-light">提交时间</p>
                      <p className="text-sm text-text font-medium">{formatDateTime(draft.submitTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-text-light" />
                    <div>
                      <p className="text-xs text-text-light">状态</p>
                      <StatusBadge status={draft.status as DesignStatus} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isPending && (
              <Card>
                <CardContent className="p-5 space-y-4">
                  <h3 className="text-lg font-semibold text-text font-display">审核操作</h3>
                  <div className="flex gap-3">
                    <Button className="flex-1" onClick={handleApprove}>
                      <CheckCircle className="w-4 h-4" />
                      通过
                    </Button>
                    <Button
                      variant="danger"
                      className="flex-1"
                      onClick={() => setShowRejectInput(!showRejectInput)}
                    >
                      <XCircle className="w-4 h-4" />
                      驳回
                    </Button>
                  </div>
                  {showRejectInput && (
                    <div className="space-y-3 pt-2">
                      <textarea
                        value={rejectComment}
                        onChange={(e) => setRejectComment(e.target.value)}
                        placeholder="请输入驳回原因..."
                        rows={3}
                        className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                      <Button
                        variant="danger"
                        fullWidth
                        onClick={handleReject}
                        disabled={!rejectComment.trim()}
                      >
                        确认驳回
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {(draft.reviewer || draft.reviewTime || draft.reviewComment) && (
              <Card>
                <CardContent className="p-5 space-y-4">
                  <h3 className="text-lg font-semibold text-text font-display">审核记录</h3>
                  <div className="space-y-3">
                    {draft.reviewer && (
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-text-light" />
                        <div>
                          <p className="text-xs text-text-light">审核人</p>
                          <p className="text-sm text-text font-medium">{draft.reviewer}</p>
                        </div>
                      </div>
                    )}
                    {draft.reviewTime && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-text-light" />
                        <div>
                          <p className="text-xs text-text-light">审核时间</p>
                          <p className="text-sm text-text font-medium">{formatDateTime(draft.reviewTime)}</p>
                        </div>
                      </div>
                    )}
                    {draft.reviewComment && (
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 text-text-light mt-0.5" />
                        <div>
                          <p className="text-xs text-text-light">审核意见</p>
                          <p className="text-sm text-text font-medium">{draft.reviewComment}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
