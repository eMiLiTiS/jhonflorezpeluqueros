export default function LegalPage({ title, body }: { title: string; body: string }) {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-8">{title}</h1>
      <div className="w-12 h-px bg-gold mb-10" />
      <div className="glass-card rounded-2xl p-8">
        <p className="text-muted leading-relaxed">{body}</p>
      </div>
    </div>
  )
}
