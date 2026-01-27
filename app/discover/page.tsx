'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  const [ideas, setIdeas] = useState<AppIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterRevenue, setFilterRevenue] = useState<string>('all');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/elevate/discover');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
        if (data.categories.length > 0) {
          setSelectedCategory(data.categories[0].id);
        }
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

    setGenerating(true);
    try {
      const res = await fetch('/api/elevate/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          api_key: apiKey,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIdeas(data.ideas || []);
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

  const startProject = async (idea: AppIdea) => {
    const apiKey = localStorage.getItem('claudeApiKey');
    if (!apiKey) {
      alert('Please add your Claude API key in Settings first.');
      return;
    }

    setLoading(true);
    try {
      // Create the project
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

        // Redirect to the new project
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

  const filteredIdeas = ideas.filter(idea => {
    if (filterDifficulty !== 'all' && idea.difficulty !== filterDifficulty) return false;
    if (filterRevenue !== 'all' && !idea.revenue_model.toLowerCase().includes(filterRevenue)) return false;
    return true;
  });

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    advanced: 'bg-red-100 text-red-700 border-red-200',
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
        <p className="text-[#808191] text-lg">AI-powered app idea generator. Find high-demand, low-competition opportunities.</p>
      </div>

      {/* Category Selection */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-[#808191] uppercase tracking-wider mb-3">Select a Niche</h2>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedCategory === cat.id
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
          disabled={generating}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#47A8DF] to-[#3B96C9] text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {generating ? (
            <>
              <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating Ideas...
            </>
          ) : (
            <>
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Fresh Ideas
            </>
          )}
        </button>
      </div>

      {/* Filters */}
      {ideas.length > 0 && (
        <div className="mb-6 flex gap-4 items-center">
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
          <span className="text-sm text-[#808191] ml-auto">{filteredIdeas.length} ideas</span>
        </div>
      )}

      {/* Ideas Grid */}
      {filteredIdeas.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {filteredIdeas.map((idea, index) => (
            <div key={index} className="bg-white rounded-xl border border-[#E4E4E4] p-6 hover:border-[#47A8DF] transition-all hover:shadow-lg">
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="text-4xl">{idea.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#11142D] mb-1">{idea.name}</h3>
                  <p className="text-[#808191]">{idea.description}</p>
                </div>
              </div>

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

              {/* Start Project Button */}
              <button
                onClick={() => startProject(idea)}
                disabled={loading}
                className="w-full px-4 py-3 bg-[#47A8DF] text-white rounded-xl font-semibold hover:bg-[#3B96C9] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
          ))}
        </div>
      )}

      {/* Empty State */}
      {!generating && ideas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💡</div>
          <p className="text-[#808191] text-lg">Select a niche and click "Generate Fresh Ideas" to discover opportunities!</p>
        </div>
      )}
    </div>
  );
}
