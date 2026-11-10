import Link from 'next/link';
import { ArrowRight, BadgeCheck, BarChart3, BrainCircuit, Building2, CheckCircle2, ChevronDown, FileSearch, HelpCircle, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';
import { ScreeningNotice } from '../components/Notice';
import { Footer } from '../components/Footer';

const steps = [['01', 'Submit', 'Enter an organization, internship listing, or public website.'], ['02', 'Analyze', 'We combine verification data, public website signals, language patterns, and reports.'], ['03', 'Understand', 'Review an explainable screening score, the sources, and the indicators behind it.'], ['04', 'Verify', 'Use safety-focused recommendations to decide what to check next.']];
const signals = [['Company verification', 'Match submitted registration details against imported company data.'], ['Website signals', 'Check public availability, HTTPS, and visible organization information.'], ['AI language analysis', 'Identify payment, guarantee, pressure, and communication indicators.'], ['Report patterns', 'Surface moderated platform reports without presenting allegations as fact.']];
const faqs = [
  ['What does a high risk score mean?', 'A high risk score (61–100) means that multiple screening signals suggest the listing deserves closer manual review. It is not a fraud determination or a legal finding. Always check the individual signals and sources cited in the assessment.'],
  ['Does InternGuard access private data?', 'No. The platform only reviews publicly accessible website pages, imported registration datasets, and information the user submits. It does not perform security testing, access protected systems, or collect personal information beyond what is needed for accounts.'],
  ['Can an organization be marked as safe?', 'InternGuard uses "Low Risk" not "safe." Even a low-risk score should be supplemented by your own research. The platform surfaces signals; it does not make legal determinations about an organization.'],
  ['Who moderates submitted reports?', 'Reports are reviewed by institutional verifiers with ADMIN or VERIFIER roles. Reports are moderation context—they are never published as factual findings about an organization.'],
  ['What data is synthetic?', 'All seed and demonstration data is explicitly synthetic. It is generated for development and testing and does not represent real people, organizations, or events. Synthetic records are clearly marked in the UI.'],
  ['How is the screening score calculated?', 'The score combines up to five explainable factors: company verification (0–30), website signals (0–20), internship language analysis (0–25), report patterns (0–20), and identity/contact consistency (0–5). Each factor stores its source, check time, and confidence.'],
];
const analyticsPreview = [
  { label: 'Organizations screened', value: '2,400+', detail: 'Synthetic demo data' },
  { label: 'Reports moderated', value: '850+', detail: 'Across 8 categories' },
  { label: 'High-risk alerts', value: '320+', detail: 'Queued for manual review' },
  { label: 'Avg. response time', value: '<2s', detail: 'AI + C++ engine combined' },
];

export default function Home() {
  return <main className="overflow-hidden">
    {/* Hero */}
    <section className="border-b border-slate-200 bg-white">
      <div className="container-page grid gap-12 py-20 lg:grid-cols-[1.02fr_.98fr] lg:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">Internship trust infrastructure</p>
          <h1 className="mt-4 text-5xl font-black tracking-[-.055em] text-ink sm:text-6xl">Verify Before<br />You Apply.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted">AI-assisted internship verification that helps students and institutions identify suspicious signals before taking action.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="button-primary flex items-center gap-2 no-underline" href="/analyze/internship">Check an internship <ArrowRight size={17} /></Link>
            <Link className="button-secondary no-underline" href="/verify/company">Verify an organization</Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600">
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-success" />Explainable factors</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-success" />Evidence-aware review</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-success" />No legal claims</span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-7 rounded-[30px] bg-blue-50" />
          <div className="panel relative overflow-hidden p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-bold text-muted">Verification workspace</p><h2 className="mt-1 font-extrabold text-ink">Dawnbyte Studio</h2></div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-800">Requires review</span>
            </div>
            <div className="my-6 grid items-center gap-5 border-y border-slate-100 py-6 sm:grid-cols-[.9fr_1.1fr]">
              <ScoreGauge score={66} level="HIGH_RISK" />
              <div className="space-y-3">
                <p className="text-xs font-extrabold uppercase tracking-widest text-muted">Top screening signals</p>
                {['Payment language detected', 'Website information mismatch', 'Report pattern requires review'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-700"><span className="h-2 w-2 rounded-full bg-amber-500" />{item}</div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold text-muted">Registration</p><p className="mt-1 text-sm font-extrabold text-ink">Needs review</p></div>
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold text-muted">Website</p><p className="mt-1 text-sm font-extrabold text-ink">Partial match</p></div>
            </div>
            <p className="mt-5 text-xs leading-5 text-muted">Screening score only. Review sources and supporting evidence before making a decision.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Analytics preview */}
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="container-page py-14">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {analyticsPreview.map(({ label, value, detail }) => (
            <article key={label} className="text-center">
              <p className="text-3xl font-black tracking-tight text-ink">{value}</p>
              <p className="mt-2 text-sm font-bold text-muted">{label}</p>
              <p className="mt-1 text-xs text-slate-500">{detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* Signals section */}
    <section className="container-page py-20">
      <div className="max-w-2xl">
        <p className="eyebrow">Trusted verification</p>
        <h2 className="page-heading mt-3">The context behind a risk signal matters.</h2>
        <p className="page-copy mt-4">InternGuard gives every score a trail: what was detected, where the information came from, when it was checked, and why it affects the screening result.</p>
      </div>
      <div className="grid-auto mt-10">
        {signals.map(([title, copy], index) => {
          const Icon = [Building2, FileSearch, BrainCircuit, BarChart3][index];
          return (
            <article key={title} className="panel panel-pad">
              <Icon className="text-brand" size={22} />
              <h3 className="mt-5 font-extrabold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
            </article>
          );
        })}
      </div>
    </section>

    {/* How it works */}
    <section id="how-it-works" className="border-y border-slate-200 bg-white">
      <div className="container-page py-20">
        <p className="eyebrow">How it works</p>
        <h2 className="page-heading mt-3">A clearer path to a safer decision.</h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-4">
          {steps.map(([number, title, copy]) => (
            <article key={number} className="bg-white p-6">
              <p className="text-3xl font-black text-blue-100">{number}</p>
              <h3 className="mt-8 font-extrabold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* Students / Institutions */}
    <section className="container-page grid gap-10 py-20 lg:grid-cols-[.92fr_1.08fr]">
      <div>
        <p className="eyebrow">Built for both sides</p>
        <h2 className="page-heading mt-3">Confidence for students. Context for institutions.</h2>
        <p className="page-copy mt-4">Students get fast, safety-oriented guidance. Verifiers get evidence, controls, review queues, and trends—without treating a model output as a verdict.</p>
        <Link href="/dashboard" className="button-secondary mt-7 inline-flex items-center gap-2 no-underline">Explore the workspace <ArrowRight size={17} /></Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <article className="panel panel-pad">
          <UserRoundCheck className="text-brand" />
          <h3 className="mt-5 font-extrabold">For students</h3>
          <ul className="mt-4 space-y-3 text-sm leading-5 text-muted">
            <li>Search organizations and listings</li>
            <li>Understand screening indicators</li>
            <li>Submit evidence-aware reports</li>
          </ul>
        </article>
        <article className="panel panel-pad">
          <BadgeCheck className="text-brand" />
          <h3 className="mt-5 font-extrabold">For institutions</h3>
          <ul className="mt-4 space-y-3 text-sm leading-5 text-muted">
            <li>Prioritized manual review</li>
            <li>Evidence and audit history</li>
            <li>Risk and report analytics</li>
          </ul>
        </article>
      </div>
    </section>

    {/* FAQ */}
    <section className="border-y border-slate-200 bg-white">
      <div className="container-page py-20">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2">
            <HelpCircle className="text-brand" size={22} />
            <p className="eyebrow">Frequently asked questions</p>
          </div>
          <h2 className="page-heading mt-3">What you should know.</h2>
          <div className="mt-10 divide-y divide-slate-100">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4">
                  <span className="font-extrabold text-ink">{question}</span>
                  <ChevronDown size={20} className="shrink-0 text-muted transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-7 text-muted">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="border-t border-slate-200 bg-white">
      <div className="container-page py-16">
        <ScreeningNotice />
        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">Start a check</p>
            <h2 className="page-heading mt-3">Make the next application a more informed one.</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link className="button-primary no-underline" href="/verify/company">Verify organization</Link>
            <Link className="button-secondary no-underline" href="/report">Report experience</Link>
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <Footer />
  </main>;
}
