'use client';

import React, { useState, useEffect } from 'react';
import { Skill, Competency, LearningOutcome, Lesson, Activity, AssessmentItem } from '../../lib/types/curriculum';
import { repository } from '../../lib/repositories/LocalIndexedDBRepository';
import { aiService } from '../../lib/services/ai/aiService';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Plus, Edit2, Trash2, BookOpen, Layers, Target, FileText, Sparkles, HelpCircle } from 'lucide-react';

export const CurriculumAuthor: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [outcomes, setOutcomes] = useState<LearningOutcome[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);

  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'skill' | 'competency' | 'outcome' | 'lesson' | 'ai_generate'>('skill');

  // Form states
  const [formData, setFormData] = useState<any>({});
  const [aiPrompt, setAiPrompt] = useState({ topic: '', audience: 'Senior Managers', level: 'Intermediate' });
  const [generatingAi, setGeneratingAi] = useState(false);

  const loadAll = async () => {
    const sk = await repository.getSkills();
    setSkills(sk);
    if (sk.length > 0 && !selectedSkillId) setSelectedSkillId(sk[0].id);

    const comp = await repository.getCompetencies();
    setCompetencies(comp);

    const out = await repository.getOutcomes();
    setOutcomes(out);

    const les = await repository.getLessons();
    setLessons(les);

    const act = await repository.getActivities();
    setActivities(act);

    const ass = await repository.getAssessmentItems();
    setAssessments(ass);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleOpenModal = (type: 'skill' | 'competency' | 'outcome' | 'lesson' | 'ai_generate') => {
    setModalType(type);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    await repository.createSkill({
      title: formData.title,
      description: formData.description,
      category: formData.category || 'Speaking',
      level: formData.level || 'Intermediate',
      icon: 'MessageSquareText'
    });
    setIsModalOpen(false);
    await loadAll();
  };

  const handleCreateCompetency = async (e: React.FormEvent) => {
    e.preventDefault();
    await repository.createCompetency({
      skill_id: selectedSkillId || skills[0]?.id,
      title: formData.title,
      description: formData.description,
      order_index: competencies.length + 1
    });
    setIsModalOpen(false);
    await loadAll();
  };

  const handleGenerateAiLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingAi(true);
    const outline = await aiService.generateLessonOutline({
      topic: aiPrompt.topic || 'Executive Storytelling',
      target_audience: aiPrompt.audience,
      difficulty_level: aiPrompt.level
    });

    const compId = competencies.find(c => c.skill_id === selectedSkillId)?.id || competencies[0]?.id || 'comp-eng-1';

    await repository.createLesson({
      outcome_id: outcomes[0]?.id || 'out-eng-1',
      competency_id: compId,
      title: outline.title,
      objective: outline.objective,
      explanation_markdown: outline.explanation_markdown,
      resources: [],
      duration_minutes: 15,
      order_index: lessons.length + 1
    });

    setGeneratingAi(false);
    setIsModalOpen(false);
    await loadAll();
  };

  return (
    <div className="space-y-8">
      {/* Header controls */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-400" />
            Curriculum Authoring & AI Studio
          </h2>
          <p className="text-xs text-slate-400">Author extended curriculum architecture: Skill → Competency → Outcome → Lesson → Activity → Assessment.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => handleOpenModal('ai_generate')}>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Generate AI Lesson
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleOpenModal('skill')}>
            <Plus className="w-3.5 h-3.5" />
            Add Skill
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleOpenModal('competency')}>
            <Plus className="w-3.5 h-3.5" />
            Add Competency
          </Button>
        </div>
      </div>

      {/* Curriculum hierarchy viewer */}
      <div className="space-y-6">
        {skills.map(skill => {
          const compList = competencies.filter(c => c.skill_id === skill.id);
          return (
            <div key={skill.id} className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="blue">{skill.category}</Badge>
                    <Badge variant="purple">{skill.level}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-white">{skill.title}</h3>
                  <p className="text-xs text-slate-400">{skill.description}</p>
                </div>
              </div>

              {/* Competencies */}
              <div className="space-y-3 pl-2 sm:pl-4">
                {compList.map(comp => {
                  const compLessons = lessons.filter(l => l.competency_id === comp.id);
                  return (
                    <div key={comp.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-purple-400" />
                          <h4 className="font-bold text-white text-sm">Competency #{comp.order_index}: {comp.title}</h4>
                        </div>
                        <Badge variant="slate">{compLessons.length} Lessons</Badge>
                      </div>

                      {/* Lessons list */}
                      <div className="space-y-2 pl-4 border-l-2 border-slate-800">
                        {compLessons.map(les => (
                          <div key={les.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-bold text-white flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-brand-400" />
                                {les.title}
                              </div>
                              <div className="text-[11px] text-slate-400 line-clamp-1">{les.objective}</div>
                            </div>
                            <span className="text-slate-500 text-[10px] font-mono">{les.duration_minutes} mins</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalType === 'skill'
            ? 'Author New Soft Skill'
            : modalType === 'competency'
            ? 'Add Competency to Skill'
            : 'AI Curriculum Studio Generator'
        }
      >
        {modalType === 'skill' && (
          <form onSubmit={handleCreateSkill} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Title</label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                placeholder="e.g. Strategic Pitch Persuasion"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
              <textarea
                required
                rows={3}
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                placeholder="Describe outcome..."
              />
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <Button variant="primary" size="md" type="submit">Create Skill</Button>
            </div>
          </form>
        )}

        {modalType === 'competency' && (
          <form onSubmit={handleCreateCompetency} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Parent Skill</label>
              <select
                value={selectedSkillId}
                onChange={e => setSelectedSkillId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
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
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                placeholder="e.g. Active Empathy & Perspective Taking"
              />
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <Button variant="primary" size="md" type="submit">Create Competency</Button>
            </div>
          </form>
        )}

        {modalType === 'ai_generate' && (
          <form onSubmit={handleGenerateAiLesson} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Curriculum Topic to Generate</label>
              <input
                type="text"
                required
                value={aiPrompt.topic}
                onChange={e => setAiPrompt({ ...aiPrompt, topic: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                placeholder="e.g. Executive Presence & Vocal Cadence"
              />
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <Button variant="primary" size="md" type="submit" disabled={generatingAi}>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{generatingAi ? 'Synthesizing...' : 'Synthesize AI Lesson'}</span>
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
