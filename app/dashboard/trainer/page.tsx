'use client';

import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { 
  Users, AlertTriangle, TrendingUp, ChevronDown, CheckCircle, 
  MessageSquare, Mic, Bell, Send, UserX, BarChart3, Clock, 
  Award, Eye, Calendar
} from 'lucide-react';

export default function TrainerDashboardPage() {
  const students = [
    { name: 'Alice Johnson', level: 'Lvl 4', score: 82, trend: '+4', lastActive: '2 hrs ago', weakness: 'Negotiation', sessions: 14, status: 'good' },
    { name: 'Bob Smith', level: 'Lvl 2', score: 45, trend: '-2', lastActive: '4 days ago', weakness: 'Fluency', sessions: 3, status: 'warning' },
    { name: 'Charlie Davis', level: 'Lvl 3', score: 68, trend: '+12', lastActive: 'Yesterday', weakness: 'Vocabulary', sessions: 8, status: 'good' },
    { name: 'Diana Evans', level: 'Lvl 5', score: 94, trend: '+1', lastActive: '1 hr ago', weakness: 'Storytelling', sessions: 22, status: 'good' },
    { name: 'Evan Foster', level: 'Lvl 2', score: 48, trend: '0', lastActive: '1 week ago', weakness: 'Grammar', sessions: 2, status: 'danger' },
    { name: 'Fiona Garcia', level: 'Lvl 3', score: 71, trend: '+5', lastActive: '3 hrs ago', weakness: 'Listening', sessions: 9, status: 'good' },
  ];

  const metrics = [
    { label: 'Avg Overall Score', value: '68.5', change: '+3.2', icon: BarChart3 },
    { label: 'Active Students', value: '18/24', change: '-2', icon: Users },
    { label: 'Avg Sessions/Week', value: '4.2', change: '+1.1', icon: Clock },
    { label: 'Avg Improvement', value: '+8%', change: '+2%', icon: TrendingUp },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Trainer Portal</h1>
            <p className="text-sm text-slate-400">Class Overview & Analytics for Cohort A</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-slate-800 transition-colors">
              <span>Cohort A (Fall 2026)</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            <button className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-slate-800 transition-colors">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Last 30 Days</span>
            </button>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-panel p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <AlertTriangle className="w-32 h-32 text-amber-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-amber-500">Students Requiring Attention</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-amber-500/10">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">2 students</strong> (Bob, Evan) have speaking scores below 50.
                  </p>
                  <Button variant="outline" size="sm" className="ml-auto text-xs py-1">View Details</Button>
                </div>
                <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-amber-500/10">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Evan Foster</strong> hasn't practiced in 7 days.
                  </p>
                  <Button variant="outline" size="sm" className="ml-auto text-xs py-1">Send Reminder</Button>
                </div>
                <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-amber-500/10">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">3 students</strong> struggling with behavioral interview questions.
                  </p>
                  <Button variant="outline" size="sm" className="ml-auto text-xs py-1">Assign Practice</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-brand-500/20 bg-brand-500/5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-brand-400" />
              <h2 className="text-lg font-bold text-brand-400">Highlights</h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <TrendingUp className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white">Charlie Davis</strong> improved vocabulary by 12 points this week!
                </p>
              </div>
              <div className="flex gap-3">
                <Award className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300 leading-relaxed">
                  Cohort overall negotiation score increased by 8%.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-slate-800/50 rounded-lg">
                  <metric.icon className="w-4 h-4 text-slate-400" />
                </div>
                <Badge variant={metric.change.startsWith('+') ? 'success' : 'slate'}>
                  {metric.change}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-medium">{metric.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Student Table */}
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
            <h3 className="text-lg font-bold text-white">Student Roster</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search student..." 
                className="bg-slate-950 border border-slate-700 text-sm rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-brand-500 w-48"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-bold">Student</th>
                  <th className="px-6 py-4 font-bold">Level</th>
                  <th className="px-6 py-4 font-bold">Score</th>
                  <th className="px-6 py-4 font-bold">Top Weakness</th>
                  <th className="px-6 py-4 font-bold">Sessions</th>
                  <th className="px-6 py-4 font-bold">Last Active</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {students.map((st, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs">
                          {st.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-white">{st.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="slate">{st.level}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${st.score < 50 ? 'text-red-400' : st.score > 80 ? 'text-green-400' : 'text-white'}`}>
                          {st.score}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          ({st.trend})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={st.status === 'danger' ? 'destructive' : 'slate'} className="bg-slate-800 text-slate-300">
                        {st.weakness}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium">{st.sessions}</td>
                    <td className="px-6 py-4 text-xs">
                      {st.status === 'danger' ? (
                        <span className="text-red-400 font-medium flex items-center gap-1">
                          <UserX className="w-3 h-3" /> {st.lastActive}
                        </span>
                      ) : (
                        st.lastActive
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-brand-400 bg-slate-900 rounded-lg border border-slate-700 hover:border-brand-500/50 transition-colors" title="View Report">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors" title="Message">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-purple-400 bg-slate-900 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-colors" title="Assign Task">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignment Creation */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Mic className="w-5 h-5 text-purple-400" />
              Quick Assign Practice
            </h3>
            <p className="text-sm text-slate-400">Push a new exercise to selected students or the entire cohort.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select className="bg-slate-900 border border-slate-700 text-sm rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500 flex-1 md:flex-none">
              <option>Interview Scenario</option>
              <option>Presentation Pitch</option>
              <option>Vocabulary Drill</option>
            </select>
            <Button variant="primary" className="shrink-0 flex items-center gap-2">
              <Send className="w-4 h-4" />
              Assign to Cohort
            </Button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
