'use client';

import React, { useState, useMemo } from 'react';
import { BookOpen, Video, Code, BarChart3, ChevronRight, Search, Lock, Book, Globe, Banknote, Home, TrendingUp, Target, RefreshCw, Settings, Check, Clock, GraduationCap, Lightbulb, X, ChevronLeft, PlayCircle } from 'lucide-react';
import { GlobalTopNav } from '@/components/layout/GlobalTopNav';

// Types
interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  type: 'article' | 'video' | 'interactive' | 'code';
  content: string;
  requiredTier: 'free' | 'pro' | 'premium' | 'institutional';
  completed: boolean;
  tags: string[];
  icon: string;
}

// Mock Data
const MOCK_LESSONS: Lesson[] = [
  { id: 'l1', title: 'Understanding the 4-Level Economic Ontology', description: 'The foundational framework that powers Nexus-Alpha.', category: 'Foundations', subcategory: 'Ontology', difficulty: 'beginner', duration: 15, type: 'article', content: '', requiredTier: 'free', completed: true, tags: ['ontology', 'foundations'], icon: 'diamond' },
  { id: 'l2', title: 'Macro Variables: Interest Rates & Tariffs', description: 'Explore how global interest rate changes impact sectors.', category: 'Foundations', subcategory: 'Macro Variables', difficulty: 'beginner', duration: 12, type: 'video', content: '', requiredTier: 'free', completed: true, tags: ['interest-rates', 'macro'], icon: 'globe' },
  { id: 'l3', title: 'Financial Ratios 101', description: 'Master P/E, ROE, D/E, and ICR.', category: 'Foundations', subcategory: 'Financial Ratios', difficulty: 'beginner', duration: 18, type: 'interactive', content: '', requiredTier: 'free', completed: false, tags: ['ratios', 'valuation'], icon: 'barchart' },
  { id: 'l4', title: 'Fundamental Analysis: Banking Sector', description: 'Learn sector-specific equations for banking.', category: 'Sector Analysis', subcategory: 'Banking', difficulty: 'intermediate', duration: 25, type: 'article', content: '', requiredTier: 'pro', completed: false, tags: ['banking', 'nim'], icon: 'banknote' },
  { id: 'l5', title: 'Real Estate Valuation Methods', description: 'Explore occupancy rates, cap rates, and more.', category: 'Sector Analysis', subcategory: 'Real Estate', difficulty: 'intermediate', duration: 20, type: 'video', content: '', requiredTier: 'pro', completed: false, tags: ['real-estate', 'valuation'], icon: 'home' },
  { id: 'l6', title: 'Technical Analysis: RSI, MACD, etc.', description: 'Master the essential technical indicators.', category: 'Technical Analysis', subcategory: 'Indicators', difficulty: 'intermediate', duration: 22, type: 'interactive', content: '', requiredTier: 'pro', completed: false, tags: ['technical-analysis', 'indicators'], icon: 'trendingup' },
  { id: 'l7', title: 'Building a Macro-Driven Strategy', description: 'Combine macro understanding with stock selection.', category: 'Strategy', subcategory: 'Macro Strategies', difficulty: 'advanced', duration: 45, type: 'code', content: '', requiredTier: 'premium', completed: false, tags: ['strategy', 'macro'], icon: 'target' },
  { id: 'l8', title: 'Advanced Sector Rotation Strategy', description: 'Learn how pros rotate between sectors.', category: 'Strategy', subcategory: 'Sector Rotation', difficulty: 'advanced', duration: 50, type: 'code', content: '', requiredTier: 'premium', completed: false, tags: ['sector-rotation', 'trading'], icon: 'refreshcw' },
  { id: 'l9', title: 'Quant Development: Custom Indicators', description: 'Create your own indicators and integrate them.', category: 'Quant', subcategory: 'Development', difficulty: 'advanced', duration: 60, type: 'code', content: '', requiredTier: 'institutional', completed: false, tags: ['quant', 'python'], icon: 'settings' },
];

const CATEGORIES = [
  { name: 'All', key: 'all', icon: 'book' },
  { name: 'Foundations', key: 'Foundations', icon: 'diamond' },
  { name: 'Sector Analysis', key: 'Sector Analysis', icon: 'home' },
  { name: 'Technical Analysis', key: 'Technical Analysis', icon: 'trendingup' },
  { name: 'Strategy', key: 'Strategy', icon: 'target' },
  { name: 'Quant', key: 'Quant', icon: 'settings' },
];

