import { Project } from '@/lib/elevate-types';

export function OverviewTab({ project }: { project: Project }) {
  const completionItems = [
    { name: 'App', done: !!project.app_dna?.problem_solved },
    { name: 'Brand', done: !!project.brand_dna?.your_story },
    { name: 'Customer', done: !!project.customer_dna?.main_problem },
    { name: 'Research', done: project.progress >= 25 },
    { name: 'Build', done: !!project.app_dna?.deploy_url },
    { name: 'Launch', done: project.progress >= 75 },
    { name: 'Market', done: project.progress >= 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#11142D] mb-4">Project Completion</h3>
        <div className="space-y-2">
          {completionItems.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div className={`size-5 rounded-full flex items-center justify-center ${
                item.done ? 'bg-green-500' : 'bg-[#E4E4E4]'
              }`}>
                {item.done && (
                  <svg className="size-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={item.done ? 'text-[#11142D]' : 'text-[#808191]'}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-[#F7F8FA] rounded-xl">
          <p className="text-sm text-[#808191]">Status</p>
          <p className="text-lg font-semibold text-[#11142D] capitalize">{project.status}</p>
        </div>
        <div className="p-4 bg-[#F7F8FA] rounded-xl">
          <p className="text-sm text-[#808191]">Progress</p>
          <p className="text-lg font-semibold text-[#11142D]">{project.progress}%</p>
        </div>
        <div className="p-4 bg-[#F7F8FA] rounded-xl">
          <p className="text-sm text-[#808191]">Created</p>
          <p className="text-lg font-semibold text-[#11142D]">
            {new Date(project.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
