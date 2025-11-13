'use client';

import React, { useState, useEffect } from 'react';
import { useReportStore, SAMPLE_REPORTS } from '@/lib/store/reportStore';
import ReportViewer from '@/components/reports/ReportViewer';
import ReportEditor from '@/components/reports/ReportEditor';
import ReportList from '@/components/reports/ReportList';
import { FileText, ArrowLeft, Edit, Trash2 } from 'lucide-react';

type ViewMode = 'list' | 'view' | 'edit' | 'create';

export default function ReportsPage() {
  const {
    reports,
    createReport,
    updateReport,
    deleteReport,
    voteReport,
    incrementViews,
  } = useReportStore();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [currentUser] = useState('user-analyst'); // In real app, get from auth

  // Initialize with sample reports if empty
  useEffect(() => {
    if (Object.keys(reports).length === 0) {
      SAMPLE_REPORTS.forEach(sampleReport => {
        createReport(sampleReport);
      });
    }
  }, []);

  const selectedReport = selectedReportId ? reports[selectedReportId] : null;
  const reportList = Object.values(reports);

  const handleReportClick = (reportId: string) => {
    setSelectedReportId(reportId);
    incrementViews(reportId);
    setViewMode('view');
  };

  const handleCreateNew = () => {
    setSelectedReportId(null);
    setViewMode('create');
  };

  const handleEdit = () => {
    if (selectedReportId) {
      setViewMode('edit');
    }
  };

  const handleDelete = () => {
    if (selectedReportId && confirm('Are you sure you want to delete this report?')) {
      deleteReport(selectedReportId);
      setViewMode('list');
      setSelectedReportId(null);
    }
  };

  const handleSave = (reportData: any) => {
    if (selectedReportId) {
      // Update existing
      updateReport(selectedReportId, reportData);
    } else {
      // Create new
      const newId = createReport(reportData);
      setSelectedReportId(newId);
    }
    setViewMode('view');
  };

  const handleCancel = () => {
    if (viewMode === 'create') {
      setViewMode('list');
      setSelectedReportId(null);
    } else if (viewMode === 'edit') {
      setViewMode('view');
    }
  };

  const handleVote = (vote: 'up' | 'down') => {
    if (selectedReportId) {
      voteReport(selectedReportId, vote);
    }
  };

  const handleEntityClick = (entityId: string) => {
    console.log('Navigate to entity:', entityId);
    // In real app, navigate to entity detail or graph view
    alert(`Navigate to entity: ${entityId}`);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedReportId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-accent-cyan" />
            <h1 className="text-3xl font-bold text-text-primary">Analyst Reports</h1>
          </div>
          <p className="text-text-secondary">
            Community-driven research and analysis on companies, products, and supply chains
          </p>
        </div>

        {/* Content */}
        {viewMode === 'list' && (
          <ReportList
            reports={reportList}
            onReportClick={handleReportClick}
            onCreateNew={handleCreateNew}
          />
        )}

        {viewMode === 'view' && selectedReport && (
          <div>
            {/* Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 px-3 py-2 bg-background-secondary hover:bg-background-tertiary border border-border-primary rounded transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-text-secondary" />
                <span className="text-sm text-text-secondary">Back to Reports</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedReport.author === currentUser && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-3 py-2 bg-accent-cyan hover:bg-accent-cyan/80 text-white rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-3 py-2 bg-accent-magenta hover:bg-accent-magenta/80 text-white rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <ReportViewer
              report={selectedReport}
              onVote={handleVote}
              onEntityClick={handleEntityClick}
            />
          </div>
        )}

        {(viewMode === 'edit' || viewMode === 'create') && (
          <div>
            {/* Navigation */}
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 px-3 py-2 mb-4 bg-background-secondary hover:bg-background-tertiary border border-border-primary rounded transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-text-secondary" />
              <span className="text-sm text-text-secondary">Back to Reports</span>
            </button>

            <ReportEditor
              initialReport={viewMode === 'edit' ? selectedReport : undefined}
              onSave={handleSave}
              onCancel={handleCancel}
              currentUser={currentUser}
            />
          </div>
        )}
      </div>
    </div>
  );
}
