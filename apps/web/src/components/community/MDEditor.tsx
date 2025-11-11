'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FileText, Eye, Edit3, Save, Download, Sparkles } from 'lucide-react';
import { Card, Button } from '@/components/ui/DesignSystem';
import { ALL_EXPANDED_ENTITIES } from '@/data/expandedKnowledgeGraph';

/**
 * Markdown Editor with [[entity-links]] autocomplete
 *
 * Obsidian-style editor for writing analyst reports with entity references
 */

interface MDEditorProps {
  initialContent?: string;
  onSave?: (content: string, title: string) => void;
}

export default function MDEditor({ initialContent = '', onSave }: MDEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState('Untitled Report');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0 });
  const [autocompleteQuery, setAutocompleteQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Build entity search index
  const entityIndex = useMemo(() => {
    return ALL_EXPANDED_ENTITIES.map((entity) => ({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      displayName: `${entity.name} (${entity.type})`,
    }));
  }, []);

  // Filter entities based on autocomplete query
  const filteredEntities = useMemo(() => {
    if (!autocompleteQuery) return entityIndex.slice(0, 10);

    const query = autocompleteQuery.toLowerCase();
    return entityIndex
      .filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.id.toLowerCase().includes(query) ||
          e.type.toLowerCase().includes(query)
      )
      .slice(0, 10);
  }, [autocompleteQuery, entityIndex]);

  // Handle content change and detect [[ trigger
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const cursorPosition = e.target.selectionStart;

    setContent(newContent);

    // Check if user just typed [[
    const textBeforeCursor = newContent.slice(0, cursorPosition);
    const lastOpenBrackets = textBeforeCursor.lastIndexOf('[[');
    const lastCloseBrackets = textBeforeCursor.lastIndexOf(']]');

    if (lastOpenBrackets > lastCloseBrackets && lastOpenBrackets >= 0) {
      // User is inside [[ ]]
      const query = textBeforeCursor.slice(lastOpenBrackets + 2);

      // Calculate autocomplete position
      if (textareaRef.current) {
        const lineHeight = 20; // Approximate line height
        const lines = textBeforeCursor.split('\n').length;
        const top = lines * lineHeight + 60;
        const left = 20;

        setAutocompletePosition({ top, left });
        setAutocompleteQuery(query);
        setShowAutocomplete(true);
        setSelectedIndex(0);
      }
    } else {
      setShowAutocomplete(false);
    }
  };

  // Insert entity link
  const insertEntityLink = (entityId: string) => {
    if (!textareaRef.current) return;

    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);

    // Find the [[ position
    const lastOpenBrackets = textBeforeCursor.lastIndexOf('[[');

    // Replace from [[ to cursor with [[entityId]]
    const newContent =
      content.slice(0, lastOpenBrackets) + `[[${entityId}]]` + textAfterCursor;

    setContent(newContent);
    setShowAutocomplete(false);

    // Move cursor after the inserted link
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = lastOpenBrackets + entityId.length + 4;
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Handle keyboard navigation in autocomplete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showAutocomplete) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredEntities.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (filteredEntities[selectedIndex]) {
        e.preventDefault();
        insertEntityLink(filteredEntities[selectedIndex].id);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowAutocomplete(false);
    }
  };

  // Render markdown preview (simplified)
  const renderPreview = () => {
    let html = content;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-text-primary mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-text-primary mt-6 mb-3">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-text-primary mt-8 mb-4">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-text-primary">$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Entity links [[entity-id]]
    html = html.replace(
      /\[\[(.*?)\]\]/g,
      '<span class="px-2 py-0.5 bg-accent-cyan/20 text-accent-cyan rounded border border-accent-cyan/50 text-sm font-mono cursor-pointer hover:bg-accent-cyan/30 transition-colors">$1</span>'
    );

    // Code blocks
    html = html.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-background-secondary text-accent-magenta rounded text-sm font-mono">$1</code>');

    // Bullet lists
    html = html.replace(/^\- (.*$)/gim, '<li class="ml-4 text-text-secondary">• $1</li>');

    // Paragraphs
    html = html.split('\n\n').map(p => `<p class="text-text-secondary leading-relaxed mb-4">${p}</p>`).join('');

    return html;
  };

  const handleSave = () => {
    if (onSave) {
      onSave(content, title);
    } else {
      alert(`Report "${title}" saved locally (mock)`);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const entityLinkCount = (content.match(/\[\[.*?\]\]/g) || []).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Report Title"
            className="w-full text-2xl font-bold text-text-primary bg-transparent border-none focus:outline-none placeholder:text-text-tertiary"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Toggle */}
          <div className="flex gap-1 bg-background-secondary rounded-lg p-1">
            <button
              onClick={() => setMode('edit')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                mode === 'edit'
                  ? 'bg-accent-cyan text-black'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Edit3 size={14} className="inline mr-1" />
              Edit
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                mode === 'preview'
                  ? 'bg-accent-magenta text-black'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Eye size={14} className="inline mr-1" />
              Preview
            </button>
          </div>

          <Button variant="secondary" size="sm" onClick={handleDownload}>
            <Download size={14} className="mr-1" />
            Download
          </Button>

          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save size={14} className="mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 text-xs text-text-tertiary">
        <span>{wordCount} words</span>
        <span>{content.split('\n').length} lines</span>
        <span className="text-accent-cyan">{entityLinkCount} entity links</span>
        <span className="flex items-center gap-1">
          <Sparkles size={12} className="text-accent-magenta" />
          Type <code className="px-1 bg-background-secondary rounded">[[</code> for entity autocomplete
        </span>
      </div>

      {/* Editor / Preview */}
      <Card className="relative min-h-[600px]">
        {mode === 'edit' ? (
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="Start writing your analyst report... Type [[ to link entities from the knowledge graph."
              className="w-full h-[600px] px-4 py-3 bg-transparent border-none text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none resize-none font-mono leading-relaxed"
            />

            {/* Autocomplete Dropdown */}
            {showAutocomplete && filteredEntities.length > 0 && (
              <div
                className="absolute z-50 bg-background-primary border-2 border-accent-cyan rounded-lg shadow-2xl w-96 max-h-64 overflow-y-auto"
                style={{
                  top: `${autocompletePosition.top}px`,
                  left: `${autocompletePosition.left}px`,
                }}
              >
                <div className="p-2">
                  <div className="text-xs text-text-tertiary mb-2 px-2">
                    Select entity (↑↓ to navigate, Enter/Tab to insert)
                  </div>
                  {filteredEntities.map((entity, idx) => (
                    <button
                      key={entity.id}
                      onClick={() => insertEntityLink(entity.id)}
                      className={`w-full text-left px-3 py-2 rounded transition-all ${
                        idx === selectedIndex
                          ? 'bg-accent-cyan/20 border border-accent-cyan'
                          : 'hover:bg-background-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-text-primary truncate">
                            {entity.name}
                          </div>
                          <div className="text-xs text-text-tertiary font-mono truncate">
                            {entity.id}
                          </div>
                        </div>
                        <div className="text-xs px-2 py-0.5 bg-background-tertiary text-accent-cyan rounded">
                          {entity.type}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className="px-4 py-3 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview() }}
          />
        )}
      </Card>

      {/* Tips */}
      <Card className="bg-accent-cyan/5 border-accent-cyan/30">
        <div className="text-xs text-text-secondary space-y-2">
          <div className="font-semibold text-accent-cyan mb-2">💡 Markdown Tips</div>
          <div className="grid grid-cols-2 gap-2">
            <div><code className="text-accent-magenta"># Heading 1</code> → Large heading</div>
            <div><code className="text-accent-magenta">## Heading 2</code> → Medium heading</div>
            <div><code className="text-accent-magenta">**bold**</code> → <strong>Bold text</strong></div>
            <div><code className="text-accent-magenta">*italic*</code> → <em>Italic text</em></div>
            <div><code className="text-accent-magenta">- item</code> → Bullet list</div>
            <div><code className="text-accent-magenta">[[entity-id]]</code> → <span className="text-accent-cyan">Entity link</span></div>
          </div>
        </div>
      </Card>
    </div>
  );
}
