import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Application, ApplicationStatus } from '../types';
import { Building2, MapPin, Calendar } from 'lucide-react';

interface KanbanColumnProps {
  column: { id: ApplicationStatus; title: string; color: string };
  applications: Application[];
  onCardClick: (app: Application) => void;
  onDrop: (appId: string) => void;
}

export function KanbanColumn({
  column,
  applications,
  onCardClick,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-3 min-h-[500px]">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
          {column.title}
        </h3>
        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
          {applications.length}
        </span>
      </div>

      <div ref={setNodeRef} className="space-y-2">
        <SortableContext
          items={applications.map((a) => a._id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((app) => (
            <KanbanCard
              key={app._id}
              app={app}
              onClick={() => onCardClick(app)}
            />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-600 text-sm">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

interface KanbanCardProps {
  app: Application;
  onClick: () => void;
}

function KanbanCard({ app, onClick }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: app._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all"
    >
      <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
        {app.role}
      </h4>
      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-2">
        <Building2 className="w-3 h-3" />
        <span>{app.company}</span>
      </div>
      {app.location && (
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500 mb-1">
          <MapPin className="w-3 h-3" />
          <span>{app.location}</span>
        </div>
      )}
      <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
        <Calendar className="w-3 h-3" />
        <span>{new Date(app.dateApplied).toLocaleDateString()}</span>
      </div>
      {app.requiredSkills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {app.requiredSkills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-xs px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded"
            >
              {skill}
            </span>
          ))}
          {app.requiredSkills.length > 3 && (
            <span className="text-xs text-gray-400">+{app.requiredSkills.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
}
