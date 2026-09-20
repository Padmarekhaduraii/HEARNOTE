import { Link } from 'react-router-dom';
import {
  Mic,
  Sparkles,
  Search,
  Eye,
  ArrowRight,
  Radio,
  FileEdit,
  BookOpen
} from 'lucide-react';
import StatusIndicator from '../components/StatusIndicator';

export default function Landing() {
  const features = [
    {
      icon: Mic,
      title: 'Real-Time Transcription',
      description: 'Convert classroom speech into readable, low-latency text with speaker identification and confidence scores.',
      color: 'cyan'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Notes',
      description: 'Turn continuous spoken lectures into structured study notes with executive summaries, key points, definitions, and review questions.',
      color: 'indigo'
    },
    {
      icon: Search,
      title: 'Searchable Lectures',
      description: 'Instant keyword search across live and past transcripts with automatic query highlighting to locate crucial exam concepts.',
      color: 'purple'
    },
    {
      icon: FileEdit,
      title: 'Edit & Review',
      description: 'Easily correct speech segments, adjust terminology, and export formatted study sheets directly to your device.',
      color: 'emerald'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>Accessibility-First Classroom Assistant</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            HEARNOTE
            <span className="block text-2xl sm:text-4xl lg:text-5xl mt-3 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
              &ldquo;Every word. Never missed.&rdquo;
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Real-time lecture transcription and AI-powered notes designed to help deaf and hard-of-hearing students stay connected to every lesson.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/live"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-base shadow-xl shadow-cyan-950/60 transition-all transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Radio className="w-5 h-5 text-white" />
              <span>Start Taking Notes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/lectures"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-base border border-slate-700/80 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-slate-400" />
              <span>View Lectures</span>
            </Link>
          </div>

          {/* Live Interface Preview Mockup */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700/80 shadow-2xl text-left">
            {/* Window header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 rounded-t-xl border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-300 font-semibold">
                  HearNote Live Session — CS101: Introduction to Artificial Intelligence
                </span>
              </div>

              <div className="flex items-center gap-3">
                <StatusIndicator status="LIVE" size="sm" />
                <span className="font-mono text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                  00:03:21
                </span>
              </div>
            </div>

            {/* Split Mockup Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-b-xl">
              {/* Left: Mock Transcript */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Live Transcription
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                    Mic Active
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="font-semibold text-slate-200">Speaker 1 (Prof. Davis)</span>
                      <span className="font-mono">10:21 AM</span>
                    </div>
                    <p className="text-slate-100">
                      Artificial intelligence is the simulation of human intelligence in machines.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="font-semibold text-slate-200">Speaker 1 (Prof. Davis)</span>
                      <span className="font-mono">10:22 AM</span>
                    </div>
                    <p className="text-slate-100">
                      Machine learning is a subset of artificial intelligence where algorithms learn directly from data.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/60 animate-pulse">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="font-semibold text-cyan-300">Speaker 1 (Prof. Davis)</span>
                      <span className="font-mono text-cyan-400">10:23 AM</span>
                    </div>
                    <p className="text-cyan-100 font-medium">
                      Neural networks are inspired by the structure of the human brain...
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Mock AI Notes */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Structured AI Notes
                  </span>
                  <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-800 px-2 py-0.5 rounded">
                    Auto-generated
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Summary
                    </span>
                    <p className="text-slate-200 bg-slate-800/50 p-2 rounded-lg border border-slate-700/60 leading-relaxed">
                      Introduction to AI paradigms, delineating differences between broad AI, statistical machine learning, and deep neural architectures.
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Key Topics
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        Artificial Intelligence
                      </span>
                      <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        Machine Learning
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                        Neural Networks
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Section */}
      <section className="py-20 bg-slate-950/60 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">
              Designed for Higher Learning
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Powerful tools to capture every classroom insight
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-lg"
                >
                  <div className="p-3 rounded-xl bg-slate-800 text-cyan-400 w-fit mb-4 border border-slate-700">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Accessibility-Focused Section */}
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-900/90 to-cyan-950/30 border border-cyan-800/40 shadow-2xl">
            <div className="flex items-center gap-3 text-cyan-400 mb-4">
              <Eye className="w-6 h-6" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Our Accessibility Mission
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Visual Access to Spoken Classroom Content
            </h2>

            <p className="text-base text-slate-300 leading-relaxed mb-6">
              HearNote was created specifically to eliminate the barriers deaf and hard-of-hearing students face in fast-paced lecture halls. Standard captioning often suffers from high latency, missing speaker context, and zero structured synthesis.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="space-y-1">
                <span className="text-cyan-400 font-bold text-sm block">Zero Audio Reliance</span>
                <p className="text-xs text-slate-400">
                  No beep notifications or acoustic alerts. Every state is visually obvious with icons, badges, and animations.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-cyan-400 font-bold text-sm block">Visual EQ Visualizer</span>
                <p className="text-xs text-slate-400">
                  Real-time audio frequency waveforms guarantee students immediately see when instructors speak.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-cyan-400 font-bold text-sm block">Adaptive Typography</span>
                <p className="text-xs text-slate-400">
                  Customizable transcript text sizing and high WCAG contrast ensure fatigue-free reading throughout multi-hour lectures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="mt-auto py-12 border-t border-slate-800/80 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-200">HearNote</span>
            <span>— Accessible learning, one lecture at a time.</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <Link to="/live" className="hover:text-cyan-400 transition-colors">
              Start Live Lecture
            </Link>
            <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">
              Student Dashboard
            </Link>
            <Link to="/lectures" className="hover:text-cyan-400 transition-colors">
              Lecture Archive
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
