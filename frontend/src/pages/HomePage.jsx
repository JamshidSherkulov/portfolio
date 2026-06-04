import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mediaQuery.matches)

    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return reducedMotion
}

function ScrollRevealSection({
  children,
  className = '',
  as: Tag = 'section',
  reducedMotion: reducedMotionProp,
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const reducedMotionInternal = usePrefersReducedMotion()
  const reducedMotion = reducedMotionProp ?? reducedMotionInternal

  useEffect(() => {
    const element = ref.current
    if (!element) {
      return undefined
    }

    if (reducedMotion) {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [reducedMotion])

  const revealClass = reducedMotion
    ? 'opacity-100'
    : visible
      ? 'translate-y-0 opacity-100'
      : 'translate-y-5 opacity-0'

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-[600ms] ease-out ${revealClass} ${className}`}
    >
      {children}
    </Tag>
  )
}

function FloatingBackgroundShapes({ reducedMotion }) {
  const shapes = [
    {
      className: 'left-[-6%] top-[6%] h-56 w-56 sm:h-64 sm:w-64',
      animationClass: 'homepage-float-12',
    },
    {
      className: 'right-[-4%] top-[14%] h-64 w-64 sm:h-72 sm:w-72',
      animationClass: 'homepage-float-16',
    },
    {
      className: 'left-[8%] top-[42%] h-72 w-72 sm:h-80 sm:w-80',
      animationClass: 'homepage-float-20',
    },
    {
      className: 'bottom-[8%] right-[6%] h-64 w-64 sm:h-72 sm:w-72',
      animationClass: 'homepage-float-24',
    },
  ]

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 top-[70vh] overflow-hidden"
      aria-hidden="true"
    >
      {shapes.map((shape) => (
        <div
          key={shape.animationClass}
          className={`absolute rounded-full bg-indigo-500/15 blur-3xl ${shape.className} ${
            reducedMotion ? '' : shape.animationClass
          }`}
        />
      ))}
    </div>
  )
}

function HeroAmbientBlobs({ reducedMotion }) {
  const animate = (className) => (reducedMotion ? '' : className)

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className={`absolute -left-[300px] -top-[200px] h-[700px] w-[700px] rounded-full bg-purple-500/15 blur-[140px] ${animate('homepage-hero-blob-1')}`}
      />
      <div
        className={`absolute -right-[250px] top-[50px] h-[600px] w-[600px] rounded-full bg-indigo-500/12 blur-[140px] ${animate('homepage-hero-blob-2')}`}
      />
      <div
        className={`absolute -bottom-[250px] left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-purple-500/8 blur-[180px] ${animate('homepage-hero-blob-3')}`}
      />
    </div>
  )
}

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

const SHOWCASE_CANDIDATES = [
  {
    name: 'Emily Johnson',
    role: 'Junior Frontend Developer',
    location: 'Manchester, UK',
    projectCount: 3,
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript'],
    proofHighlight:
      'Built responsive dashboards and reusable UI components for student productivity applications.',
  },
  {
    name: 'Daniel Carter',
    role: 'Junior Backend Developer',
    location: 'London, UK',
    projectCount: 2,
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'REST API'],
    proofHighlight:
      'Designed secure REST APIs with JWT authentication, validation, and PostgreSQL persistence.',
  },
  {
    name: 'Michael Thompson',
    role: 'Junior Full-Stack Developer',
    location: 'Birmingham, UK',
    projectCount: 4,
    imageUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    skills: ['React', 'Java', 'Spring Boot', 'Docker'],
    proofHighlight:
      'Built full-stack web applications with authentication, dashboards, and deployment workflows.',
  },
  {
    name: 'Sarah Williams',
    role: 'Junior UI Developer',
    location: 'Leeds, UK',
    projectCount: 2,
    imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    skills: ['Figma', 'React', 'CSS', 'Accessibility'],
    proofHighlight:
      'Created accessible user interfaces with clean component structure and responsive layouts.',
  },
  {
    name: 'James Anderson',
    role: 'Junior DevOps Engineer',
    location: 'Bristol, UK',
    projectCount: 3,
    imageUrl: 'https://randomuser.me/api/portraits/men/41.jpg',
    skills: ['Docker', 'GitHub Actions', 'Linux', 'AWS'],
    proofHighlight:
      'Built CI/CD workflows and containerized applications for reliable deployment.',
  },
  {
    name: 'Olivia Brown',
    role: 'Junior Data Analyst',
    location: 'Glasgow, UK',
    projectCount: 3,
    imageUrl: 'https://randomuser.me/api/portraits/women/25.jpg',
    skills: ['Python', 'SQL', 'Excel', 'Data Visualization'],
    proofHighlight:
      'Built dashboards and analysis projects that turn raw datasets into useful insights.',
  },
]

const EMPLOYER_TRUST_BADGES = [
  'Project Portfolio',
  'GitHub Links',
  'Live Demos',
  'Skills',
  'Proof Summary',
  'Profile Strength',
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

const AUTO_SLIDE_MS = 5000

function getSlidesPerView(width) {
  if (width >= 1024) {
    return 3
  }
  if (width >= 640) {
    return 2
  }
  return 1
}

function chunkCandidates(candidates, size) {
  const pages = []
  for (let i = 0; i < candidates.length; i += size) {
    pages.push(candidates.slice(i, i + size))
  }
  return pages
}

function SectionCard({ title, text }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
    </article>
  )
}

function ShowcaseCandidateCard({ candidate, isVisible }) {
  const projectLabel =
    candidate.projectCount === 1 ? '1 project' : `${candidate.projectCount} projects`

  return (
    <article
      className={`group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 text-left shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className="flex items-start gap-4">
        <img
          src={candidate.imageUrl}
          alt=""
          width={72}
          height={72}
          className="h-[72px] w-[72px] shrink-0 rounded-full object-cover ring-2 ring-slate-100 transition-transform duration-300 group-hover:scale-105"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{candidate.name}</h3>
          <p className="mt-0.5 text-sm font-medium text-indigo-600">{candidate.role}</p>
          <span className="mt-2 inline-block rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-100">
            {projectLabel}
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-600">{candidate.location}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {candidate.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
          >
            {skill}
          </span>
        ))}
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
        <span className="font-medium text-slate-700">Proof highlight: </span>
        {candidate.proofHighlight}
      </p>

      <button
        type="button"
        disabled
        title="Showcase preview only"
        className="mt-6 w-full cursor-not-allowed rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white opacity-60"
      >
        Preview profile
      </button>
    </article>
  )
}

