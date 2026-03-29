import { useState } from 'react';
import { stages } from '../data/stages';
import { weapons } from '../data/weapons';
import type { Weapon } from '../data/weapons';
import { MapPin, RefreshCw, ChevronRight, Sparkles } from 'lucide-react';

const StageDiagnosis = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [result, setResult] = useState<Weapon | null>(null);

  const questions = [
    {
      id: 'rule',
      text: '現在のルールを選択してください',
      options: [
        { id: 'area', label: 'ガチエリア', icon: '🎨' },
        { id: 'yagura', label: 'ガチヤグラ', icon: '🗼' },
        { id: 'hoko', label: 'ガチホコバトル', icon: '🔱' },
        { id: 'asari', label: 'ガチアサリ', icon: '⚽' },
        { id: 'turf', label: 'ナワバリバトル', icon: '🖌️' },
      ],
    },
    {
      id: 'stageId',
      text: '診断したいステージはどこ？',
      type: 'stage', // Special rendering for stage list
    },
    {
      id: 'strategy',
      text: 'このステージ・ルールでどう動きたい？',
      options: [
        { id: 'Aggressive', label: '攻勢に出たい！', description: '敵のラインを強引に破壊する' },
        { id: 'Support', label: '堅実に守りたい', description: '味方の援護と盤面の維持' },
        { id: 'Technical', label: '搦め手で攻めたい', description: '技術と判断力で勝負' },
      ],
    },
    {
      id: 'subGoal',
      text: 'サブウェポンの理想の使い道は？',
      options: [
        { id: 'kill', label: '牽制・削り', description: 'ボムで敵を動かす・倒す' },
        { id: 'trap', label: '待ち伏せ・罠', description: 'トラップやセンサーで位置把握' },
        { id: 'path', label: '道作り・塗り', description: '移動経路を素早く確保' },
      ],
    },
    {
      id: 'specialGoal',
      text: '逆転の秘策！スペシャルの目的は？',
      options: [
        { id: 'clear', label: '拠点の制圧・解除', description: 'バリアやウルショで拠点を守る/奪う' },
        { id: 'buff', label: '味方へのバフ', description: 'エナスタやソナーで全体を底上げ' },
        { id: 'chaos', label: '敵陣の混乱', description: 'トルネードやメガホンで敵を散らす' },
      ],
    },
    {
      id: 'role',
      text: 'このステージでキミが担いたい役割は？',
      options: [
        { id: 'front', label: '切り込み隊長', icon: '⚔️' },
        { id: 'mid', label: '万能サポート', icon: '🤝' },
        { id: 'back', label: '絶対的守護神', icon: '👁️' },
      ],
    },
  ];

  const handleAnswer = (value: any) => {
    const key = questions[step].id;
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<string, any>) => {
    const stageData = stages.find(s => s.id === finalAnswers.stageId)!;
    
    const scoredWeapons = weapons.map(w => {
      let score = 0;

      // 1. Stage Synergy (Vertical, Long, Narrow)
      if (stageData.features.includes('long') && w.stats.range >= 7) score += 3;
      if (stageData.features.includes('vertical') && (w.category === 'スロッシャー' || w.category === 'ブラスター' || w.category === 'ワイパー')) score += 3;
      if (stageData.features.includes('narrow') && (w.category === 'ローラー' || w.category === 'フデ' || w.category === 'シェルター')) score += 3;
      if (stageData.features.includes('open') && w.stats.paint >= 6) score += 1;

      // 2. Rule Synergy
      if (finalAnswers.rule === 'area' && w.stats.paint >= 7) score += 3;
      if (finalAnswers.rule === 'yagura' && (w.category === 'ブラスター' || ['グレートバリア', 'ナイスダマ'].includes(w.special))) score += 4;
      if (finalAnswers.rule === 'hoko' && (w.stats.kill >= 8 || ['ウルトラショット', 'ウルトラハンコ', 'カニタンク'].includes(w.special))) score += 3;
      if (finalAnswers.rule === 'asari' && (w.category === 'マニューバー' || w.category === 'フデ' || w.special === 'エナジースタンド')) score += 3;
      if (finalAnswers.rule === 'turf' && w.stats.paint >= 8) score += 3;

      // 3. Sub Synergy
      const subStyle = ['スプラッシュボム', 'キューバンボム', 'クイックボム'].includes(w.sub) ? 'kill' : 
                       ['トラップ', 'ポイントセンサー', 'ポイズンミスト'].includes(w.sub) ? 'trap' : 'path';
      if (subStyle === finalAnswers.subGoal) score += 2;

      // 4. Special Synergy
      const specStyle = ['グレートバリア', 'ナイスダマ', 'ウルトラショット'].includes(w.special) ? 'clear' :
                        ['エナジースタンド', 'ホップソナー', 'デコイチラシ'].includes(w.special) ? 'buff' : 'chaos';
      if (specStyle === finalAnswers.specialGoal) score += 2;

      // 5. Strategy & Role
      if (w.vibe.includes(finalAnswers.strategy as any)) score += 2;
      const wRole = w.stats.range <= 4 ? 'front' : w.stats.range <= 7 ? 'mid' : 'back';
      if (wRole === finalAnswers.role) score += 3;

      return { weapon: w, score };
    });

    const sorted = scoredWeapons.sort((a, b) => b.score - a.score);
    const topCandidates = sorted.slice(0, 3);
    setResult(topCandidates[Math.floor(Math.random() * topCandidates.length)].weapon);
    setStep(questions.length);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  const currentQ = questions[step];

  return (
    <div className="stage-diagnosis">
      {step < questions.length ? (
        <div className="card animate-in">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
             <span style={{fontSize: '0.8rem', opacity: 0.6}}>ステージ診断 {step + 1} / {questions.length}</span>
             <div style={{width: '60%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px'}}>
                <div style={{width: `${((step + 1) / questions.length) * 100}%`, height: '100%', background: 'var(--neon-cyan)', boxShadow: '0 0 10px var(--neon-cyan)'}}></div>
             </div>
          </div>
          <h2 style={{borderLeft: '4px solid var(--neon-cyan)', paddingLeft: '1rem', marginBottom: '1.5rem'}}>
            {currentQ.text}
          </h2>

          {currentQ.type === 'stage' ? (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.8rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem'}}>
              {stages.map(s => (
                <button 
                  key={s.id} 
                  className="btn btn-secondary" 
                  style={{fontSize: '0.85rem', height: 'auto', padding: '1rem', background: answers.stageId === s.id ? 'var(--neon-pink)' : ''}}
                  onClick={() => handleAnswer(s.id)}
                >
                  <MapPin size={14} style={{marginRight: '5px'}} /> {s.name}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {currentQ.options?.map(o => (
                <button key={o.id} className="btn" onClick={() => handleAnswer(o.id)} style={{justifyContent: 'flex-start', textAlign: 'left', background: 'rgba(255,255,255,0.05)', height: 'auto', padding: '1rem'}}>
                   <div style={{display: 'flex', alignItems: 'center', gap: '1rem', width: '100%'}}>
                    {'icon' in o && <span style={{fontSize: '1.5rem'}}>{(o as any).icon}</span>}
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: 900, color: 'var(--neon-cyan)'}}>{o.label}</div>
                      {'description' in o && <div style={{fontSize: '0.8rem', opacity: 0.6}}>{(o as any).description}</div>}
                    </div>
                    <ChevronRight size={20} style={{opacity: 0.3}} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : result && (
        <div className="card animate-in" style={{ textAlign: 'center', border: '4px solid var(--neon-cyan)' }}>
          <Sparkles style={{ color: 'var(--neon-cyan)', marginBottom: '1rem' }} size={48} />
          <h2 style={{ fontSize: '1.4rem' }}>{stages.find(s => s.id === answers.stageId)?.name}攻略！</h2>
          <div style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '1rem' }}>
            {questions[0].options?.find(o => o.id === answers.rule)?.label} 推奨ブキ
          </div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, margin: '1rem 0' }} className="neon-text-cyan">
            {result.name}
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', marginBottom: '2rem' }}>
             <p style={{fontSize: '0.95rem', fontStyle: 'italic', opacity: 0.9}}>
               このステージ特有の{stages.find(s => s.id === answers.stageId)?.features.includes('vertical') ? '高低差' : '地形'}を、{result.sub}と{result.special}で制圧しましょう！
             </p>
          </div>
          <button className="btn" onClick={reset}>
            <RefreshCw size={20} /> 他のシチュエーションで診断
          </button>
        </div>
      )}
    </div>
  );
};

export default StageDiagnosis;
