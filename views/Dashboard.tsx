
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, Feedback, FeedbackStatus, ProjectType } from '../types';
import { AlertCircle, CheckCircle2, Zap, Share2, Sun, Globe2, Building2, Leaf, Map, Cpu, FlaskConical, LucideIcon, ChevronRight, Star } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  feedbacks: Feedback[];
  favorites: string[];
  onNavigate: (tab: string) => void;
  onSelectProject?: (project: Project) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, feedbacks, favorites, onNavigate, onSelectProject }) => {
  const navigate = useNavigate();
  const pendingFeedbacks = feedbacks.filter(f => f.status === FeedbackStatus.PENDING).length;
  const activeProjects = projects.filter(p => p.progress < 100).length;
  
  // Filter favorite projects
  const favoriteProjects = projects.filter(p => favorites.includes(p.id));

  // Icon and Color mapping for the 9 Engineering Companies - Refined Colors
  const companyConfig: Record<ProjectType, { icon: LucideIcon, color: string, bg: string, ring: string }> = {
    [ProjectType.GENERATION]: { icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-100' }, // 发电 - 金色/能量
    [ProjectType.GRID]: { icon: Share2, color: 'text-slate-600', bg: 'bg-slate-100', ring: 'ring-slate-200' }, // 电网 - 铁塔灰
    [ProjectType.NEW_ENERGY]: { icon: Sun, color: 'text-teal-600', bg: 'bg-teal-50', ring: 'ring-teal-100' }, // 新能源 - 青色
    [ProjectType.INTERNATIONAL]: { icon: Globe2, color: 'text-indigo-600', bg: 'bg-indigo-50', ring: 'ring-indigo-100' }, // 国际 - 深蓝
    [ProjectType.MUNICIPAL]: { icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-100' }, // 市政 - 绿色
    [ProjectType.ENVIRONMENT]: { icon: Leaf, color: 'text-lime-600', bg: 'bg-lime-50', ring: 'ring-lime-100' }, // 环境 - 草绿
    [ProjectType.SURVEY]: { icon: Map, color: 'text-stone-600', bg: 'bg-stone-50', ring: 'ring-stone-200' }, // 勘测 - 大地色
    [ProjectType.DIGITAL]: { icon: Cpu, color: 'text-violet-600', bg: 'bg-violet-50', ring: 'ring-violet-100' }, // 数字化 - 紫色
    [ProjectType.GREEN_CHEM]: { icon: FlaskConical, color: 'text-cyan-600', bg: 'bg-cyan-50', ring: 'ring-cyan-100' }, // 绿色能源化工 - 化学青
  };

  // Ensure consistent order of companies
  const companyOrder = Object.values(ProjectType);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section - Deep Premium Gradient */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-teal-900 rounded-xl p-5 text-white shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500 rounded-full blur-3xl opacity-10 -ml-10 -mb-10"></div>

        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-1 tracking-tight">您好，总经理</h2>
          <p className="text-slate-300 text-sm opacity-90 mb-5">今日重点工作概览</p>
          
          <div className="flex gap-4">
             <div 
               onClick={() => onNavigate('projects')}
               className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-3 flex-1 cursor-pointer hover:bg-white/10 active:scale-95 transition-all shadow-inner"
             >
               <div className="text-2xl font-bold text-white mb-1">{activeProjects}</div>
               <div className="text-xs text-teal-100 flex items-center justify-between">
                 在建项目
                 <ChevronRight size={14} className="opacity-70" />
               </div>
             </div>
             <div 
               onClick={() => onNavigate('feedback')}
               className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 backdrop-blur-sm rounded-xl p-3 flex-1 cursor-pointer hover:from-amber-500/30 transition-all active:scale-95"
             >
               <div className="text-2xl font-bold text-amber-200 flex items-center gap-2">
                 {pendingFeedbacks}
                 {pendingFeedbacks > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>}
               </div>
               <div className="text-xs text-amber-100 flex items-center justify-between">
                 待响应反馈
                 <ChevronRight size={14} className="opacity-70" />
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Action Required */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider pl-1 border-l-4 border-amber-500">待办事项</h3>
        {pendingFeedbacks > 0 ? (
          <div 
            onClick={() => onNavigate('feedback')}
            className="bg-white border border-amber-100 rounded-xl shadow-sm p-4 flex items-start gap-3 active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
            <div className="bg-amber-50 p-2 rounded-full text-amber-600 shrink-0 group-hover:scale-110 transition-transform">
               <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-slate-800 font-bold text-sm">有 {pendingFeedbacks} 条客户反馈需关注</p>
              <p className="text-slate-500 text-xs mt-1">请及时指派项目负责人跟进处理。</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-emerald-100 rounded-xl shadow-sm p-4 flex items-center gap-3 relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
             <div className="bg-emerald-50 p-2 rounded-full text-emerald-600">
                <CheckCircle2 size={20} />
             </div>
             <p className="text-slate-700 font-medium text-sm">当前无紧急待办事项</p>
          </div>
        )}
      </div>

      {/* Favorites / Focus Projects */}
      {favoriteProjects.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider pl-1 border-l-4 border-violet-500 flex items-center">
            重点关注项目 <Star size={12} className="ml-1 text-amber-400 fill-amber-400" />
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {favoriteProjects.map(project => (
              <div 
                key={project.id}
                onClick={() => onSelectProject && onSelectProject(project)}
                className="bg-white rounded-xl p-3 shadow-sm border border-violet-100 w-64 shrink-0 flex flex-col active:scale-95 transition-transform"
              >
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded border border-violet-100 truncate max-w-[80%]">
                      {project.type.replace('工程公司', '')}
                    </span>
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                 </div>
                 <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{project.name}</h4>
                 <div className="flex justify-between items-center text-xs mt-auto pt-2">
                   <span className="text-slate-400">PM: {project.manager}</span>
                   <span className="font-bold text-slate-600">{project.progress}%</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                    <div 
                      className={`h-1 rounded-full ${project.progress >= 100 ? 'bg-emerald-500' : 'bg-violet-400'}`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Business Distribution 3x3 Grid */}
      <div>
         <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider pl-1 border-l-4 border-teal-600">业务分布 (工程公司)</h3>
         <div className="grid grid-cols-3 gap-3">
            {companyOrder.map((type) => {
              const count = projects.filter(p => p.type === type).length;
              const conf = companyConfig[type];
              const Icon = conf.icon;
              
              // Shorten name for grid display (remove '工程公司')
              const shortName = type.replace('工程公司', '');

              return (
                <div 
                  key={type}
                  onClick={() => navigate('/projects', { state: { filter: type } })}
                  className={`rounded-xl p-3 shadow-sm border flex flex-col items-center justify-center text-center aspect-square transition-all cursor-pointer hover:shadow-md active:scale-95 ${count > 0 ? 'bg-white border-slate-100' : 'bg-slate-50/50 border-slate-100 opacity-60 grayscale'}`}
                >
                   <div className={`p-2.5 rounded-full mb-2 ${conf.bg} ${conf.ring} ring-1`}>
                     <Icon size={18} className={conf.color} />
                   </div>
                   <span className="text-xs font-bold text-slate-700 leading-tight mb-1">{shortName}</span>
                   <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded-full">{count} 个</span>
                </div>
              );
            })}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
