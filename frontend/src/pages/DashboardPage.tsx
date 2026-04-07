import { useQuery } from '@tanstack/react-query';
import { applicationApi } from '../api';
import type { ApplicationStatus } from '../types';
import {
  Building2,
  PhoneCall,
  Users,
  Award,
  XCircle,
  TrendingUp,
  Download,
} from 'lucide-react';

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  Applied: {
    icon: <Building2 className="w-6 h-6" />,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
  },
  'Phone Screen': {
    icon: <PhoneCall className="w-6 h-6" />,
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/40',
  },
  Interview: {
    icon: <Users className="w-6 h-6" />,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/40',
  },
  Offer: {
    icon: <Award className="w-6 h-6" />,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/40',
  },
  Rejected: {
    icon: <XCircle className="w-6 h-6" />,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/40',
  },
};

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: applicationApi.getAll,
  });

  const applications = data?.applications || [];

  const stats = {
    total: applications.length,
    byStatus: {
      Applied: applications.filter((a) => a.status === 'Applied').length,
      'Phone Screen': applications.filter(
        (a) => a.status === 'Phone Screen'
      ).length,
      Interview: applications.filter((a) => a.status === 'Interview').length,
      Offer: applications.filter((a) => a.status === 'Offer').length,
      Rejected: applications.filter((a) => a.status === 'Rejected').length,
    },
  };

  const handleExportCSV = () => {
    const headers = [
      'Company',
      'Role',
      'Status',
      'Location',
      'Date Applied',
      'Required Skills',
      'Notes',
    ];
    const rows = applications.map((app) => [
      app.company,
      app.role,
      app.status,
      app.location || '',
      new Date(app.dateApplied).toLocaleDateString(),
      (app.requiredSkills || []).join('; '),
      (app.notes || '').replace(/"/g, '""'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `job-applications-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const interviewRate =
    stats.total > 0
      ? (
          ((stats.byStatus['Phone Screen'] +
            stats.byStatus.Interview +
            stats.byStatus.Offer) /
            stats.total) *
          100
        ).toFixed(1)
      : '0';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <button
          onClick={handleExportCSV}
          disabled={applications.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Applications
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Interview Rate
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {interviewRate}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Offers Received
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.byStatus.Offer}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                  <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Applications by Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {(Object.keys(STATUS_CONFIG) as ApplicationStatus[]).map((status) => {
              const config = STATUS_CONFIG[status];
              const count = stats.byStatus[status];
              const percentage =
                stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : '0';

              return (
                <div
                  key={status}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
                >
                  <div
                    className={`inline-flex p-2 rounded-lg ${config.bg} ${config.color} mb-3`}
                  >
                    {config.icon}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{status}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {count}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {percentage}% of total
                  </p>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Applications */}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Applications
          </h2>
          {applications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No applications yet. Start tracking your job applications!
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {applications.slice(0, 10).map((app) => (
                      <tr
                        key={app._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {app.company}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {app.role}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_CONFIG[app.status].bg
                            } ${STATUS_CONFIG[app.status].color}`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(app.dateApplied).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
