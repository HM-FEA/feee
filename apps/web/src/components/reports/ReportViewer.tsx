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
    technical: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    financial: 'bg-green-500/20 text-green-300 border-green-500/30',
    strategic: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    market: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'supply-chain': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  };

  return (
    <div className={`bg-slate-900 border border-slate-700 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="border-b border-slate-700 pb-4 mb-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">{report.title}</h1>
            <p className="text-slate-400 text-sm">{report.summary}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[report.category]}`}>
            {report.category.toUpperCase()}
          </div>
        </div>

        {/* Entity Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-slate-300">
            {report.entityType.toUpperCase()}
          </span>
          <span className="text-sm font-medium text-white">{report.entityName}</span>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
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
          <div className="text-slate-500">v{report.version}</div>
        </div>

        {/* Tags */}
        {report.tags.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <Tag className="w-3 h-3 text-slate-500" />
            <div className="flex flex-wrap gap-2">
              {report.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs">
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
        <div className="border-t border-slate-700 pt-4 mb-4">
          <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
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
                className="block text-xs text-blue-400 hover:text-blue-300 truncate"
              >
                {source}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Linked Entities */}
      {report.linkedEntities.length > 0 && (
        <div className="border-t border-slate-700 pt-4 mb-4">
          <h3 className="text-sm font-semibold text-white mb-2">Referenced Entities</h3>
          <div className="flex flex-wrap gap-2">
            {report.linkedEntities.map(entityId => (
              <button
                key={entityId}
                onClick={() => onEntityClick(entityId)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-xs text-slate-300 transition-colors"
              >
                {entityId}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Voting */}
      <div className="border-t border-slate-700 pt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onVote('up')}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-green-500/20 border border-slate-600 hover:border-green-500/30 rounded transition-colors group"
          >
            <ThumbsUp className="w-4 h-4 text-slate-400 group-hover:text-green-400" />
            <span className="text-sm font-medium text-slate-300 group-hover:text-green-300">
              {report.upvotes}
            </span>
          </button>
          <button
            onClick={() => onVote('down')}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-red-500/20 border border-slate-600 hover:border-red-500/30 rounded transition-colors group"
          >
            <ThumbsDown className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
            <span className="text-sm font-medium text-slate-300 group-hover:text-red-300">
              {report.downvotes}
            </span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .wiki-link {
          color: #60a5fa;
          cursor: pointer;
          text-decoration: none;
          border-bottom: 1px dashed #60a5fa;
          transition: all 0.2s;
        }
        .wiki-link:hover {
          color: #93c5fd;
          border-bottom-color: #93c5fd;
          background: rgba(96, 165, 250, 0.1);
        }
        .prose h1 { @apply text-2xl font-bold text-white mt-6 mb-4; }
        .prose h2 { @apply text-xl font-bold text-white mt-5 mb-3; }
        .prose h3 { @apply text-lg font-semibold text-slate-200 mt-4 mb-2; }
        .prose p { @apply text-slate-300 mb-3; }
        .prose ul, .prose ol { @apply text-slate-300 mb-3 ml-4; }
        .prose li { @apply mb-1; }
        .prose strong { @apply text-white font-semibold; }
        .prose code { @apply bg-slate-800 px-1.5 py-0.5 rounded text-sm text-cyan-300; }
        .prose a { @apply text-blue-400 hover:text-blue-300; }
        .prose blockquote { @apply border-l-4 border-slate-600 pl-4 italic text-slate-400; }
      `}</style>
    </div>
  );
}
