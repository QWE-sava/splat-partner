import { useState } from 'react';
import { weapons } from '../data/weapons';
import type { Weapon } from '../data/weapons';
import { Sparkles, RefreshCcw, ChevronRight } from 'lucide-react';

const MainQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Weapon | null>(null);

  const questions = [
    {
      id: 'mood',
      text: '今のキミの気分は？',
      options: [
        { id: 'Aggressive', label: 'イケイケ！', icon: '🔥' },
        { id: 'Support', label: 'まったり', icon: '🛡️' },
        { id: 'Tactical', label: '戦略的', icon: '🧠' },
        { id: 'Chill', label: 'エンジョイ', icon: '🎨' },
      ],
    },
    {
      id: 'special',
      text: 'どんなスペシャルで暴れたい？',
      options: [
        { id: 'power', label: 'ド派手な一撃！', description: 'ウルショ、ナイスダマ等' },
        { id: 'support', label: '味方を援護！', description: 'エナスタ、ソナー等' },
        { id: 'chaos', label: '盤面を荒らす！', description: 'トルネード、メガホン等' },
      ],
    },
    {
      id: 'sub',
      text: 'サブウェポンの使い道は？',
      options: [
        { id: 'attack', label: '直接倒したい！', description: '各種ボム系' },
        { id: 'utility', label: '相手を邪魔したい', description: '霧、トラップ等' },
        { id: 'paint', label: '塗りを広げたい', description: 'スプリンクラー、カーリング等' },
      ],
    },
    {
      id: 'skill',
      text: 'キミの現在のウデマエ・自信は？',
      options: [
        { id: 'Beginner', label: '初心者（これから！）' },
        { id: 'Intermediate', label: '中級者（慣れてきた）' },
        { id: 'Expert', label: '上級者（任せろ！）' },
      ],
    },
    {
      id: 'goal',
      text: '対戦で一番やりたいことは？',
      options: [
        { id: 'kill', label: '敵を全滅させる！' },
        { id: 'paint', label: '隅々まで塗りつぶす！' },
        { id: 'win', label: '味方を勝たせたい！' },
      ],
    },
    {
      id: 'role',
      text: 'キミの定位置は？',
      options: [
        { id: 'front', label: '前線（突っ込む！）' },
        { id: 'mid', label: '中央（柔軟に！）' },
        { id: 'back', label: '後方（狙撃！）' },
      ],
    },
  ];

  const handleAnswer = (value: string) => {
    const key = questions[step].id;
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<string, string>) => {
    const scoredWeapons = weapons.map(w => {
      let score = 0;
      
      // Mood score
      if (w.vibe.includes(finalAnswers.mood as any)) score += 4;
      
      // Role match
      const wRole = w.stats.range <= 4 ? 'front' : w.stats.range <= 7 ? 'mid' : 'back';
      if (wRole === finalAnswers.role) score += 3;

      // Special style
      const specStyle = 
        ['ウルトラショット', 'ナイスダマ', 'ウルトラハンコ', 'ジェットパック'].includes(w.special) ? 'power' :
        ['エナジースタンド', 'ホップソナー', 'グレートバリア'].includes(w.special) ? 'support' : 'chaos';
      if (specStyle === finalAnswers.special) score += 2;

      // Sub style
      const subStyle = 
        ['スプラッシュボム', 'キューバンボム', 'クイックボム', 'ロボットボム', 'トーピード'].includes(w.sub) ? 'attack' :
        ['スプリンクラー', 'カーリングボム'].includes(w.sub) ? 'paint' : 'utility';
      if (subStyle === finalAnswers.sub) score += 2;

      // Skill match
      if (w.difficulty === finalAnswers.skill) score += 2;

      // Goal match
      if (finalAnswers.goal === 'kill' && w.stats.kill > 7) score += 2;
      if (finalAnswers.goal === 'paint' && w.stats.paint > 7) score += 2;
      if (finalAnswers.goal === 'win' && w.stats.support > 7) score += 2;

      return { weapon: w, score };
    });

    const sorted = scoredWeapons.sort((a, b) => b.score - a.score);
    // Get top candidates and pick one randomly for variety
    const topCandidates = sorted.slice(0, 3);
    const finalWeapon = topCandidates[Math.floor(Math.random() * topCandidates.length)].weapon;
    
    setResult(finalWeapon);
    setStep(questions.length);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  const currentQ = questions[step];

  return (
    <div className="quiz-container">
      {step < questions.length ? (
        <div className="card animate-in">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
             <span style={{fontSize: '0.8rem', opacity: 0.6}}>質問 {step + 1} / {questions.length}</span>
             <div style={{width: '60%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px'}}>
                <div style={{width: `${((step + 1) / questions.length) * 100}%`, height: '100%', background: 'var(--neon-yellow)', boxShadow: '0 0 10px var(--neon-yellow)'}}></div>
             </div>
          </div>
          <h2 style={{borderLeft: '4px solid var(--neon-yellow)', paddingLeft: '1rem', marginBottom: '2rem'}}>
            {currentQ.text}
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {currentQ.options.map(o => (
              <button key={o.id} className="btn" onClick={() => handleAnswer(o.id)} style={{justifyContent: 'flex-start', textAlign: 'left', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', height: 'auto', padding: '1.2rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', width: '100%'}}>
                  {'icon' in o && <span style={{fontSize: '1.5rem'}}>{(o as any).icon}</span>}
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 900, color: 'var(--neon-yellow)'}}>{o.label}</div>
                    {'description' in o && <div style={{fontSize: '0.8rem', opacity: 0.6}}>{(o as any).description}</div>}
                  </div>
                  <ChevronRight size={20} style={{opacity: 0.3}} />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : result && (
        <div className="card animate-in" style={{ textAlign: 'center', border: '4px solid var(--neon-yellow)' }}>
          <Sparkles style={{ color: 'var(--neon-yellow)', marginBottom: '1rem' }} size={48} />
          <h2 style={{ color: 'var(--neon-yellow)', fontSize: '1.4rem' }}>あなたへのオススメは...</h2>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, margin: '1rem 0' }} className="neon-text">
            {result.name}
          </div>
          <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '15px', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
              <div>
                <div style={{fontSize: '0.7rem', opacity: 0.5}}>サブ</div>
                <div style={{fontWeight: 700}}>{result.sub}</div>
              </div>
              <div>
                <div style={{fontSize: '0.7rem', opacity: 0.5}}>スペシャル</div>
                <div style={{fontWeight: 700}}>{result.special}</div>
              </div>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={reset}>
            <RefreshCcw size={20} /> もう一度診断する
          </button>
        </div>
      )}
    </div>
  );
};

export default MainQuiz;
