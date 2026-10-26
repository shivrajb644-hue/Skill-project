import React, { useState } from 'react';
import { Lesson, Competency, Skill } from '../../lib/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Plus, Edit2, Trash2, BookOpenCheck, Clock, Filter } from 'lucide-react';

interface LessonManagerProps {
  competencies: Competency[];
  lessons: Lesson[];
  onCreateLesson: (data: Omit<Lesson, 'id' | 'created_at'>) => void;
  onUpdateLesson: (id: string, data: Partial<Omit<Lesson, 'id' | 'created_at'>>) => void;
  onDeleteLesson: (id: string) => void;
}

export const LessonManager: React.FC<LessonManagerProps> = ({
  competencies,
  lessons,
  onCreateLesson,
  onUpdateLesson,
  onDeleteLesson
}) => {
  const [selectedCompetencyId, setSelectedCompetencyId] = useState<string>(competencies[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const [formData, setFormData] = useState({
    competency_id: competencies[0]?.id || '',
    title: '',
    content: '',
    duration_minutes: 15,
    order_index: 1
  });

  const filteredLessons = selectedCompetencyId
    ? lessons.filter(l => l.competency_id === selectedCompetencyId)
    : lessons;

  const handleOpenCreate = () => {
    setEditingLesson(null);
    setFormData({
      competency_id: selectedCompetencyId || competencies[0]?.id || '',
      title: '',
      content: '',
      duration_minutes: 15,
      order_index: filteredLessons.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      competency_id: lesson.competency_id,
      title: lesson.title,
      content: lesson.content,
      duration_minutes: lesson.duration_minutes,
      order_index: lesson.order_index
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLesson) {
      onUpdateLesson(editingLesson.id, formData);
    } else {
      onCreateLesson(formData);
    }
    setIsModalOpen(false);
  };

  const getCompetencyTitle = (compId: string) => {
    return competencies.find(c => c.id === compId)?.title || 'Unknown Competency';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-amber-400" />
            Lessons Content Management
          </h2>
          <p className="text-xs text-slate-400">Create, edit, and curate individual instructional modules and reading materials.</p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Create New Lesson
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
        <Filter className="w-4 h-4 text-slate-400 ml-2" />
        <span className="text-xs font-semibold text-slate-300">Filter by Competency:</span>
        <select
          value={selectedCompetencyId}
          onChange={e => setSelectedCompetencyId(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Competencies ({lessons.length} Lessons)</option>
          {competencies.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLessons.map(lesson => (
          <div key={lesson.id} className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant="amber" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lesson.duration_minutes} min read
                </Badge>
                <span className="text-[11px] text-slate-500 font-mono">Index #{lesson.order_index}</span>
              </div>

              <h3 className="font-bold text-white text-base mb-1">{lesson.title}</h3>
              <p className="text-xs text-brand-400 font-medium mb-3">{getCompetencyTitle(lesson.competency_id)}</p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-xs text-slate-400 font-mono line-clamp-3 mb-4">
                {lesson.content}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">ID: {lesson.id.slice(0, 8)}</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(lesson)}>
                  <Edit2 className="w-3.5 h-3.5 text-slate-300" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  if (confirm(`Are you sure you want to delete lesson "${lesson.title}"?`)) {
                    onDeleteLesson(lesson.id);
                  }
                }}>
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredLessons.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 text-sm">
            No lessons found under this competency. Click "Create New Lesson" above to add one.
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Parent Competency</label>
            <select
              required
              value={formData.competency_id}
              onChange={e => setFormData({ ...formData, competency_id: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {competencies.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Lesson Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Master the Minto Pyramid Structure"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min={1}
                value={formData.duration_minutes}
                onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 15 })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Order Index</label>
              <input
                type="number"
                min={1}
                value={formData.order_index}
                onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Lesson Content (Markdown / Text)</label>
            <textarea
              required
              rows={6}
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Enter detailed instructional content..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <Button variant="ghost" size="md" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              {editingLesson ? 'Update Lesson' : 'Create Lesson'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
