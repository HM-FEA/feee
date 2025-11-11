'use client';

import React, { useState } from 'react';
import { Report, EntityType } from '@/lib/store/reportStore';
import { Save, X, Eye, Edit3, Tag, Link as LinkIcon } from 'lucide-react';

interface ReportEditorProps {
  initialReport?: Partial<Report>;
  entityId?: string;
  entityName?: string;
  entityType?: EntityType;
  onSave: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'upvotes' | 'downvotes' | 'views' | 'linkedEntities'>) => void;
  onCancel: () => void;
  currentUser: string;
}

export default function ReportEditor({
  initialReport,
  entityId = '',
  entityName = '',
  entityType = 'company',
  onSave,
  onCancel,
  currentUser,
}: ReportEditorProps) {
  const [title, setTitle] = useState(initialReport?.title || '');
  const [summary, setSummary] = useState(initialReport?.summary || '');
  const [content, setContent] = useState(initialReport?.content || '');
  const [tags, setTags] = useState<string[]>(initialReport?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState<Report['category']>(initialReport?.category || 'technical');
  const [isPublic, setIsPublic] = useState(initialReport?.isPublic ?? true);
  const [sources, setSources] = useState<string[]>(initialReport?.sources || []);
  const [sourceInput, setSourceInput] = useState('');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddSource = () => {
    if (sourceInput.trim() && !sources.includes(sourceInput.trim())) {
      setSources([...sources, sourceInput.trim()]);
      setSourceInput('');
    }
  };

  const handleRemoveSource = (source: string) => {
    setSources(sources.filter(s => s !== source));
  };

  const handleSave = () => {
    if (!title.trim() || !summary.trim() || !content.trim()) {
      alert('Title, summary, and content are required');
      return;
    }

    onSave({
      entityId: entityId || initialReport?.entityId || '',
      entityType: entityType || initialReport?.entityType || 'company',
      entityName: entityName || initialReport?.entityName || '',
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      author: currentUser,
      tags,
      category,
      isPublic,
      sources,
    });
  };

  const insertLink = () => {
    const entityNamePrompt = prompt('Enter entity name (e.g., "NVIDIA", "SK Hynix"):');
    if (entityNamePrompt) {
      const newContent = content + `[[${entityNamePrompt}]]`;
      setContent(newContent);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">
          {initialReport ? 'Edit Report' : 'New Analyst Report'}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded transition-colors"
          >
            {mode === 'edit' ? (
              <>
                <Eye className="w-4 h-4 text-slate-300" />
                <span className="text-sm text-slate-300">Preview</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 text-slate-300" />
                <span className="text-sm text-slate-300">Edit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {mode === 'edit' ? (
        <div className="space-y-4">
          {/* Entity Info (if creating new report) */}
          {!initialReport && (
            <div className="bg-slate-800/50 border border-slate-600 rounded p-3">
              <div className="text-xs text-slate-400 mb-1">Report for:</div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs text-slate-300">
                  {entityType.toUpperCase()}
                </span>
                <span className="text-sm font-medium text-white">{entityName || entityId}</span>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="NVIDIA H100 Supply Chain Analysis"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Summary (1-2 sentences)
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief overview of the report..."
              rows={2}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Report['category'])}
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
            >
              <option value="technical">Technical</option>
              <option value="financial">Financial</option>
              <option value="strategic">Strategic</option>
              <option value="market">Market</option>
              <option value="supply-chain">Supply Chain</option>
            </select>
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-300">
                Content (Markdown supported)
              </label>
              <button
                onClick={insertLink}
                className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-xs text-slate-300 transition-colors"
              >
                <LinkIcon className="w-3 h-3" />
                Insert [[Link]]
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Report Title&#10;&#10;## Section 1&#10;Use [[Entity Name]] to link to other entities...&#10;&#10;### Key Points&#10;- Point 1&#10;- Point 2"
              rows={16}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-sm resize-none"
            />
            <div className="mt-1 text-xs text-slate-500">
              Use [[Entity Name]] syntax to link entities. Markdown formatting supported.
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tag..."
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-slate-300"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sources */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Sources (URLs)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={sourceInput}
                onChange={(e) => setSourceInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSource()}
                placeholder="https://..."
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddSource}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Add
              </button>
            </div>
            {sources.length > 0 && (
              <div className="space-y-1">
                {sources.map((source, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-2 py-1 bg-slate-800 border border-slate-600 rounded"
                  >
                    <span className="text-xs text-slate-300 truncate flex-1">{source}</span>
                    <button
                      onClick={() => handleRemoveSource(source)}
                      className="ml-2 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 bg-slate-800 border-slate-600 rounded"
            />
            <label htmlFor="isPublic" className="text-sm text-slate-300">
              Make this report public (visible to community)
            </label>
          </div>
        </div>
      ) : (
        // Preview Mode
        <div className="prose prose-invert prose-sm max-w-none">
          <h1>{title || 'Untitled Report'}</h1>
          <p className="text-slate-400 italic">{summary || 'No summary provided'}</p>
          <div
            dangerouslySetInnerHTML={{
              __html: content
                .replace(/\[\[([^\]]+)\]\]/g, '<span class="text-blue-400">$1</span>')
                .replace(/\n/g, '<br/>')
            }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          <Save className="w-4 h-4" />
          {initialReport ? 'Update Report' : 'Create Report'}
        </button>
      </div>
    </div>
  );
}
