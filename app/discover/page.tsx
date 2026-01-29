'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ViabilityScoreBadge } from '@/components/ui/ViabilityScoreCard';

interface ViabilityScore {
  overall: number;
  market_size: number;
  competition: number;
  demand: number;
  monetization: number;
  trend: number;
  verdict: 'go' | 'caution' | 'no-go';
}

interface AppIdea {
  name: string;
  description: string;
  target_market: string;
  problem_solved: string;
  revenue_model: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  build_time: string;
  unique_mechanism: string;
  emoji: string;
  viability_score?: ViabilityScore;
}

interface Category {
  id: string;
  name: string;
  emoji: string;
}

export default function DiscoverPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [freeformInput, setFreeformInput] = useState<string>('');
  const [ideas, setIdeas] = useState<AppIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterRevenue, setFilterRevenue] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('score');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/elevate/discover');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateIdeas = async () => {
    const apiKey = localStorage.getItem('claudeApiKey');
    if (!apiKey) {
      alert('Please add your Claude API key in Settings first.');
      return;
    }

    const startTime = Date.now();
    setGenerating(true);
    setGenerationTime(null);
    
    try {
      const res = await fetch('/api/elevate/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          freeform: freeformInput.trim() || null,
          api_key: apiKey,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIdeas(data.ideas || []);
        setGenerationTime(Math.round((Date.now() - startTime) / 1000));
      } else {
        const error = await res.json();
        alert(`Failed to generate ideas: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error generating ideas:', error);
      alert('Failed to generate ideas. Check console for details.');
    } finally {
      setGenerating(false);
    }
  };

  const surpriseMe = () => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    if (randomCategory) {
      setSelectedCategory(randomCategory.id);
      setFreeformInput('');
    }
  };

  const startProject = async (idea: AppIdea) => {
    const apiKey = localStorage.getItem('claudeApiKey');
    if (!apiKey) {
      alert('Please add your Claude API key in Settings first.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/elevate/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: idea.name,
          api_key: apiKey,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const project = data.project;

        // Pre-fill App DNA
        if (project.app_dna_id) {
          await fetch(`/api/elevate/dnas/app/${project.app_dna_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: idea.name,
              tagline: idea.description,
              problem_solved: idea.problem_solved,
              unique_mechanism: idea.unique_mechanism,
            }),
          });
        }

        // Pre-fill Customer DNA
        if (project.customer_dna_id) {
          await fetch(`/api/elevate/dnas/customer/${project.customer_dna_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              target_market: idea.target_market,
              main_problem: idea.problem_solved,
            }),
          });
        }

        router.push(`/projects/${project.id}`);
      } else {
        const error = await res.json();
        alert(`Failed to create project: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort ideas
  const processedIdeas = ideas
    .filter(idea => {
      if (filterDifficulty !== 'all' && idea.difficulty !== filterDifficulty) return false;
      if (filterRevenue !== 'all' && !idea.revenue_model.toLowerCase().includes(filterRevenue)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') {
        return (b.viability_score?.overall || 0) - (a.viability_score?.overall || 0);
      }
      if (sortBy === 'difficulty') {
        const order = { beginner: 0, intermediate: 1, advanced: 2 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return 0;
    });

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    advanced: 'bg-red-100 text-red-700 border-red-200',
  };

  const getVerdictColor = (verdict?: string) => {
    switch (verdict) {
      case 'go': return 'border-green-300 bg-green-50/50';
      case 'caution': return 'border-yellow-300 bg-yellow-50/50';
      case 'no-go': return 'border-red-300 bg-red-50/50';
      default: return 'border-[#E4E4E4]';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Link href="/" className="text-[#808191] hover:text-[#11142D]">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-[#11142D]">💡 Discover App Ideas</h1>
        </div>
        <p className="text-[#808191] text-lg">
          AI-validated app ideas in seconds. Stop guessing, start building what people want.
        </p>
      </div>

      {/* Freeform Input */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-[#808191] uppercase tracking-wider mb-2 block">
          Describe Your Niche or Idea
        </label>
        <div className="relative">
          <input
            type="text"
            value={freeformInput}
            onChange={(e) => setFreeformInput(e.target.value)}
            placeholder="e.g., AI tools for real estate agents, habit tracking for busy parents..."
            className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none text-lg"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">✨</span>
        </div>
        <p className="text-sm text-[#808191] mt-2">
          ⚡ Type anything — the more specific, the better the ideas
        </p>
      </div>

      {/* Category Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#808191] uppercase tracking-wider">Or Pick a Category</h2>
          <button
            onClick={surpriseMe}
            className="text-sm text-[#47A8DF] hover:underline flex items-center gap-1"
          >
            🎲 Surprise Me
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setFreeformInput('');
              }}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedCategory === cat.id && !freeformInput
                  ? 'border-[#47A8DF] bg-[#E0F2FE]'
                  : 'border-[#E4E4E4] bg-white hover:border-[#47A8DF]'
              }`}
            >
              <div className="text-2xl mb-1">{cat.emoji}</div>
              <div className="font-semibold text-[#11142D]">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="mb-8">
        <button
          onClick={generateIdeas}
          disabled={generating || (!selectedCategory && !freeformInput.trim())}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#47A8DF] to-[#3B96C9] text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {generating ? (
            <>
              <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating & Scoring Ideas...
            </>
          ) : (
            <>
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Ideas with Viability Scores
            </>
          )}
        </button>
        <p className="text-center text-sm text-[#808191] mt-2">
          ⚡ Results in ~30 seconds • Includes market viability scoring
        </p>
      </div>

      {/* Results Header with Filters */}
      {ideas.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#808191]">Filter:</span>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[#E4E4E4] bg-white text-[#11142D] focus:border-[#47A8DF] focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select
              value={filterRevenue}
              onChange={(e) => setFilterRevenue(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[#E4E4E4] bg-white text-[#11142D] focus:border-[#47A8DF] focus:outline-none"
            >
              <option value="all">All Revenue Models</option>
              <option value="subscription">Subscription</option>
              <option value="one-time">One-time</option>
              <option value="freemium">Freemium</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[#E4E4E4] bg-white text-[#11142D] focus:border-[#47A8DF] focus:outline-none"
            >
              <option value="score">Sort by Score</option>
              <option value="difficulty">Sort by Difficulty</option>
            </select>
            <span className="text-sm text-[#808191]">
              {processedIdeas.length} ideas
              {generationTime && ` • Generated in ${generationTime}s`}
            </span>
          </div>
        </div>
      )}

      {/* Ideas Grid */}
      {processedIdeas.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {processedIdeas.map((idea, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-all ${getVerdictColor(idea.viability_score?.verdict)}`}
            >
              {/* Header with Score */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-4xl">{idea.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#11142D] mb-1">{idea.name}</h3>
                    <p className="text-[#808191]">{idea.description}</p>
                  </div>
                </div>
                {idea.viability_score && (
                  <ViabilityScoreBadge score={idea.viability_score.overall} />
                )}
              </div>

              {/* Viability Mini-Bars */}
              {idea.viability_score && (
                <div className="mb-4 p-3 bg-[#F7F8FA] rounded-lg">
                  <div className="grid grid-cols-5 gap-2 text-xs">
                    {[
                      { label: 'Market', value: idea.viability_score.market_size },
                      { label: 'Competition', value: idea.viability_score.competition },
                      { label: 'Demand', value: idea.viability_score.demand },
                      { label: 'Revenue', value: idea.viability_score.monetization },
                      { label: 'Trend', value: idea.viability_score.trend },
                    ].map(({ label, value }) => (
                      <div key={label} className="text-center">
                        <div className="h-1 bg-[#E4E4E4] rounded-full mb-1 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${value >= 71 ? 'bg-green-500' : value >= 41 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <span className="text-[#808191]">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs font-semibold text-[#808191] uppercase mb-1">Target Market</p>
                  <p className="text-sm text-[#11142D]">{idea.target_market}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#808191] uppercase mb-1">Problem Solved</p>
                  <p className="text-sm text-[#11142D]">{idea.problem_solved}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#808191] uppercase mb-1">Unique Approach</p>
                  <p className="text-sm text-[#11142D]">{idea.unique_mechanism}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors[idea.difficulty]}`}>
                  {idea.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                  {idea.build_time}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                  {idea.revenue_model}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => startProject(idea)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-[#47A8DF] text-white rounded-xl font-semibold hover:bg-[#3B96C9] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Start Project
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!generating && ideas.length === 0 && (
        <div className="text-center py-12 bg-[#F7F8FA] rounded-xl">
          <div className="text-6xl mb-4">💡</div>
          <p className="text-[#11142D] text-lg font-semibold mb-2">Ready to discover your next app?</p>
          <p className="text-[#808191]">
            Type a niche above or pick a category, then click "Generate Ideas"
          </p>
          <p className="text-sm text-[#808191] mt-4">
            ⚡ Each idea includes a viability score to help you decide what to build
          </p>
        </div>
      )}
    </div>
  );
}
