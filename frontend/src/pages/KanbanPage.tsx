import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { applicationApi, aiApi } from '../api';
import { isRateLimitError, getErrorMessage } from '../api/client';
import type { Application, ApplicationStatus, ParsedJobDescription } from '../types';
import { KanbanColumn } from '../components/KanbanColumn';
import { ApplicationModal } from '../components/ApplicationModal';
import { Plus, Search, Filter, AlertCircle } from 'lucide-react';

const COLUMNS: { id: ApplicationStatus; title: string; color: string }[] = [
  { id: 'Applied', title: 'Applied', color: 'bg-blue-500' },
  { id: 'Phone Screen', title: 'Phone Screen', color: 'bg-yellow-500' },
  { id: 'Interview', title: 'Interview', color: 'bg-purple-500' },
  { id: 'Offer', title: 'Offer', color: 'bg-green-500' },
  { id: 'Rejected', title: 'Rejected', color: 'bg-red-500' },
];

export function KanbanPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'All'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [parseJdOpen, setParseJdOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: applicationApi.getAll,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      applicationApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  const applications = data?.applications || [];

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      searchQuery === '' ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'All' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCardClick = (app: Application) => {
    setSelectedApp(app);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedApp({
      _id: '',
      company: '',
      role: '',
      jdLink: '',
      notes: '',
      dateApplied: new Date().toISOString(),
      status: 'Applied',
      requiredSkills: [],
      niceToHaveSkills: [],
      resumeSuggestions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Application);
    setModalOpen(true);
  };

  const handleParseJD = () => {
    setParseJdOpen(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !active) return;

    const appId = active.id as string;
    const newStatus = over.id as ApplicationStatus;

    const validStatuses: ApplicationStatus[] = [
      'Applied',
      'Phone Screen',
      'Interview',
      'Offer',
      'Rejected',
    ];

    if (validStatuses.includes(newStatus)) {
      updateStatusMutation.mutate({
        id: appId,
        status: newStatus,
      });
    }
  };

  const handleJDParsed = (parsed: ParsedJobDescription & { jobDescription: string }) => {
    setSelectedApp({
      _id: '',
      company: parsed.company,
      role: parsed.role,
      requiredSkills: parsed.requiredSkills,
      niceToHaveSkills: parsed.niceToHaveSkills,
      seniority: parsed.seniority,
      location: parsed.location,
      status: 'Applied',
      dateApplied: new Date().toISOString(),
      resumeSuggestions: [],
      jdLink: '',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Application);
    setModalOpen(true);
    setParseJdOpen(false);
    setApiError(null);
  };

  const handleApiError = (error: unknown) => {
    if (isRateLimitError(error)) {
      const message = getErrorMessage(error);
      setApiError(`⚠️ OpenAI API Rate Limit: ${message}. Please check your plan and billing details, or try again later.`);
    } else {
      setApiError('An error occurred. Please try again.');
    }
    setTimeout(() => setApiError(null), 10000);
  };

  return (
    <div>
      {/* API Error Alert */}
      {apiError && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 animate-pulse">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800 dark:text-red-300 font-medium">{apiError}</p>
          </div>
          <button
            onClick={() => setApiError(null)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Job Applications
        </h1>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | 'All')}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm appearance-none"
            >
              <option value="All">All Status</option>
              {COLUMNS.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleParseJD}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Parse JD
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            No applications yet
          </p>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Your First Application
          </button>
        </div>
      ) : (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                applications={filteredApplications.filter(
                  (app) => app.status === column.id
                )}
                onCardClick={handleCardClick}
                onDrop={(appId) => {
                  updateStatusMutation.mutate({
                    id: appId,
                    status: column.id,
                  });
                }}
              />
            ))}
          </div>
        </DndContext>
      )}

      {modalOpen && selectedApp && (
        <ApplicationModal
          application={selectedApp}
          onClose={() => {
            setModalOpen(false);
            setSelectedApp(null);
          }}
          onSave={() => {
            setModalOpen(false);
            setSelectedApp(null);
            queryClient.invalidateQueries({ queryKey: ['applications'] });
          }}
        />
      )}

      {parseJdOpen && (
        <ParseJDModal
          onClose={() => setParseJdOpen(false)}
          onParsed={handleJDParsed}
          onError={handleApiError}
        />
      )}
    </div>
  );
}

interface ParseJDModalProps {
  onClose: () => void;
  onParsed: (parsed: ParsedJobDescription & { jobDescription: string }) => void;
  onError: (error: unknown) => void;
}

function ParseJDModal({ onClose, onParsed, onError }: ParseJDModalProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleParse = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await aiApi.parseJobDescription(jobDescription);
      onParsed({ ...result.parsed, jobDescription });
    } catch (err) {
      onError(err);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Parse Job Description
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Paste a job description and AI will extract the key details
          </p>
        </div>

        <div className="p-6">
          <textarea
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              setError('');
            }}
            placeholder="Paste the full job description here..."
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleParse}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Parsing...' : 'Parse & Create Card'}
          </button>
        </div>
      </div>
    </div>
  );
}
