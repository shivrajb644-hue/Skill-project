import React, { useState } from 'react';
import { Competency, Skill } from '../../lib/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Plus, Edit2, Trash2, Layers, Filter } from 'lucide-react';

interface CompetencyManagerProps {
  skills: Skill[];
  competencies: Competency[];
  onCreateCompetency: (data: Omit<Competency, 'id' | 'created_at'>) => void;
  onUpdateCompetency: (id: string, data: Partial<Omit<Competency, 'id' | 'created_at'>>) => void;
  onDeleteCompetency: (id: string) => void;
}

export const CompetencyManager: React.FC<CompetencyManagerProps> = ({
  skills,
  competencies,
  onCreateCompetency,
  onUpdateCompetency,
  onDeleteCompetency
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string>(skills[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompetency, setEditingCompetency] = useState<Competency | null>(null);

  const [formData, setFormData] = useState({
    skill_id: skills[0]?.id || '',
    title: '',
    description: '',
    order_index: 1
  });

  const filteredCompetencies = selectedSkillId
    ? competencies.filter(c => c.skill_id === selectedSkillId)
    : competencies;

  const handleOpenCreate = () => {
    setEditingCompetency(null);
    setFormData({
      skill_id: selectedSkillId || skills[0]?.id || '',
      title: '',
      description: '',
      order_index: filteredCompetencies.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp: Competency) => {
    setEditingCompetency(comp);
    setFormData({
      skill_id: comp.skill_id,
      title: comp.title,
      description: comp.description,
      order_index: comp.order_index
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCompetency) {
      onUpdateCompetency(editingCompetency.id, formData);
    } else {
      onCreateCompetency(formData);
    }
    setIsModalOpen(false);
  };

  const getSkillTitle = (skillId: string) => {
    return skills.find(s => s.id === skillId)?.title || 'Unknown Skill';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            Competencies Management
          </h2>
          <p className="text-xs text-slate-400">Manage granular competencies grouped under parent soft skill domains.</p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Add Competency
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
        <Filter className="w-4 h-4 text-slate-400 ml-2" />
        <span className="text-xs font-semibold text-slate-300">Filter by Skill:</span>
        <select
          value={selectedSkillId}
          onChange={e => setSelectedSkillId(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Skills ({competencies.length} Competencies)</option>
          {skills.map(s => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filteredCompetencies.map(comp => (
          <div key={comp.id} className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-4 flex-1">
              <span className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                #{comp.order_index}
              </span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white text-sm">{comp.title}</h3>
                  <Badge variant="slate" className="text-[10px]">{getSkillTitle(comp.skill_id)}</Badge>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{comp.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(comp)}>
                <Edit2 className="w-3.5 h-3.5 text-slate-300" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => {
                if (confirm(`Are you sure you want to delete competency "${comp.title}"?`)) {
                  onDeleteCompetency(comp.id);
                }
              }}>
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              </Button>
            </div>
          </div>
        ))}

        {filteredCompetencies.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No competencies found for this skill. Click "Add Competency" above to create one.
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCompetency ? 'Edit Competency' : 'Add New Competency'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Parent Skill</label>
            <select
              required
              value={formData.skill_id}
              onChange={e => setFormData({ ...formData, skill_id: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {skills.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Competency Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Pyramid Principle & Message Framing"
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
              placeholder="Detailed description of competency goals..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Order Sequence</label>
            <input
              type="number"
              min={1}
              value={formData.order_index}
              onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <Button variant="ghost" size="md" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              {editingCompetency ? 'Update Competency' : 'Create Competency'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
