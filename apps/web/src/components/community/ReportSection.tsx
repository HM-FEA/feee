'use client';

import React, { useState, useMemo } from 'react';
import { FileText, Download, Sparkles, TrendingUp, Search, AlertTriangle, Globe, Copy, Check, Edit3, Bot } from 'lucide-react';
import { Card, Button } from '@/components/ui/DesignSystem';
import { useScenarioStore, Scenario } from '@/lib/store/scenarioStore';
import {
  generateReport,
  REPORT_TEMPLATES,
  ReportType,
} from '@/lib/utils/reportGenerator';
import MDEditor from './MDEditor';

/**
 * Report Section - Generate AI analyst reports from scenarios or write manually
 */
export default function ReportSection() {
  const [reportMode, setReportMode] = useState<'ai' | 'manual'>('ai');
  const { getAllScenarios } = useScenarioStore();
  const allScenarios = getAllScenarios();

  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('scenario_analysis');
  const [additionalContext, setAdditionalContext] = useState('');
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedScenario = useMemo(() => {
    return allScenarios.find((s) => s.id === selectedScenarioId) || null;
  }, [allScenarios, selectedScenarioId]);

  const handleGenerateReport = () => {
    if (!selectedScenario) {
      alert('Please select a scenario first');
      return;
    }

    setIsGenerating(true);
    setGeneratedReport(null);

    // Simulate AI generation delay
    setTimeout(() => {
      const report = generateReport(selectedScenario, selectedReportType, additionalContext);
      setGeneratedReport(report);
      setIsGenerating(false);
    }, 1500);
  };

  const handleDownload = () => {
    if (!generatedReport) return;

    const blob = new Blob([generatedReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedScenario?.name.replace(/\s+/g, '_')}_${selectedReportType}_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!generatedReport) return;

    navigator.clipboard.writeText(generatedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getReportTypeIcon = (type: ReportType) => {
    switch (type) {
      case 'scenario_analysis':
        return <TrendingUp size={20} />;
      case 'sector_deep_dive':
        return <Search size={20} />;
      case 'risk_assessment':
        return <AlertTriangle size={20} />;
      case 'macro_outlook':
        return <Globe size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            {reportMode === 'ai' ? (
              <>
                <Sparkles size={24} className="text-accent-magenta" />
                AI Report Generator
              </>
            ) : (
              <>
                <Edit3 size={24} className="text-accent-cyan" />
                Write Your Own Report
              </>
            )}
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            {reportMode === 'ai'
              ? 'Generate professional analyst reports from your scenarios (Mock AI)'
              : 'Write custom analyst reports with [[entity-links]] autocomplete'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-1 bg-background-secondary rounded-lg p-1">
          <button
            onClick={() => setReportMode('ai')}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
              reportMode === 'ai'
                ? 'bg-accent-magenta text-black'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Bot size={16} className="inline mr-2" />
            AI Generate
          </button>
          <button
            onClick={() => setReportMode('manual')}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
              reportMode === 'manual'
                ? 'bg-accent-cyan text-black'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Edit3 size={16} className="inline mr-2" />
            Write Manually
          </button>
        </div>
      </div>

      {/* AI Generation Mode */}
      {reportMode === 'ai' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Left: Configuration */}
          <div className="col-span-1 space-y-4">
          {/* Step 1: Select Scenario */}
          <Card>
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-cyan text-black flex items-center justify-center text-xs font-bold">
                1
              </span>
              Select Scenario
            </h3>

            {allScenarios.length === 0 ? (
              <p className="text-xs text-text-tertiary">
                No scenarios available. Create a scenario in the Scenarios tab first.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {allScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenarioId(scenario.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedScenarioId === scenario.id
                        ? 'border-accent-cyan bg-accent-cyan/10'
                        : 'border-border-primary bg-background-secondary hover:border-accent-cyan/50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{scenario.icon || '📊'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-text-primary truncate">
                          {scenario.name}
                        </div>
                        <div className="text-xs text-text-tertiary line-clamp-2 mt-1">
                          {scenario.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Step 2: Select Report Type */}
          <Card>
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-magenta text-black flex items-center justify-center text-xs font-bold">
                2
              </span>
              Select Report Type
            </h3>

            <div className="space-y-2">
              {REPORT_TEMPLATES.map((template) => (
                <button
                  key={template.type}
                  onClick={() => setSelectedReportType(template.type)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedReportType === template.type
                      ? 'border-accent-magenta bg-accent-magenta/10'
                      : 'border-border-primary bg-background-secondary hover:border-accent-magenta/50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{template.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-text-primary">
                        {template.title}
                      </div>
                      <div className="text-xs text-text-tertiary mt-1">
                        {template.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Step 3: Additional Context (Optional) */}
          <Card>
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-emerald text-black flex items-center justify-center text-xs font-bold">
                3
              </span>
              Additional Context (Optional)
            </h3>

            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Add any specific areas you want the report to focus on..."
              className="w-full h-24 px-3 py-2 bg-background-secondary border border-border-primary rounded text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-cyan resize-none"
            />
          </Card>

          {/* Generate Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerateReport}
            disabled={!selectedScenarioId || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Sparkles size={16} className="mr-2 animate-pulse" />
                Generating Report...
              </>
            ) : (
              <>
                <Sparkles size={16} className="mr-2" />
                Generate AI Report
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="text-center">
              <p className="text-xs text-accent-cyan animate-pulse">
                Analyzing scenario and generating insights...
              </p>
            </div>
          )}
        </div>

        {/* Right: Report Preview */}
        <div className="col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <FileText size={16} className="text-accent-cyan" />
                Generated Report
              </h3>

              {generatedReport && (
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check size={14} className="mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="mr-1" />
                        Copy MD
                      </>
                    )}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleDownload}>
                    <Download size={14} className="mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>

            {!generatedReport ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <FileText size={48} className="text-text-tertiary mb-4" />
                <p className="text-sm text-text-secondary mb-2">No report generated yet</p>
                <p className="text-xs text-text-tertiary max-w-md">
                  Select a scenario and report type, then click "Generate AI Report" to create a
                  comprehensive markdown analysis with entity references.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Markdown Preview */}
                <div className="bg-background-secondary border border-border-primary rounded-lg p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                  <pre className="text-xs text-text-primary whitespace-pre-wrap font-mono leading-relaxed">
                    {generatedReport}
                  </pre>
                </div>

                {/* Report Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <Card className="bg-background-secondary">
                    <div className="text-xs text-text-tertiary">Words</div>
                    <div className="text-lg font-bold text-text-primary">
                      {generatedReport.split(/\s+/).length}
                    </div>
                  </Card>
                  <Card className="bg-background-secondary">
                    <div className="text-xs text-text-tertiary">Lines</div>
                    <div className="text-lg font-bold text-text-primary">
                      {generatedReport.split('\n').length}
                    </div>
                  </Card>
                  <Card className="bg-background-secondary">
                    <div className="text-xs text-text-tertiary">Entity Links</div>
                    <div className="text-lg font-bold text-accent-cyan">
                      {(generatedReport.match(/\[\[.*?\]\]/g) || []).length}
                    </div>
                  </Card>
                  <Card className="bg-background-secondary">
                    <div className="text-xs text-text-tertiary">Sections</div>
                    <div className="text-lg font-bold text-text-primary">
                      {(generatedReport.match(/^## /gm) || []).length}
                    </div>
                  </Card>
                </div>

                {/* Info */}
                <div className="bg-accent-magenta/10 border border-accent-magenta/30 rounded-lg p-3">
                  <p className="text-xs text-text-secondary">
                    <strong className="text-accent-magenta">💡 Note:</strong> This is a mock AI
                    report generator. In production, connect to Claude API or GPT-4 for real
                    analysis. Entity links like <code className="text-accent-cyan">[[company-nvidia]]</code>{' '}
                    can be made clickable in Obsidian-style MD editors.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
        </div>
      )}

      {/* Manual Writing Mode */}
      {reportMode === 'manual' && (
        <MDEditor
          onSave={(content, title) => {
            alert(`Report "${title}" saved successfully! (Mock)`);
            // In production, save to database
          }}
        />
      )}
    </div>
  );
}