function CarouselArrow({ direction, onClick, label, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition duration-300 hover:scale-[1.02] hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 ${className}`}
    >
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        {direction === 'prev' ? (
          <path
            fillRule="evenodd"
            d="M12.79 5.23a.75.75 0 010 1.06L8.06 10l4.72 4.71a.75.75 0 11-1.06 1.06l-5.25-5.25a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 010-1.06L11.94 10 7.21 5.29a.75.75 0 111.06-1.06l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 01-1.06 0z"
            clipRule="evenodd"
          />
        )}
      </svg>
    </button>
  )
}

function CandidateShowcaseCarousel({ candidates, autoPlayEnabled = true }) {
  const [slidesPerView, setSlidesPerView] = useState(() =>
    typeof window !== 'undefined' ? getSlidesPerView(window.innerWidth) : 3,
  )
  const [page, setPage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [cardsVisible, setCardsVisible] = useState(true)

  const pages = useMemo(
    () => chunkCandidates(candidates, slidesPerView),
    [candidates, slidesPerView],
  )
  const totalPages = pages.length

  useEffect(() => {
    function handleResize() {
      setSlidesPerView(getSlidesPerView(window.innerWidth))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setPage((current) => Math.min(current, Math.max(0, totalPages - 1)))
  }, [totalPages])

  useEffect(() => {
    setCardsVisible(false)
    const timer = window.setTimeout(() => setCardsVisible(true), 50)
    return () => window.clearTimeout(timer)
  }, [page, slidesPerView])

  const goToPage = useCallback(
    (nextPage) => {
      if (totalPages === 0) {
        return
      }
      const normalized = ((nextPage % totalPages) + totalPages) % totalPages
      setPage(normalized)
    },
    [totalPages],
  )

  const goNext = useCallback(() => goToPage(page + 1), [goToPage, page])
  const goPrev = useCallback(() => goToPage(page - 1), [goToPage, page])

  useEffect(() => {
    if (!autoPlayEnabled || isHovered || totalPages <= 1) {
      return undefined
    }

    const intervalId = window.setInterval(goNext, AUTO_SLIDE_MS)
    return () => window.clearInterval(intervalId)
  }, [autoPlayEnabled, goNext, isHovered, totalPages])

  if (totalPages === 0) {
    return null
  }

  return (
    <div
      className="relative mt-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CarouselArrow
        direction="prev"
        onClick={goPrev}
        label="Previous profiles"
        className="left-0 sm:-left-4 lg:-left-5"
      />
      <CarouselArrow
        direction="next"
        onClick={goNext}
        label="Next profiles"
        className="right-0 sm:-right-4 lg:-right-5"
      />

      <div className="overflow-hidden px-10 sm:px-12">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((pageCandidates, pageIndex) => (
            <div
              key={`slide-${pageIndex}-${slidesPerView}`}
              className="flex w-full shrink-0 gap-4 sm:gap-6"
            >
              {pageCandidates.map((candidate) => (
                <div key={candidate.name} className="min-w-0 flex-1">
                  <ShowcaseCandidateCard
                    candidate={candidate}
                    isVisible={cardsVisible && page === pageIndex}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {pages.map((_, index) => (
          <button
            key={`dot-${index}`}
            type="button"
            onClick={() => goToPage(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={page === index ? 'true' : undefined}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              page === index ? 'w-6 bg-indigo-600' : 'w-2.5 bg-slate-300 hover:bg-indigo-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function AuthButtons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Link
        to="/register"
        className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow transition duration-300 hover:scale-[1.02] hover:bg-indigo-700"
      >
        Create account
      </Link>
      <Link
        to="/login"
        className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition duration-300 hover:scale-[1.02] hover:bg-slate-50"
      >
        Sign in
      </Link>
    </div>
  )
}

export default function HomePage() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div className="relative overflow-x-hidden">
      <section className="relative isolate flex min-h-[70vh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-slate-50 px-4 py-16 text-center sm:px-6 lg:py-20">
        <HeroAmbientBlobs reducedMotion={reducedMotion} />
        <div className="relative z-10 mx-auto w-full max-w-6xl">
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
        </div>
      </section>

      <FloatingBackgroundShapes reducedMotion={reducedMotion} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollRevealSection
          reducedMotion={reducedMotion}
          className="border-t border-slate-200 py-16 lg:py-20"
        >
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
        </ScrollRevealSection>

        <ScrollRevealSection
          reducedMotion={reducedMotion}
          className="border-t border-slate-200 py-16 lg:py-20"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Proof-of-work candidate profiles
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Explore how junior developers can present their skills, projects, and proof summaries
              in a professional portfolio.
            </p>
          </div>

          <CandidateShowcaseCarousel
            candidates={SHOWCASE_CANDIDATES}
            autoPlayEnabled={!reducedMotion}
          />

          <div className="mx-auto mt-14 max-w-3xl text-center">
            <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
              What employers actually see
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Employers don&apos;t just see a CV. They see project portfolios, technology stacks,
              GitHub links, live demos, proof summaries, and profile completion scores.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {EMPLOYER_TRUST_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition duration-300 hover:border-indigo-300 hover:shadow-md"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </ScrollRevealSection>

        <ScrollRevealSection
          reducedMotion={reducedMotion}
          className="border-t border-slate-200 py-16 lg:py-20"
        >
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
        </ScrollRevealSection>

        <ScrollRevealSection
          reducedMotion={reducedMotion}
          className="border-t border-slate-200 py-16 lg:py-20"
        >
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
        </ScrollRevealSection>
      </div>
    </div>
  )
}
