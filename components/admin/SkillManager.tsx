import React, { useState } from 'react';
import { Skill } from '../../lib/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Plus, Edit2, Trash2, BookOpen, Layers } from 'lucide-react';

interface SkillManagerProps {
  skills: Skill[];
  onCreateSkill: (data: Omit<Skill, 'id' | 'created_at'>) => void;
  onUpdateSkill: (id: string, data: Partial<Omit<Skill, 'id' | 'created_at'>>) => void;
  onDeleteSkill: (id: string) => void;
}

export const SkillManager: React.FC<SkillManagerProps> = ({
  skills,
  onCreateSkill,
  onUpdateSkill,
  onDeleteSkill
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Communication',
    level: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
    icon: 'MessageSquareText'
  });

  const handleOpenCreate = () => {
    setEditingSkill(null);
    setFormData({
      title: '',
      description: '',
      category: 'Communication',
      level: 'Intermediate',
      icon: 'MessageSquareText'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      title: skill.title,
      description: skill.description,
      category: skill.category,
      level: skill.level,
      icon: skill.icon
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSkill) {
      onUpdateSkill(editingSkill.id, formData);
    } else {
      onCreateSkill(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            Skills Catalog Management
          </h2>
          <p className="text-xs text-slate-400">Create, edit, or remove soft-skill domains across the platform.</p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Create New Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map(skill => (
          <div key={skill.id} className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <Badge variant="blue">{skill.category}</Badge>
                <Badge variant={skill.level === 'Advanced' ? 'purple' : 'slate'}>{skill.level}</Badge>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                {skill.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                {skill.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">ID: {skill.id.slice(0, 8)}</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(skill)}>
                  <Edit2 className="w-3.5 h-3.5 text-slate-300" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  if (confirm(`Are you sure you want to delete "${skill.title}"?`)) {
                    onDeleteSkill(skill.id);
                  }
                }}>
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Edit Soft Skill' : 'Create New Soft Skill'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Executive Presence & Influence"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Describe the learning objective and practical outcomes..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Communication">Communication</option>
                <option value="Strategy">Strategy</option>
                <option value="Leadership">Leadership</option>
                <option value="Personal Mastery">Personal Mastery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty Level</label>
              <select
                value={formData.level}
                onChange={e => setFormData({ ...formData, level: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <Button variant="ghost" size="md" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              {editingSkill ? 'Update Skill' : 'Create Skill'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
