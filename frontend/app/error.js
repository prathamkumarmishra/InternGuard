'use client';
export default function Error({ reset }) {
  return <main className="container-page py-20"><section className="panel panel-pad max-w-lg"><p className="eyebrow">Something went wrong</p><h1 className="page-heading mt-2 text-3xl">We could not load this view.</h1><p className="page-copy mt-3">Please retry. If the issue persists, verify that the InternGuard API is running.</p><button className="button-primary mt-6" onClick={reset}>Try again</button></section></main>;
}
