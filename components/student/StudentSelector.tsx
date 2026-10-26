'use client';

import React, { useState, useEffect } from 'react';
import { LocalStudentProfile, EducationLevel, StudentYear } from '../../lib/types/student';
import { repository } from '../../lib/repositories/LocalIndexedDBRepository';
import { localSession } from '../../lib/storage/localStorage';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { UserCheck, Plus, ChevronDown, Sparkles, GraduationCap } from 'lucide-react';

interface StudentSelectorProps {
  onStudentChanged?: (student: LocalStudentProfile) => void;
}

export const StudentSelector: React.FC<StudentSelectorProps> = ({ onStudentChanged }) => {
  const [students, setStudents] = useState<LocalStudentProfile[]>([]);
  const [activeStudent, setActiveStudent] = useState<LocalStudentProfile | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<{
    full_name: string;
    education_level: EducationLevel;
    year: StudentYear;
    primary_skill_id: string;
    goal: string;
  }>({
    full_name: '',
    education_level: 'Undergraduate',
    year: '3rd Year',
    primary_skill_id: 'skill-english-speaking',
    goal: ''
  });

  const loadStudents = async () => {
    const list = await repository.getStudents();
    setStudents(list);
    const activeId = localSession.getActiveStudentId();
    const current = list.find(s => s.id === activeId) || list[0] || null;
    setActiveStudent(current);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSelectStudent = (student: LocalStudentProfile) => {
    localSession.setActiveStudentId(student.id);
    setActiveStudent(student);
    setShowDropdown(false);
    if (onStudentChanged) onStudentChanged(student);
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetRole = `${formData.year} ${formData.education_level}`;

    const newStudent = await repository.createStudent({
      full_name: formData.full_name,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.full_name)}`,
      education_level: formData.education_level,
      year: formData.year,
      primary_skill_id: formData.primary_skill_id,
      goal: formData.goal || 'Improve spoken English and presentation confidence for college and job interviews.',
      target_role: targetRole,
      selected_skill_ids: [formData.primary_skill_id]
    });

    setFormData({
      full_name: '',
      education_level: 'Undergraduate',
      year: '3rd Year',
      primary_skill_id: 'skill-english-speaking',
      goal: ''
    });
    setIsModalOpen(false);
    await loadStudents();
    handleSelectStudent(newStudent);
  };

  if (!activeStudent) return null;

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="glass-panel px-3.5 py-1.5 rounded-2xl border border-slate-800 hover:border-brand-500/40 flex items-center gap-2.5 text-left transition-all group"
        >
          <img
            src={activeStudent.avatar_url}
            alt={activeStudent.full_name}
            className="w-7 h-7 rounded-xl object-cover ring-2 ring-brand-500/30 group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              {activeStudent.full_name}
              <Badge variant="purple" className="text-[9px] py-0 px-1.5">Local Learner</Badge>
            </div>
            <div className="text-[10px] text-slate-400 max-w-[130px] truncate">
              {activeStudent.target_role || `${activeStudent.year} ${activeStudent.education_level}`}
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors ml-0.5" />
        </button>

        <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="rounded-xl text-xs py-1.5">
          <Plus className="w-3.5 h-3.5" />
          New Learner
        </Button>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in duration-150">
          <div className="px-4 py-2 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Select Active Student Profile</span>
            <GraduationCap className="w-4 h-4 text-brand-400" />
          </div>

          <div className="py-1 max-h-64 overflow-y-auto">
            {students.map(st => (
              <button
                key={st.id}
                onClick={() => handleSelectStudent(st)}
                className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-slate-800/80 transition-colors text-xs ${
                  activeStudent.id === st.id ? 'bg-brand-500/10 text-brand-300 font-semibold' : 'text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={st.avatar_url} alt="" className="w-7 h-7 rounded-lg object-cover" />
                  <div>
                    <div className="font-bold">{st.full_name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">
                      {st.year || 'Student'} • {st.education_level || 'College'}
                    </div>
                  </div>
                </div>
                {activeStudent.id === st.id && <UserCheck className="w-4 h-4 text-brand-400" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Simplified Student Onboarding Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Student Profile"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Student Full Name</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Shivraj Test"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Education Level</label>
              <select
                value={formData.education_level}
                onChange={e => setFormData({ ...formData, education_level: e.target.value as EducationLevel })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              >
                <option value="School">School</option>
                <option value="Diploma">Diploma</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Graduate/Working">Graduate / Working</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Current Year</label>
              <select
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value as StudentYear })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
                <option value="Graduated">Graduated</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Primary Skill to Improve</label>
            <select
              value={formData.primary_skill_id}
              onChange={e => setFormData({ ...formData, primary_skill_id: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            >
              <option value="skill-english-speaking">English Speaking & Grammar</option>
              <option value="skill-communication">Communication & Expression</option>
              <option value="skill-interview">Job Interview Skills</option>
              <option value="skill-public-speaking">Public Speaking & Presentations</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Learning Goal</label>
            <textarea
              rows={2}
              value={formData.goal}
              onChange={e => setFormData({ ...formData, goal: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. I want to improve my English speaking and grammar for college and job interviews."
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create Learner Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
