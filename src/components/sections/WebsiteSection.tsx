export default function WebsiteSection() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-12" style={{ background: '#FFFFFF' }}>
      <p className="font-mono text-xs tracking-widest uppercase" style={{ color: 'rgba(0,0,0,0.4)' }}>Coming soon</p>
      <h1 className="font-display font-light mt-6" style={{ fontSize: 'clamp(40px, 8vw, 96px)', lineHeight: '90%', color: '#16150F' }}>
        Website
      </h1>
    </div>
  );
}
