import ProjectCard from '../components/ProjectCard'

export default function StudentProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Your projects</h1>
      <p className="mt-2 text-slate-600">
        Manage portfolio projects that demonstrate your skills.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCard />
        <ProjectCard project={{ title: 'Sample project', description: 'A preview of how project cards will look.', techStack: 'React · Spring Boot' }} />
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Placeholder — connect to /api/projects/me in the next step.
      </p>
    </div>
  )
}
