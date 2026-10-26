import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-900/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 glass-panel border-t-0 border-l-0 border-r-0 rounded-none border-b-slate-800/50 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center font-bold text-white">S</div>
            <span className="font-bold text-xl tracking-tight">SkillGenie</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#agents" className="hover:text-white transition-colors">AI Coaches</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log in</Link>
            <Link href="/auth/register" className="btn-primary py-2 px-4 text-sm rounded-lg">Get Started</Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-6 relative">
        <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-light mb-8 text-sm text-brand-300 border-brand-500/20">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            AI-Powered Personal Development
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Build the Personality. Communication. Confidence. <br className="hidden md:block" />
            <span className="gradient-text">Careers.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            An AI-powered personal development platform that analyzes your communication, 
            identifies weaknesses, and provides realistic practice environments to help you succeed.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="btn-primary w-full sm:w-auto">Start Your Free Assessment</Link>
            <a href="#features" className="btn-secondary w-full sm:w-auto">Explore the Program</a>
          </div>

          <div className="mt-20 pt-10 border-t border-slate-800/50 flex flex-wrap justify-center gap-8 md:gap-16 text-slate-400">
            <div className="text-center"><div className="text-2xl font-bold text-white mb-1">50,000+</div><div className="text-sm">Learners</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-white mb-1">13</div><div className="text-sm">AI Coaches</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-white mb-1">95%</div><div className="text-sm">Report Improvement</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-white mb-1">30-Day</div><div className="text-sm">Roadmap</div></div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-24 bg-slate-950/50 relative">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">The Struggle Is Real</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">We've all been there. It's not a lack of knowledge, but the inability to express it.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '😶', text: 'I know the answer but cannot express it' },
              { icon: '😨', text: 'I am afraid of speaking in English' },
              { icon: '🥶', text: 'I freeze during interviews' },
              { icon: '🤐', text: 'I struggle during group discussions' },
              { icon: '📉', text: 'I lack confidence while presenting' },
              { icon: '🤔', text: 'I don\'t know what my real weaknesses are' }
            ].map((item, i) => (
              <div key={i} className="glass-panel p-6 flex items-start gap-4 hover:border-red-500/20 transition-colors">
                <div className="text-2xl bg-slate-800/80 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">{item.icon}</div>
                <div className="text-slate-300 mt-2 font-medium">"{item.text}"</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section id="features" className="py-24">
        <div className="section-container">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Your Personal <br/><span className="gradient-text">AI Development Coach</span></h2>
              <p className="text-lg text-slate-400">Transform your professional persona with an AI system that understands your current level and guides you step-by-step.</p>
              
              <div className="space-y-4">
                {[
                  { title: 'Assess', desc: 'Identify your baseline with our comprehensive initial assessment.' },
                  { title: 'Personalize', desc: 'Get a custom learning roadmap tailored to your specific goals.' },
                  { title: 'Practice', desc: 'Roleplay with AI agents in realistic, pressure-free scenarios.' },
                  { title: 'Improve', desc: 'Receive detailed, actionable feedback instantly after every session.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <div className="glass-panel-light p-8 animate-float relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-xl">🎙️</div>
                  <div>
                    <div className="font-bold text-lg">Speaking Analysis</div>
                    <div className="text-sm text-slate-400">Live Feedback Active</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                    <div className="text-xs text-slate-400 mb-1">Clarity Score</div>
                    <div className="w-full bg-slate-800 rounded-full h-2 mb-2"><div className="bg-brand-500 h-2 rounded-full w-[85%]"></div></div>
                    <div className="text-sm font-medium">85/100 - Good pacing</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                    <div className="text-xs text-slate-400 mb-1">Confidence Score</div>
                    <div className="w-full bg-slate-800 rounded-full h-2 mb-2"><div className="bg-purple-500 h-2 rounded-full w-[72%]"></div></div>
                    <div className="text-sm font-medium">72/100 - Used "um" 3 times</div>
                  </div>
                </div>
              </div>
              <div className="absolute top-[-20px] right-[-20px] w-full h-full bg-gradient-to-br from-brand-600/10 to-purple-600/10 rounded-2xl blur-xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* SKILL AREAS */}
      <section className="py-24 bg-slate-900/30">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Master Every Scenario</h2>
            <p className="text-slate-400 text-lg">Comprehensive training modules for every professional challenge.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🗣️', title: 'Communication', desc: 'Articulation & clarity' },
              { icon: '🎙️', title: 'Speaking', desc: 'Public speaking & delivery' },
              { icon: '📝', title: 'English', desc: 'Grammar & vocabulary' },
              { icon: '✨', title: 'Confidence', desc: 'Overcome anxiety' },
              { icon: '👑', title: 'Leadership', desc: 'Influence & delegation' },
              { icon: '❤️', title: 'EQ', desc: 'Emotional intelligence' },
              { icon: '🎯', title: 'Interviews', desc: 'Mock tech/HR rounds' },
              { icon: '📊', title: 'Presentations', desc: 'Pitching & storytelling' },
              { icon: '💼', title: 'Career', desc: 'Networking & branding' },
              { icon: '🤝', title: 'Professional', desc: 'Workplace etiquette' },
              { icon: '👥', title: 'Group Discussion', desc: 'Stand out in GDs' },
              { icon: '🏢', title: 'Workplace', desc: 'Conflict resolution' }
            ].map((skill, i) => (
               <div key={i} className="skill-card">
                 <div className="text-3xl mb-4">{skill.icon}</div>
                 <h4 className="font-bold text-lg mb-2">{skill.title}</h4>
                 <p className="text-sm text-slate-400">{skill.desc}</p>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">The Growth Journey</h2>
            <p className="text-slate-400 text-lg">A proven step-by-step framework to transform your skills.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
            <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-slate-800 -z-10" />
            
            {[
              { step: 1, title: 'Assessment', desc: 'Initial baseline test' },
              { step: 2, title: 'AI Profile', desc: 'Detailed skill breakdown' },
              { step: 3, title: 'Roadmap', desc: 'Personalized 30-day plan' },
              { step: 4, title: 'Practice', desc: 'Interactive AI roleplay' },
              { step: 5, title: 'Feedback', desc: 'Actionable insights' },
              { step: 6, title: 'Track', desc: 'Monitor improvement' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl glass-panel-light flex items-center justify-center text-xl font-bold text-brand-400 mb-4 z-10 relative">
                  {item.step}
                  {i < 5 && <div className="lg:hidden absolute top-full left-1/2 w-[2px] h-6 bg-slate-800" />}
                </div>
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI AGENTS SHOWCASE */}
      <section id="agents" className="py-24 bg-slate-900/30 overflow-hidden">
        <div className="section-container pb-0">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Meet Your Coaches</h2>
            <p className="text-slate-400 text-lg">Specialized AI agents ready to train you 24/7.</p>
          </div>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-24 px-6 md:px-24 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {[
            { icon: '🎙️', name: 'Speaking Coach', tag: 'Master vocal delivery', points: ['Pacing & tone analysis', 'Filler word detection', 'Pronunciation feedback'] },
            { icon: '🎯', name: 'Interview Coach', tag: 'Crack your next round', points: ['Role-specific questions', 'STAR method validation', 'Body language tips'] },
            { icon: '💬', name: 'Conversation Coach', tag: 'Build rapport', points: ['Small talk practice', 'Active listening', 'Handling interruptions'] },
            { icon: '📊', name: 'Presentation Coach', tag: 'Pitch like a pro', points: ['Storytelling structure', 'Slide deck alignment', 'Q&A handling'] },
            { icon: '🧠', name: 'EQ Coach', tag: 'Navigate emotions', points: ['Empathy training', 'Conflict de-escalation', 'Giving tough feedback'] },
            { icon: '💼', name: 'Career Coach', tag: 'Plan your growth', points: ['Salary negotiation', 'Performance reviews', 'Networking strategy'] }
          ].map((agent, i) => (
            <div key={i} className="min-w-[300px] w-[300px] glass-panel p-8 snap-center shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl mb-6">{agent.icon}</div>
              <h3 className="text-xl font-bold mb-1">{agent.name}</h3>
              <p className="text-brand-400 text-sm mb-6 font-medium">{agent.tag}</p>
              <ul className="space-y-3">
                {agent.points.map((pt, j) => (
                  <li key={j} className="flex gap-3 text-sm text-slate-300">
                    <span className="text-emerald-500">✓</span> {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-400 text-lg">Invest in yourself today.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {/* Starter */}
            <div className="glass-panel p-8">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="text-slate-400 mb-6">For exploring the platform</div>
              <div className="text-4xl font-bold mb-8">Free</div>
              <ul className="space-y-4 mb-8 text-sm text-slate-300">
                <li className="flex gap-3"><span>✓</span> Basic Skill Assessment</li>
                <li className="flex gap-3"><span>✓</span> 2 Core AI Agents</li>
                <li className="flex gap-3"><span>✓</span> 5 Practice Sessions / mo</li>
                <li className="flex gap-3 text-slate-500"><span>-</span> Advanced Analytics</li>
              </ul>
              <Link href="/auth/register" className="btn-secondary w-full">Start Free</Link>
            </div>
            
            {/* Pro */}
            <div className="glass-panel-light p-8 relative border-brand-500/50 scale-100 md:scale-105 z-10 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-brand-200 mb-6">For serious growth</div>
              <div className="flex items-end gap-2 mb-8"><span className="text-4xl font-bold">₹999</span><span className="text-slate-400">/mo</span></div>
              <ul className="space-y-4 mb-8 text-sm text-slate-200">
                <li className="flex gap-3"><span className="text-brand-400">✓</span> Full Skill Assessment</li>
                <li className="flex gap-3"><span className="text-brand-400">✓</span> All 13 AI Agents</li>
                <li className="flex gap-3"><span className="text-brand-400">✓</span> Unlimited Sessions</li>
                <li className="flex gap-3"><span className="text-brand-400">✓</span> Deep Analytics & Trends</li>
              </ul>
              <Link href="/auth/register" className="btn-primary w-full">Get Pro</Link>
            </div>
            
            {/* Institution */}
            <div className="glass-panel p-8">
              <h3 className="text-2xl font-bold mb-2">Institution</h3>
              <div className="text-slate-400 mb-6">For colleges & companies</div>
              <div className="text-4xl font-bold mb-8">Custom</div>
              <ul className="space-y-4 mb-8 text-sm text-slate-300">
                <li className="flex gap-3"><span>✓</span> Everything in Pro</li>
                <li className="flex gap-3"><span>✓</span> Admin/Trainer Dashboard</li>
                <li className="flex gap-3"><span>✓</span> Cohort Analytics</li>
                <li className="flex gap-3"><span>✓</span> Bulk Pricing</li>
              </ul>
              <a href="#" className="btn-secondary w-full">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-900/20 -z-10" />
        <div className="section-container text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Ready to Transform?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            No credit card required. Begin your free assessment today and see exactly where you stand.
          </p>
          <Link href="/auth/register" className="btn-primary text-lg px-10 py-4 shadow-[0_0_40px_rgba(59,130,246,0.4)]">
            Start Your Development Journey
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/60 bg-slate-950 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center font-bold text-white">S</div>
                <span className="font-bold text-xl">SkillGenie</span>
              </div>
              <p className="text-slate-400 text-sm">Empowering professionals to communicate clearly and lead confidently.</p>
            </div>
            
            <div>
              <h5 className="font-bold mb-4">Product</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-brand-400">Features</a></li>
                <li><a href="#" className="hover:text-brand-400">AI Agents</a></li>
                <li><a href="#" className="hover:text-brand-400">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold mb-4">Resources</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-brand-400">Blog</a></li>
                <li><a href="#" className="hover:text-brand-400">Guides</a></li>
                <li><a href="#" className="hover:text-brand-400">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-brand-400">About Us</a></li>
                <li><a href="#" className="hover:text-brand-400">Careers</a></li>
                <li><a href="#" className="hover:text-brand-400">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div>© 2026 SkillGenie. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
