
import React, { useState } from 'react';
import { Feedback, FeedbackStatus, Project, Stakeholder } from '../types';
import { AlertCircle, CheckCircle, Clock, Send, Sparkles, User, UserCircle } from 'lucide-react';
import { generateResponseDraft } from '../services/geminiService';

interface FeedbackManagerProps {
  feedbacks: Feedback[];
  projects: Project[];
  onUpdateFeedback: (feedback: Feedback) => void;
}

const FeedbackManager: React.FC<FeedbackManagerProps> = ({ feedbacks, projects, onUpdateFeedback }) => {
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftResponse, setDraftResponse] = useState('');

  // Sort: Pending first
  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    if (a.status === FeedbackStatus.PENDING && b.status !== FeedbackStatus.PENDING) return -1;
    if (a.status !== FeedbackStatus.PENDING && b.status === FeedbackStatus.PENDING) return 1;
    return 0;
  });

  const selectedFeedback = feedbacks.find(f => f.id === selectedFeedbackId);

  const getProjectName = (pid: string) => projects.find(p => p.id === pid)?.name || '未知项目';
  const getStakeholder = (pid: string, sid: string) => {
     const project = projects.find(p => p.id === pid);
     return project?.stakeholders.find(s => s.id === sid);
  };

  const getStatusConfig = (status: FeedbackStatus) => {
    switch (status) {
      case FeedbackStatus.PENDING:
        return { 
          badge: 'bg-red-50 text-red-600 border border-red-100', 
          marker: 'bg-red-500' 
        };
      case FeedbackStatus.IN_PROGRESS:
        return { 
          badge: 'bg-amber-50 text-amber-700 border border-amber-100', 
          marker: 'bg-amber-500' 
        };
      case FeedbackStatus.ASSIGNED:
        return { 
          badge: 'bg-indigo-50 text-indigo-600 border border-indigo-100', 
          marker: 'bg-indigo-500' 
        };
      case FeedbackStatus.RESOLVED:
        return { 
          badge: 'bg-emerald-50 text-emerald-600 border border-emerald-100', 
          marker: 'bg-emerald-500' 
        };
      default:
        return { 
          badge: 'bg-slate-50 text-slate-600', 
          marker: 'hidden' 
        };
    }
  };

  const handleGenerateAIResponse = async () => {
    if (!selectedFeedback) return;
    
    setIsGenerating(true);
    const project = projects.find(p => p.id === selectedFeedback.projectId);
    const stakeholder = getStakeholder(selectedFeedback.projectId, selectedFeedback.stakeholderId);
    
    const context = `项目名称：${project?.name || ''}，类型：${project?.type || ''}，当前阶段：${project?.status || ''}`;
    const role = stakeholder ? `${stakeholder.name} (${stakeholder.role})` : '客户';

    const draft = await generateResponseDraft(context, selectedFeedback.content, role);
    setDraftResponse(draft);
    setIsGenerating(false);
  };

  const handleSaveResponse = () => {
    if (selectedFeedback && draftResponse) {
      onUpdateFeedback({
        ...selectedFeedback,
        response: draftResponse,
        status: FeedbackStatus.IN_PROGRESS // Move to in-progress or Resolved based on flow
      });
      setSelectedFeedbackId(null);
      setDraftResponse('');
    }
  };

  if (selectedFeedback) {
    // Detail / Response View
    const stakeholder = getStakeholder(selectedFeedback.projectId, selectedFeedback.stakeholderId);
    
    return (
      <div className="h-full flex flex-col animate-slide-in-right">
        <button 
          onClick={() => { setSelectedFeedbackId(null); setDraftResponse(''); }}
          className="text-slate-500 mb-4 text-sm flex items-center hover:text-teal-700 transition-colors"
        >
          取消 / 返回列表
        </button>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-4">
           <div className="flex justify-between mb-2">
             <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
               {getProjectName(selectedFeedback.projectId)}
             </span>
             <span className="text-xs text-slate-400">{selectedFeedback.receivedDate}</span>
           </div>
           
           <div className="flex items-center gap-2 mb-3">
             <div className="font-bold text-slate-800">{stakeholder?.name || '未知客户'}</div>
             <div className="text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                {stakeholder?.role}
             </div>
           </div>
           
           <div className="p-3 bg-indigo-50/50 rounded-lg text-sm text-slate-800 leading-relaxed border border-indigo-100">
             "{selectedFeedback.content}"
           </div>
           
           <div className="mt-3 flex items-center text-xs text-slate-500">
             <User size={12} className="mr-1" /> 当前负责人: {selectedFeedback.assignedTo}
           </div>
        </div>

        {/* AI Action Section */}
        <div className="flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center">
              <Sparkles size={16} className="text-purple-500 mr-2" /> AI响应助手
            </h3>
            
            <div className="bg-white flex-1 rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col">
              <textarea
                className="flex-1 w-full text-sm text-slate-700 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none mb-3 bg-slate-50"
                placeholder="在此输入回复内容，或点击下方按钮让 AI 生成草稿..."
                value={draftResponse || selectedFeedback.response || ''}
                onChange={(e) => setDraftResponse(e.target.value)}
              />
              
              <div className="flex gap-3">
                <button
                  onClick={handleGenerateAIResponse}
                  disabled={isGenerating}
                  className="flex-1 bg-purple-50 text-purple-700 border border-purple-100 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center active:bg-purple-100 transition-colors shadow-sm"
                >
                  {isGenerating ? (
                    <span className="animate-pulse">生成中...</span>
                  ) : (
                    <>
                      <Sparkles size={16} className="mr-2" /> 生成回复建议
                    </>
                  )}
                </button>
                <button
                  onClick={handleSaveResponse}
                  disabled={!draftResponse}
                  className="flex-1 bg-teal-600 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center active:bg-teal-700 disabled:opacity-50 disabled:bg-slate-300 transition-colors shadow-sm"
                >
                  <Send size={16} className="mr-2" /> 发送 / 保存
                </button>
              </div>
            </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-4">
      {sortedFeedbacks.map(item => {
        const pName = getProjectName(item.projectId);
        const stakeholder = getStakeholder(item.projectId, item.stakeholderId);
        const style = getStatusConfig(item.status);
        
        return (
          <div 
            key={item.id}
            onClick={() => setSelectedFeedbackId(item.id)}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 active:bg-slate-50 transition-colors relative overflow-hidden"
          >
            {/* Corner Marker */}
            <div className={`absolute top-0 right-0 w-3 h-3 rounded-bl-lg ${style.marker}`}></div>
            
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-slate-500 truncate max-w-[200px]">{pName}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${style.badge}`}>
                {item.status}
              </span>
            </div>
            
            <p className="text-sm text-slate-800 font-medium mb-2 line-clamp-2">
              {item.content}
            </p>
            
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-50">
               <div className="flex items-center gap-1">
                 <UserCircle size={14} className="text-slate-300" />
                 {stakeholder?.name} · {stakeholder?.role}
               </div>
               <div className="flex items-center gap-1">
                 <Clock size={14} className="text-slate-300" />
                 {item.receivedDate}
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeedbackManager;
