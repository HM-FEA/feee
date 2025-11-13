'use client';

import React, { useState } from 'react';
import { Report, EntityType } from '@/lib/store/reportStore';
import { Search, Filter, TrendingUp, Clock, Eye, ThumbsUp, FileText, Tag } from 'lucide-react';

interface ReportListProps {
  reports: Report[];
  onReportClick: (reportId: string) => void;
  onCreateNew?: () => void;
}

type SortOption = 'recent' | 'popular' | 'views';
type FilterOption = 'all' | EntityType;

export default function ReportList({ reports, onReportClick, onCreateNew }: ReportListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      report.entityName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterBy === 'all' || report.entityType === filterBy;

    return matchesSearch && matchesFilter;
  });

  // Sort reports
  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'popular':
        return b.upvotes - a.upvotes;
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const categoryColors: Record<Report['category'], string> = {
    technical: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    financial: 'bg-green-500/20 text-green-300 border-green-500/30',
    strategic: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    market: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'supply-chain': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  };

  return (
    <div className="space-y-4">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports, tags, entities..."
            className="w-full pl-10 pr-4 py-2 bg-background-secondary border border-border-primary rounded text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-cyan"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 bg-background-secondary border border-border-primary rounded text-text-primary text-sm focus:outline-none focus:border-accent-cyan"
          >
            <option value="recent">
              <Clock className="inline w-3 h-3 mr-1" /> Recent
            </option>
            <option value="popular">Popular</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-secondary" />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            className="px-3 py-2 bg-background-secondary border border-border-primary rounded text-text-primary text-sm focus:outline-none focus:border-accent-cyan"
          >
            <option value="all">All Types</option>
            <option value="company">Companies</option>
            <option value="product">Products</option>
            <option value="component">Components</option>
            <option value="sector">Sectors</option>
            <option value="macro">Macro</option>
            <option value="technology">Technology</option>
            <option value="relationship">Relationships</option>
          </select>
        </div>

        {/* Create New Button */}
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-accent-cyan hover:bg-accent-cyan/80 text-white rounded transition-colors whitespace-nowrap"
          >
            + New Report
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-text-secondary">
        {sortedReports.length} {sortedReports.length === 1 ? 'report' : 'reports'} found
      </div>

      {/* Report Cards */}
      <div className="space-y-3">
        {sortedReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-text-secondary">No reports found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-sm text-accent-cyan hover:text-accent-cyan/80"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          sortedReports.map(report => (
            <button
              key={report.id}
              onClick={() => onReportClick(report.id)}
              className="w-full text-left bg-background-secondary border border-border-primary hover:border-accent-cyan/50 rounded-lg p-4 transition-all hover:shadow-lg hover:shadow-accent-cyan/10 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Title & Category */}
                  <div className="flex items-start gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
                      {report.title}
                    </h3>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium border ${categoryColors[report.category]}`}>
                      {report.category}
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                    {report.summary}
                  </p>

                  {/* Entity Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-background-tertiary border border-border-primary rounded text-xs text-text-secondary">
                      {report.entityType.toUpperCase()}
                    </span>
                    <span className="text-xs text-text-secondary">{report.entityName}</span>
                  </div>

                  {/* Tags */}
                  {report.tags.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-3 h-3 text-text-tertiary" />
                      <div className="flex flex-wrap gap-1">
                        {report.tags.slice(0, 4).map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 bg-background-tertiary text-text-secondary rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                        {report.tags.length > 4 && (
                          <span className="px-1.5 py-0.5 text-text-tertiary text-xs">
                            +{report.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-text-tertiary">
                    <span>{report.author}</span>
                    <span>•</span>
                    <span>{new Date(report.updatedAt).toLocaleDateString()}</span>
                    {report.version > 1 && (
                      <>
                        <span>•</span>
                        <span>v{report.version}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 text-accent-emerald">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{report.upvotes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-text-secondary">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs">{report.views.toLocaleString()}</span>
                  </div>
                  {report.linkedEntities.length > 0 && (
                    <div className="text-xs text-text-tertiary">
                      {report.linkedEntities.length} linked
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
