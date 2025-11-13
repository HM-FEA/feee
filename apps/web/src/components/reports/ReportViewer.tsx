'use client';

import React from 'react';
import { Report } from '@/lib/store/reportStore';
import { ThumbsUp, ThumbsDown, Eye, Calendar, User, Tag, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReportViewerProps {
  report: Report;
  onVote: (vote: 'up' | 'down') => void;
  onEntityClick: (entityId: string) => void;
  className?: string;
}

export default function ReportViewer({ report, onVote, onEntityClick, className = '' }: ReportViewerProps) {
  // Convert [[Entity]] links to clickable spans
  const processMarkdown = (content: string) => {
    return content.replace(/\[\[([^\]]+)\]\]/g, (match, entityName) => {
      const entityId = entityName.toLowerCase().replace(/\s+/g, '-');
      return `<span class="wiki-link" data-entity-id="${entityId}">[${entityName}]</span>`;
    });
  };

  const handleContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('wiki-link')) {
      const entityId = target.getAttribute('data-entity-id');
      if (entityId) {
        onEntityClick(entityId);
      }
    }
  };

  const categoryColors: Record<Report['category'], string> = {
    technical: 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30',
    financial: 'bg-status-safe/20 text-status-safe border-status-safe/30',
    strategic: 'bg-accent-magenta/20 text-accent-magenta border-accent-magenta/30',
    market: 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30',
    'supply-chain': 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30',
  };

  return (
    <div className={`bg-background-secondary border border-border-primary rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="border-b border-border-primary pb-4 mb-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text-primary mb-2">{report.title}</h1>
            <p className="text-text-secondary text-sm">{report.summary}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[report.category]}`}>
            {report.category.toUpperCase()}
          </div>
        </div>

        {/* Entity Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-background-tertiary border border-border-secondary rounded text-xs text-text-tertiary">
            {report.entityType.toUpperCase()}
          </span>
          <span className="text-sm font-medium text-text-primary">{report.entityName}</span>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{report.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(report.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{report.views.toLocaleString()} views</span>
          </div>
          <div className="text-text-tertiary">v{report.version}</div>
        </div>

        {/* Tags */}
        {report.tags.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <Tag className="w-3 h-3 text-text-tertiary" />
            <div className="flex flex-wrap gap-2">
              {report.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-background-tertiary text-text-tertiary rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="prose prose-invert prose-sm max-w-none mb-6"
        onClick={handleContentClick}
        dangerouslySetInnerHTML={{ __html: processMarkdown(report.content) }}
      />

      {/* Sources */}
      {report.sources.length > 0 && (
        <div className="border-t border-border-primary pt-4 mb-4">
          <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Sources
          </h3>
          <div className="space-y-1">
            {report.sources.map((source, idx) => (
              <a
                key={idx}
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-accent-cyan hover:text-accent-cyan/80 truncate"
              >
                {source}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Linked Entities */}
      {report.linkedEntities.length > 0 && (
        <div className="border-t border-border-primary pt-4 mb-4">
          <h3 className="text-sm font-semibold text-text-primary mb-2">Referenced Entities</h3>
          <div className="flex flex-wrap gap-2">
            {report.linkedEntities.map(entityId => (
              <button
                key={entityId}
                onClick={() => onEntityClick(entityId)}
                className="px-2 py-1 bg-background-tertiary hover:bg-background-primary border border-border-secondary rounded text-xs text-text-tertiary transition-colors"
              >
                {entityId}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Voting */}
      <div className="border-t border-border-primary pt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onVote('up')}
            className="flex items-center gap-2 px-3 py-1.5 bg-background-tertiary hover:bg-status-safe/20 border border-border-secondary hover:border-status-safe/30 rounded transition-colors group"
          >
            <ThumbsUp className="w-4 h-4 text-text-secondary group-hover:text-status-safe" />
            <span className="text-sm font-medium text-text-tertiary group-hover:text-status-safe">
              {report.upvotes}
            </span>
          </button>
          <button
            onClick={() => onVote('down')}
            className="flex items-center gap-2 px-3 py-1.5 bg-background-tertiary hover:bg-status-danger/20 border border-border-secondary hover:border-status-danger/30 rounded transition-colors group"
          >
            <ThumbsDown className="w-4 h-4 text-text-secondary group-hover:text-status-danger" />
            <span className="text-sm font-medium text-text-tertiary group-hover:text-status-danger">
              {report.downvotes}
            </span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .wiki-link {
          color: var(--accent-cyan);
          cursor: pointer;
          text-decoration: none;
          border-bottom: 1px dashed var(--accent-cyan);
          transition: all 0.2s;
        }
        .wiki-link:hover {
          color: var(--accent-cyan-hover);
          border-bottom-color: var(--accent-cyan-hover);
          background: rgba(0, 255, 255, 0.1);
        }
        .prose h1 { @apply text-2xl font-bold text-text-primary mt-6 mb-4; }
        .prose h2 { @apply text-xl font-bold text-text-primary mt-5 mb-3; }
        .prose h3 { @apply text-lg font-semibold text-text-secondary mt-4 mb-2; }
        .prose p { @apply text-text-tertiary mb-3; }
        .prose ul, .prose ol { @apply text-text-tertiary mb-3 ml-4; }
        .prose li { @apply mb-1; }
        .prose strong { @apply text-text-primary font-semibold; }
        .prose code { @apply bg-background-tertiary px-1.5 py-0.5 rounded text-sm text-accent-cyan; }
        .prose a { @apply text-accent-cyan hover:text-accent-cyan/80; }
        .prose blockquote { @apply border-l-4 border-border-secondary pl-4 italic text-text-secondary; }
      `}</style>
    </div>
  );
}
