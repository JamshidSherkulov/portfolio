import { Link } from 'react-router-dom'

const HOW_IT_WORKS = [
  {
    title: 'Create your profile',
    text: 'Set up your student or employer profile in minutes.',
  },
  {
    title: 'Show real work',
    text: 'Students add projects, tech stacks, GitHub links, and proof summaries.',
  },
  {
    title: 'Get discovered',
    text: 'Employers search candidates by skills, projects, and experience.',
  },
]

const AUDIENCE = [
  {
    title: 'For Students',
    text: 'Build a proof-of-work portfolio that shows what you can actually do.',
  },
  {
    title: 'For Employers',
    text: 'Find junior developers through projects instead of only CV keywords.',
  },
]

function SectionCard({ title, text }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
    </article>
  )
}

function AuthButtons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Link
        to="/register"
        className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700"
      >
        Create account
      </Link>
      <Link
        to="/login"
        className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Sign in
      </Link>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-16 text-center lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Proof-of-work recruitment
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Show what you can build, not just what you claim
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Portfolia helps junior developers prove their skills with real projects
          and helps employers discover motivated talent.
        </p>
        <div className="mt-10">
          <AuthButtons />
        </div>
      </section>

      <section className="border-t border-slate-200 py-16 lg:py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How it works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            A simple flow for students to showcase work and employers to find talent.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <SectionCard key={item.title} title={item.title} text={item.text} />
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 py-16 lg:py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Built for both sides
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Portfolia connects junior developers and hiring teams through real proof of work.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {AUDIENCE.map((item) => (
            <SectionCard key={item.title} title={item.title} text={item.text} />
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 py-16 lg:py-20">
        <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Ready to build your proof-of-work portfolio?
          </h2>
          <p className="mt-4 text-slate-600">
            Create your account and start showcasing your projects today.
          </p>
          <div className="mt-8">
            <AuthButtons />
          </div>
        </div>
      </section>
    </div>
  )
}
