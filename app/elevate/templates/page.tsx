'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Template } from '@/lib/elevate-types';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/elevate/templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(templates.map(t => t.category).filter((c): c is string => Boolean(c)))];
  const filteredTemplates = filter === 'all' 
    ? templates 
    : templates.filter(t => t.category === filter);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/elevate" className="text-[#808191] hover:text-[#11142D]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#11142D]">App Templates</h1>
          <p className="text-[#808191]">Start building with a proven template</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filter === cat
                ? 'bg-[#009FE2] text-white'
                : 'bg-white text-[#808191] border border-[#E4E4E4] hover:border-[#009FE2]'
            }`}
          >
            {cat === 'all' ? 'All Templates' : cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="text-center py-12 text-[#808191]">Loading templates...</div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-[#E4E4E4] overflow-hidden hover:border-[#009FE2] hover:shadow-lg transition-all group"
            >
              {/* Template Preview */}
              <div className="h-40 bg-gradient-to-br from-[#F7F8FA] to-[#E4E4E4] flex items-center justify-center">
                <span className="text-6xl">{template.icon}</span>
              </div>
              
              {/* Template Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-[#11142D] group-hover:text-[#009FE2] transition-colors">
                    {template.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    template.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                    template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {template.difficulty}
                  </span>
                </div>
                
                <p className="text-sm text-[#808191] mb-4">{template.description}</p>
                
                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {(template.features || []).slice(0, 3).map((feature, i) => (
                      <span key={i} className="px-2 py-1 bg-[#F7F8FA] rounded text-xs text-[#808191]">
                        {feature}
                      </span>
                    ))}
                    {(template.features || []).length > 3 && (
                      <span className="px-2 py-1 bg-[#F7F8FA] rounded text-xs text-[#808191]">
                        +{(template.features || []).length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Tech Stack */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex gap-1">
                    {(template.tech_stack || []).slice(0, 3).map((tech, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="text-[#808191]">{template.estimated_hours}h</span>
                </div>
                
                {/* CTA */}
                <Link
                  href={`/elevate?template=${template.id}`}
                  className="mt-4 block w-full text-center px-4 py-2 bg-[#009FE2] text-white rounded-xl font-medium hover:bg-[#0088C2] transition-colors"
                >
                  Use This Template
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
