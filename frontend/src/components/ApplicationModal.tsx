import { useState, useEffect, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { applicationApi, aiApi } from '../api';
import type { Application } from '../types';
import { X, Copy, Check, Sparkles, Loader2, Trash2 } from 'lucide-react';

interface ApplicationModalProps {
  application: Application | null;
  onClose: () => void;
  onSave: () => void;
}

export function ApplicationModal({
  application,
  onClose,
  onSave,
}: ApplicationModalProps) {
  if (!application) return null;
  
  const isNew = !application._id;
  const [form, setForm] = useState({
    company: application.company || '',
    role: application.role || '',
    jdLink: application.jdLink || '',
    notes: application.notes || '',
    dateApplied: application.dateApplied
      ? new Date(application.dateApplied).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    status: application.status || 'Applied',
    salaryMin: application.salaryMin || '',
    salaryMax: application.salaryMax || '',
    requiredSkills: application.requiredSkills || [],
    niceToHaveSkills: application.niceToHaveSkills || [],
    seniority: application.seniority || '',
    location: application.location || '',
    resumeSuggestions: application.resumeSuggestions || [],
  });

  const [skillsInput, setSkillsInput] = useState('');
  const [niceSkillsInput, setNiceSkillsInput] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Application>) => {
      if (isNew) {
        return applicationApi.create(data);
      }
      return applicationApi.update(application._id, data);
    },
    onSuccess: () => {
      onSave();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => applicationApi.delete(application._id),
    onSuccess: () => {
      onSave();
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;

    saveMutation.mutate({
      ...form,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
    });
  };

  const handleAddSkill = (input: string, field: 'requiredSkills' | 'niceToHaveSkills') => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], trimmed],
    }));
    if (field === 'requiredSkills') setSkillsInput('');
    else setNiceSkillsInput('');
  };

  const handleRemoveSkill = (idx: number, field: 'requiredSkills' | 'niceToHaveSkills') => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }));
  };

  const handleCopySuggestion = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleGenerateSuggestions = async () => {
    if (!form.role.trim()) return;
    setGeneratingSuggestions(true);
    try {
      const jd = form.notes || `${form.role} at ${form.company}`;
      const result = await aiApi.getResumeSuggestions(
        jd,
        form.role,
        form.requiredSkills
      );
      setForm((prev) => ({
        ...prev,
        resumeSuggestions: result.suggestions,
      }));
    } catch {
      // Keep existing suggestions on error
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  const handleDelete = () => {
    if (isNew || !application._id) {
      onClose();
      return;
    }
    if (window.confirm('Are you sure you want to delete this application?')) {
      deleteMutation.mutate();
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isNew ? 'Add Application' : 'Edit Application'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role *
              </label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Job title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="City, State or Remote"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Seniority
              </label>
              <select
                value={form.seniority}
                onChange={(e) => setForm({ ...form, seniority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select</option>
                <option value="entry">Entry</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Application['status'] })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="Applied">Applied</option>
                <option value="Phone Screen">Phone Screen</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Applied
              </label>
              <input
                type="date"
                value={form.dateApplied}
                onChange={(e) => setForm({ ...form, dateApplied: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Salary Min
              </label>
              <input
                type="number"
                value={form.salaryMin}
                onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Salary Max
              </label>
              <input
                type="number"
                value={form.salaryMax}
                onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              JD Link
            </label>
            <input
              type="url"
              value={form.jdLink}
              onChange={(e) => setForm({ ...form, jdLink: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Required Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.requiredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx, 'requiredSkills')}
                    className="hover:text-indigo-900 dark:hover:text-indigo-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(skillsInput, 'requiredSkills');
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Type and press Enter to add"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nice-to-Have Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.niceToHaveSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx, 'niceToHaveSkills')}
                    className="hover:text-green-900 dark:hover:text-green-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={niceSkillsInput}
              onChange={(e) => setNiceSkillsInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(niceSkillsInput, 'niceToHaveSkills');
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Type and press Enter to add"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Additional notes about this application..."
            />
          </div>

          {/* Resume Suggestions */}
          {form.resumeSuggestions.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Resume Suggestions
                </h3>
                <button
                  type="button"
                  onClick={handleGenerateSuggestions}
                  disabled={generatingSuggestions}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50 flex items-center gap-1"
                >
                  {generatingSuggestions ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  Regenerate
                </button>
              </div>
              <div className="space-y-2">
                {form.resumeSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group"
                  >
                    <p className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                      {suggestion}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopySuggestion(suggestion, idx)}
                      className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-all"
                      title="Copy to clipboard"
                    >
                      {copiedIdx === idx ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between gap-3 pt-2">
            {!isNew && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