const DIFFICULTY_COLORS = { beginner: 'bg-green-500/20 text-green-400 border-green-500/30', intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', advanced: 'bg-red-500/20 text-red-400 border-red-500/30' };
const TYPE_ICONS: Record<string, React.ReactNode> = { article: <BookOpen size={16} />, video: <Video size={16} />, interactive: <BarChart3 size={16} />, code: <Code size={16} /> };

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <div className={`bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 sm:p-6 ${className}`}>{children}</div>;

const LessonCard = ({ lesson, userTier = 'pro', onClick }: { lesson: Lesson, userTier?: string, onClick: () => void }) => {
  const isLocked = (lesson.requiredTier === 'premium' && userTier === 'pro') || (lesson.requiredTier === 'institutional' && (userTier === 'pro' || userTier === 'premium'));
  const Icon = { diamond: BarChart3, globe: Globe, barchart: BarChart3, banknote: Banknote, home: Home, trendingup: TrendingUp, target: Target, refreshcw: RefreshCw, settings: Settings }[lesson.icon] || Book;
  return (
    <div onClick={isLocked ? undefined : onClick}>
      <Card className="hover:border-[#2A2A3F] transition-all cursor-pointer group relative">
        {isLocked && <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center backdrop-blur-sm"><div className="text-center"><Lock size={24} className="text-text-secondary mx-auto mb-2" /><p className="text-xs text-text-secondary">Requires {lesson.requiredTier}</p></div></div>}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-2 flex-1">
            <Icon size={24} className="text-accent-cyan mt-1" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">{lesson.title}</h3>
              <p className="text-xs text-text-secondary mt-1 line-clamp-2">{lesson.description}</p>
            </div>
          </div>
          {lesson.completed && <div className="text-accent-cyan text-xs font-semibold ml-2 flex items-center gap-1"><Check size={12}/>Done</div>}
        </div>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className={`text-xs px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[lesson.difficulty]}`}>{lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}</div>
          <div className="text-xs bg-background-tertiary text-text-tertiary px-2 py-0.5 rounded-full flex items-center gap-1">{TYPE_ICONS[lesson.type]}{lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}</div>
          <div className="text-xs text-text-tertiary flex items-center gap-1"><Clock size={12} /> {lesson.duration} min</div>
        </div>
        {lesson.tags.length > 0 && <div className="flex gap-1 mb-3 flex-wrap">{lesson.tags.slice(0, 2).map(tag => <span key={tag} className="text-xs bg-accent-cyan/10 text-accent-cyan px-2 py-0.5 rounded-full">#{tag}</span>)}</div>}
        <div className="flex items-center justify-between pt-3 border-t border-border-primary text-xs"><span className="text-text-tertiary">{lesson.subcategory && `${lesson.subcategory}`}</span><ChevronRight size={14} className="text-text-tertiary group-hover:text-accent-cyan transition-colors" /></div>
      </Card>
    </div>
  );
};

const LessonDetailView = ({ lesson, onClose, onComplete, onNext, onPrev }: { lesson: Lesson, onClose: () => void, onComplete: () => void, onNext?: () => void, onPrev?: () => void }) => {
  const Icon = { diamond: BarChart3, globe: Globe, barchart: BarChart3, banknote: Banknote, home: Home, trendingup: TrendingUp, target: Target, refreshcw: RefreshCw, settings: Settings }[lesson.icon] || Book;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-border-primary p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <Icon size={32} className="text-accent-cyan mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-text-primary mb-2">{lesson.title}</h2>
                <p className="text-sm text-text-secondary">{lesson.description}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`text-xs px-3 py-1 rounded-full border ${DIFFICULTY_COLORS[lesson.difficulty]}`}>
              {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
            </div>
            <div className="text-xs bg-background-tertiary text-text-tertiary px-3 py-1 rounded-full flex items-center gap-1">
              {TYPE_ICONS[lesson.type]}
              {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
            </div>
            <div className="text-xs text-text-tertiary flex items-center gap-1">
              <Clock size={14} /> {lesson.duration} min
            </div>
            {lesson.completed && (
              <div className="text-accent-cyan text-xs font-semibold flex items-center gap-1">
                <Check size={14}/>Completed
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-invert max-w-none">
            {lesson.type === 'video' && (
              <div className="bg-background-secondary rounded-lg flex items-center justify-center h-64 mb-6">
                <PlayCircle size={48} className="text-accent-cyan" />
              </div>
            )}

            <div className="space-y-4 text-sm text-text-secondary">
              <h3 className="text-lg font-semibold text-text-primary">Lesson Content</h3>
              <p>
                This lesson will cover <strong className="text-accent-cyan">{lesson.title.toLowerCase()}</strong>.
                You'll learn about {lesson.subcategory} and how it applies to real-world financial analysis.
              </p>

              <h4 className="text-base font-semibold text-text-primary mt-6">Key Topics:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>Understanding the fundamental concepts</li>
                <li>Practical applications and examples</li>
                <li>Common pitfalls and how to avoid them</li>
                <li>Best practices for implementation</li>
              </ul>

              <h4 className="text-base font-semibold text-text-primary mt-6">Learning Objectives:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>Master core concepts and terminology</li>
                <li>Apply knowledge to real scenarios</li>
                <li>Build practical skills for financial analysis</li>
              </ul>

              {lesson.type === 'code' && (
                <>
                  <h4 className="text-base font-semibold text-text-primary mt-6">Code Example:</h4>
                  <div className="bg-black border border-border-primary rounded-lg p-4 font-mono text-xs">
                    <div className="text-green-400"># Example code snippet</div>
                    <div className="text-text-primary">def calculate_analysis():</div>
                    <div className="text-text-primary ml-4">return "Analysis result"</div>
                  </div>
                </>
              )}

              <div className="bg-accent-cyan/10 border border-accent-cyan/20 rounded-lg p-4 mt-6">
                <p className="text-xs text-accent-cyan">
                  <strong>Pro Tip:</strong> Take notes as you learn and practice immediately on the Platform to reinforce your understanding.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border-primary p-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {onPrev && (
                <button
                  onClick={onPrev}
                  className="px-4 py-2 bg-background-secondary text-text-primary rounded-lg hover:bg-background-tertiary transition-all text-sm flex items-center gap-2"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {!lesson.completed && (
                <button
                  onClick={onComplete}
                  className="px-4 py-2 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/80 transition-all text-sm flex items-center gap-2"
                >
                  <Check size={16} />
                  Mark as Complete
                </button>
              )}
              {onNext && (
                <button
                  onClick={onNext}
                  className="px-4 py-2 bg-background-secondary text-text-primary rounded-lg hover:bg-background-tertiary transition-all text-sm flex items-center gap-2"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgressCard = ({ completed, total }: { completed: number, total: number }) => {
  const percentage = Math.round((completed / total) * 100);
  return (
    <Card className="mb-4">
      <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2"><BarChart3 size={16} /> Your Progress</h3>
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1"><span className="text-text-secondary">{completed} of {total} lessons completed</span><span className="text-accent-cyan font-semibold">{percentage}%</span></div>
        <div className="w-full h-2 bg-background-tertiary rounded-full overflow-hidden"><div className="h-full bg-accent-cyan transition-all duration-300" style={{ width: `${percentage}%` }} /></div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-background-secondary p-2 rounded text-center"><div className="text-text-secondary mb-1">Beginner</div><div className="text-accent-cyan font-semibold">{MOCK_LESSONS.filter(l => l.difficulty === 'beginner' && l.completed).length}</div></div>
        <div className="bg-background-secondary p-2 rounded text-center"><div className="text-text-secondary mb-1">Intermediate</div><div className="text-accent-cyan font-semibold">{MOCK_LESSONS.filter(l => l.difficulty === 'intermediate' && l.completed).length}</div></div>
        <div className="bg-background-secondary p-2 rounded text-center"><div className="text-text-secondary mb-1">Advanced</div><div className="text-accent-cyan font-semibold">{MOCK_LESSONS.filter(l => l.difficulty === 'advanced' && l.completed).length}</div></div>
      </div>
    </Card>
  );
};

export default function LearnPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
  const userTier = 'pro';

  const filteredLessons = useMemo(() => {
    let filtered = lessons;
    if (activeCategory !== 'all') filtered = filtered.filter(l => l.category === activeCategory);
    if (difficultyFilter !== 'all') filtered = filtered.filter(l => l.difficulty === difficultyFilter);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(l => l.title.toLowerCase().includes(term) || l.description.toLowerCase().includes(term) || l.tags.some(tag => tag.toLowerCase().includes(term)));
    }
    return filtered;
  }, [lessons, activeCategory, searchTerm, difficultyFilter]);

  const completedCount = lessons.filter(l => l.completed).length;

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleLessonComplete = () => {
    if (!selectedLesson) return;
    setLessons(prev => prev.map(l => l.id === selectedLesson.id ? { ...l, completed: true } : l));
    setSelectedLesson(prev => prev ? { ...prev, completed: true } : null);
  };

  const handleNextLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex < lessons.length - 1) {
      setSelectedLesson(lessons[currentIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex > 0) {
      setSelectedLesson(lessons[currentIndex - 1]);
    }
  };

    return (
      <div className="relative min-h-screen bg-black text-text-primary">
        <GlobalTopNav />
        {selectedLesson && (
          <LessonDetailView
            lesson={selectedLesson}
            onClose={() => setSelectedLesson(null)}
            onComplete={handleLessonComplete}
            onNext={lessons.findIndex(l => l.id === selectedLesson.id) < lessons.length - 1 ? handleNextLesson : undefined}
            onPrev={lessons.findIndex(l => l.id === selectedLesson.id) > 0 ? handlePrevLesson : undefined}
          />
        )}
        <div className="relative z-10">
        <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-accent-cyan mb-1">Knowledge Base</h1>
            <p className="text-sm text-text-secondary">Master financial analysis, strategy, and trading</p>
          </div>
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input type="text" placeholder="Search lessons..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-background-secondary border border-border-primary rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-cyan" />
            </div>
            <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="bg-background-secondary border border-border-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan text-text-primary">
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map(cat => {
                const Icon = { book: Book, diamond: BarChart3, home: Home, trendingup: TrendingUp, target: Target, settings: Settings }[cat.icon] || Book;
                return (
                  <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${activeCategory === cat.key ? 'bg-accent-cyan text-black' : 'bg-background-secondary text-text-secondary hover:text-text-primary'}`}>
                    <Icon size={16} />
                    {cat.name}
                  </button>
                );
            })}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6 px-6 py-6 h-[calc(100vh-240px)]">
          <div className="col-span-1 overflow-y-auto pr-2">
            <ProgressCard completed={completedCount} total={lessons.length} />
            <Card className="mb-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2"><Lightbulb size={16}/> Learning Tips</h3>
              <ul className="text-xs text-text-secondary space-y-2">
                <li className="flex items-center gap-2"><Check size={12} className="text-accent-cyan"/> Start with Foundations</li>
                <li className="flex items-center gap-2"><Check size={12} className="text-accent-cyan"/> Take notes while learning</li>
                <li className="flex items-center gap-2"><Check size={12} className="text-accent-cyan"/> Apply knowledge in /platform</li>
                <li className="flex items-center gap-2"><Check size={12} className="text-accent-cyan"/> Join /community discussions</li>
                <li className="flex items-center gap-2"><Check size={12} className="text-accent-cyan"/> Practice with /simulate</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2"><GraduationCap size={16}/> Recommended Path</h3>
              <div className="space-y-1 text-xs">
                <div className="bg-background-secondary p-2 rounded"><div className="text-text-secondary">Level 1: Basics</div><div className="text-accent-cyan font-semibold">3-5 hours</div></div>
                <div className="bg-background-secondary p-2 rounded"><div className="text-text-secondary">Level 2: Analysis</div><div className="text-accent-cyan font-semibold">8-12 hours</div></div>
                <div className="bg-background-secondary p-2 rounded"><div className="text-text-secondary">Level 3: Strategy</div><div className="text-accent-cyan font-semibold">12-20 hours</div></div>
              </div>
            </Card>
          </div>
          <div className="col-span-3 overflow-y-auto pr-2">
            {filteredLessons.length > 0 ? <div className="grid grid-cols-2 gap-4">{filteredLessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} userTier={userTier} onClick={() => handleLessonClick(lesson)} />)}</div> : <Card className="text-center py-12"><p className="text-sm text-text-secondary">No lessons found. Try adjusting your filters.</p></Card>}
          </div>
        </div>
      </div>
    </div>
  );
}