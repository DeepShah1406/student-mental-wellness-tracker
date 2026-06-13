"use client";

import { useState } from "react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
  emoji: string;
}

const ARTICLES: Article[] = [
  {
    id: "wellness-activities",
    title: "Wellness Activities for Students - How to Support the Mental Wellbeing",
    category: "Mindfulness",
    readTime: "5 min read",
    emoji: "🧘‍♀️",
    summary: "Active coping strategies, micro-rest breaks, and cognitive grounding recommended by health bodies like NIMHANS and the WHO for exam preparation stress.",
    content: [
      "Preparing for exams like JEE, NEET, or UPSC is a mental marathon. In India, academic pressure can feel intense and overwhelming. However, keeping your mind healthy is just as important as covering the syllabus.",
      "Here are key wellness activities recommended by top clinical organizations, including the National Institute of Mental Health and Neurosciences (NIMHANS), to support your mental well-being:",
      "1. Box Breathing (Sama Vritti): Used by high-performance individuals, this involves breathing in for 4 seconds, holding for 4, exhaling for 4, and holding empty for 4. It instantly regulates the vagus nerve and lowers heart rate when exam anxiety spikes.",
      "2. The 25-5 Pomodoro Rest Activity: Never study continuously for hours. Take a 5-minute break every 25 minutes. During this break, step away from your books. Stretch, look out the window, or pop bubbles in our Relax Center to refresh your neural pathways.",
      "3. Screen-Free Grounding: Exam aspirants spend hours staring at online lectures. Dedicate at least 30 minutes before sleep to be completely screen-free. This ensures natural melatonin production, improving sleep quality.",
      "Remember, if the pressure feels too high, you are never alone. Toll-free national helplines like Tele-MANAS (14416) are available 24/7 to provide professional counselling."
    ]
  },
  {
    id: "mock-test-anxiety",
    title: "Overcoming Mock Test Anxiety & Score Blockers",
    category: "CBT Guide",
    readTime: "4 min read",
    emoji: "📊",
    summary: "How to apply Cognitive Behavioral Therapy (CBT) principles to reframe low test scores and build academic resilience.",
    content: [
      "It is a common scenario: you receive your mock test results, see a score below your goal, and immediately panic. Your brain starts whispering: 'I will fail the actual JEE/NEET. I am not good enough.'",
      "This is called cognitive distortion—specifically, catastrophizing. CBT teaches us to challenge these thoughts with empirical evidence:",
      "First, separate your self-worth from a mock score. Mock tests are diagnostic tools, designed to expose gaps in your current preparation, not to define your final outcome.",
      "Second, analyze the blocks objectively. Were your mistakes due to conceptual gaps, calculation errors, or time pressure? Tagging these errors as 'learning points' rather than 'failures' shifts your brain from a threat state (anxiety) to a problem-solving state.",
      "Ground yourself before every mock exam by writing down 3 things you have successfully mastered during the week. Confidence is built on incremental gains."
    ]
  },
  {
    id: "sleep-and-retention",
    title: "Sleep Hygiene: The Secret Weapon for Memory Retention",
    category: "Sleep Science",
    readTime: "6 min read",
    emoji: "😴",
    summary: "Why all-nighters destroy cognitive function and how to optimize your sleep cycle to lock in complex physics and chemistry concepts.",
    content: [
      "Many aspirants pride themselves on sleeping only 4 hours a night, thinking it gives them a competitive edge. Science says otherwise. Sleep deprivation severely impairs the prefrontal cortex—the area of your brain responsible for logical reasoning, problem-solving, and memory recall.",
      "During deep sleep (specifically REM sleep), your brain consolidates what you learned during the day. It transfers formulas and historical dates from temporary short-term storage to permanent long-term memory.",
      "Without adequate sleep, the information you read is literally washed away, causing 'blank outs' during examinations.",
      "To optimize sleep hygiene:",
      "- Go to bed and wake up at the same time every day to lock in your circadian rhythm.",
      "- Avoid caffeine or heavy snacks within 4 hours of sleeping.",
      "- Keep your study desk separate from your sleeping space to train your brain to associate the bed only with rest.",
      "Aim for 7 to 8 hours of solid sleep, especially in the weeks leading up to your exam. Sleep is not wasted time; it is active memory consolidation."
    ]
  }
];

export default function BlogsPage() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-8 bg-slate-950">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/5 text-teal-400 text-xs font-semibold">
          📰 Wellness Library
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Student Wellness Blogs
        </h1>
        <p className="text-xs text-slate-400">
          Empathetic guides, CBT tools, and wellness activities grounded in clinical science.
        </p>
      </div>

      {!selectedArticle ? (
        /* Articles list */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARTICLES.map((article) => (
            <div 
              key={article.id} 
              className="glass p-6 rounded-2xl border border-slate-900 bg-slate-900/20 flex flex-col justify-between space-y-4 hover:border-teal-500/30 transition-all group cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="bg-teal-500/10 text-teal-400 border border-teal-500/25 px-2 py-0.5 rounded">
                    {article.category}
                  </span>
                  <span className="text-slate-500 font-mono">{article.readTime}</span>
                </div>
                <h2 className="text-base font-bold text-slate-200 group-hover:text-teal-400 transition-colors leading-snug">
                  {article.emoji} {article.title}
                </h2>
                <p className="text-xs text-slate-400 leading-normal">
                  {article.summary}
                </p>
              </div>
              <button
                type="button"
                className="text-xs font-bold text-teal-400 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all text-left pt-2"
              >
                Read article <span>→</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Full Article View */
        <div className="glass p-6 md:p-8 rounded-2xl border border-slate-900 bg-slate-900/10 space-y-6 animate-fade-in text-left">
          <button
            onClick={() => setSelectedArticle(null)}
            className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 hover:text-slate-100 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 mb-2"
          >
            ← Back to wellness library
          </button>

          <div className="space-y-3">
            <div className="flex gap-3 items-center text-xs">
              <span className="bg-teal-500/10 text-teal-400 border border-teal-500/25 px-2.5 py-0.5 rounded font-bold">
                {selectedArticle.category}
              </span>
              <span className="text-slate-500 font-mono">{selectedArticle.readTime}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 leading-snug">
              {selectedArticle.emoji} {selectedArticle.title}
            </h1>
          </div>

          <div className="h-px bg-slate-900 w-full" />

          {/* Article content paragraphs */}
          <div className="space-y-4 text-slate-300 text-sm leading-relaxed max-w-none">
            {selectedArticle.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Crisis Hotline Footer Card inside Article */}
          <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/15 text-xs text-teal-400 space-y-1 mt-6">
            <h4 className="font-bold">🤝 Need immediate support?</h4>
            <p className="leading-relaxed">
              Academic stress should not be carried alone. Call <strong>Tele-MANAS</strong> at <strong>14416</strong> or the national mental wellness helpline <strong>Kiran</strong> at <strong>1800-599-0019</strong> for confidential support.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
