'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Template } from '@/lib/elevate-types';
import { LoadingState, PageHeader } from '@/components/ui';

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
    <div className="p-8">
      {/* Header */}
      <PageHeader
        title="App Templates"
        subtitle="Start building with a proven template"
        backHref="/"
        backLabel="Back to Dashboard"
      />

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              filter === cat
                ? 'bg-[#47A8DF] text-white'
                : 'bg-white text-[#808191] border border-[#E4E4E4] hover:border-[#11142D]'
            }`}
          >
            {cat === 'all' ? 'All Templates' : cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {loading ? (
        <LoadingState 
          title="Loading templates..."
          subtitle="Fetching available app templates"
        />
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-[#E4E4E4] overflow-hidden hover:border-[#11142D] hover:shadow-md transition-all group"
            >
              {/* Template Preview */}
              <div className="h-40 bg-[#F7F8FA] flex items-center justify-center">
                <span className="text-6xl">{template.icon}</span>
              </div>
              
              {/* Template Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-[#11142D] group-hover:text-[#1a1a2e] transition-colors">
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
                      <span key={i} className="px-2 py-1 bg-[#F7F8FA] text-[#808191] rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="text-[#808191]">{template.estimated_hours}h</span>
                </div>
                
                {/* CTA */}
                <Link
                  href={`/?template=${template.id}`}
                  className="mt-4 block w-full text-center px-4 py-2 bg-[#47A8DF] text-white rounded-lg font-medium hover:bg-[#3B96C9] transition-colors"
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
