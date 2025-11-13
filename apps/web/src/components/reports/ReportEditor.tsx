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
    <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-primary">
        <h2 className="text-xl font-bold text-text-primary">
          {initialReport ? 'Edit Report' : 'New Analyst Report'}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
            className="flex items-center gap-2 px-3 py-1.5 bg-background-tertiary hover:bg-background-primary border border-border-secondary rounded transition-colors"
          >
            {mode === 'edit' ? (
              <>
                <Eye className="w-4 h-4 text-text-tertiary" />
                <span className="text-sm text-text-tertiary">Preview</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 text-text-tertiary" />
                <span className="text-sm text-text-tertiary">Edit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {mode === 'edit' ? (
        <div className="space-y-4">
          {/* Entity Info (if creating new report) */}
          {!initialReport && (
            <div className="bg-background-tertiary border border-border-secondary rounded p-3">
              <div className="text-xs text-text-secondary mb-1">Report for:</div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-background-primary border border-border-secondary rounded text-xs text-text-tertiary">
                  {entityType.toUpperCase()}
                </span>
                <span className="text-sm font-medium text-text-primary">{entityName || entityId}</span>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-tertiary mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="NVIDIA H100 Supply Chain Analysis"
              className="w-full px-3 py-2 bg-background-tertiary border border-border-secondary rounded text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-cyan"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-text-tertiary mb-2">
              Summary (1-2 sentences)
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief overview of the report..."
              rows={2}
              className="w-full px-3 py-2 bg-background-tertiary border border-border-secondary rounded text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-cyan resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-text-tertiary mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Report['category'])}
              className="px-3 py-2 bg-background-tertiary border border-border-secondary rounded text-text-primary focus:outline-none focus:border-accent-cyan"
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
              <label className="block text-sm font-medium text-text-tertiary">
                Content (Markdown supported)
              </label>
              <button
                onClick={insertLink}
                className="flex items-center gap-1 px-2 py-1 bg-background-tertiary hover:bg-background-primary border border-border-secondary rounded text-xs text-text-tertiary transition-colors"
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
              className="w-full px-3 py-2 bg-background-tertiary border border-border-secondary rounded text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-cyan font-mono text-sm resize-none"
            />
            <div className="mt-1 text-xs text-text-tertiary">
              Use [[Entity Name]] syntax to link entities. Markdown formatting supported.
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-text-tertiary mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tag..."
                className="flex-1 px-3 py-2 bg-background-tertiary border border-border-secondary rounded text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-cyan"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-accent-cyan hover:bg-accent-cyan/80 text-black rounded transition-colors"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2 py-1 bg-background-tertiary border border-border-secondary rounded text-xs text-text-tertiary"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-text-tertiary hover:text-text-secondary"
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
            <label className="block text-sm font-medium text-text-tertiary mb-2">Sources (URLs)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={sourceInput}
                onChange={(e) => setSourceInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSource()}
                placeholder="https://..."
                className="flex-1 px-3 py-2 bg-background-tertiary border border-border-secondary rounded text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-cyan"
              />
              <button
                onClick={handleAddSource}
                className="px-4 py-2 bg-accent-cyan hover:bg-accent-cyan/80 text-black rounded transition-colors"
              >
                Add
              </button>
            </div>
            {sources.length > 0 && (
              <div className="space-y-1">
                {sources.map((source, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-2 py-1 bg-background-tertiary border border-border-secondary rounded"
                  >
                    <span className="text-xs text-text-tertiary truncate flex-1">{source}</span>
                    <button
                      onClick={() => handleRemoveSource(source)}
                      className="ml-2 text-text-tertiary hover:text-text-secondary"
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
              className="w-4 h-4 bg-background-tertiary border-border-secondary rounded"
            />
            <label htmlFor="isPublic" className="text-sm text-text-tertiary">
              Make this report public (visible to community)
            </label>
          </div>
        </div>
      ) : (
        // Preview Mode
        <div className="prose prose-invert prose-sm max-w-none">
          <h1>{title || 'Untitled Report'}</h1>
          <p className="text-text-secondary italic">{summary || 'No summary provided'}</p>
          <div
            dangerouslySetInnerHTML={{
              __html: content
                .replace(/\[\[([^\]]+)\]\]/g, '<span class="text-accent-cyan">$1</span>')
                .replace(/\n/g, '<br/>')
            }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border-primary">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-background-tertiary hover:bg-background-primary border border-border-secondary text-text-tertiary rounded transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-accent-cyan hover:bg-accent-cyan/80 text-black rounded transition-colors"
        >
          <Save className="w-4 h-4" />
          {initialReport ? 'Update Report' : 'Create Report'}
        </button>
      </div>
    </div>
  );
}
