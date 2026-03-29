import { useState, useMemo } from 'react';
import { weapons } from '../data/weapons';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Users, X } from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const TeamAnalyzer = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleWeapon = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedWeapons = useMemo(() => {
    return selectedIds.map(id => weapons.find(w => w.id === id)!);
  }, [selectedIds]);

  const teamStats = useMemo(() => {
    if (selectedWeapons.length === 0) return [0, 0, 0, 0];
    const sum = selectedWeapons.reduce((acc, w) => ({
      range: acc.range + w.stats.range,
      paint: acc.paint + w.stats.paint,
      kill: acc.kill + w.stats.kill,
      support: acc.support + w.stats.support,
    }), { range: 0, paint: 0, kill: 0, support: 0 });

    return [
      sum.range / selectedWeapons.length,
      sum.paint / selectedWeapons.length,
      sum.kill / selectedWeapons.length,
      sum.support / selectedWeapons.length,
    ];
  }, [selectedWeapons]);

  const chartData = {
    labels: ['射程', '塗り', 'キル', 'サポート'],
    datasets: [
      {
        label: 'チーム全体のバランス',
        data: teamStats,
        backgroundColor: 'rgba(0, 255, 255, 0.2)',
        borderColor: 'rgba(0, 255, 255, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(0, 255, 255, 1)',
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: { stepSize: 2, display: false },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: 'white', font: { size: 14, weight: 'bold' } as any },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="team-analyzer">
      <div className="card">
        <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem'}}>
          <Users size={24} /> <h2>チーム編成チェッカー ({selectedIds.length}/4)</h2>
        </div>
        
        <div style={{marginBottom: '2rem'}}>
          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', minHeight: '50px', padding: '0.5rem', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '10px'}}>
            {selectedWeapons.map(w => (
              <div key={w.id} className="btn" style={{fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: 'var(--neon-pink)'}}>
                {w.name} <X size={14} onClick={() => toggleWeapon(w.id)} style={{marginLeft: '5px', cursor: 'pointer'}} />
              </div>
            ))}
            {selectedIds.length === 0 && <span style={{opacity: 0.5, fontSize: '0.9rem'}}>ブキを4つ選んでください...</span>}
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: selectedIds.length > 0 ? '1fr 1fr' : '1fr', gap: '2rem'}}>
          <div style={{maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem'}}>
              {weapons.map(w => (
                <button 
                  key={w.id} 
                  className={`btn ${selectedIds.includes(w.id) ? 'active' : ''}`} 
                  style={{fontSize: '0.85rem', padding: '0.6rem', opacity: selectedIds.includes(w.id) ? 1 : 0.7, background: selectedIds.includes(w.id) ? 'var(--neon-yellow)' : 'rgba(255,255,255,0.1)', color: selectedIds.includes(w.id) ? 'black' : 'white'}}
                  onClick={() => toggleWeapon(w.id)}
                >
                  {w.name}
                </button>
              ))}
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="chart-container">
              <Radar data={chartData} options={chartOptions} />
              <div style={{marginTop: '1rem', fontSize: '0.9rem'}}>
                <strong>チーム分析アドバイス:</strong>
                <div style={{marginTop: '0.5rem', opacity: 0.9, lineHeight: '1.6'}}>
                  {(() => {
                    const advice = [];
                    // 1. Special overlap
                    const specials = selectedWeapons.map(w => w.special);
                    const counts: Record<string, number> = {};
                    specials.forEach(s => counts[s] = (counts[s] || 0) + 1);
                    const overlap = Object.entries(counts).find(([_, count]) => count >= 2);
                    if (overlap) advice.push(`⚠️ スペシャル「${overlap[0]}」が被っています。発動タイミングに注意！`);

                    // 2. Range balance
                    const hasLong = selectedWeapons.some(w => w.stats.range >= 8);
                    const hasShort = selectedWeapons.some(w => w.stats.range <= 3);
                    if (!hasLong) advice.push("🔍 後衛（長射程）がいないため、リッターなどの遠距離相手には工夫が必要です。");
                    if (!hasShort) advice.push("🔍 前線に切り込むブキが少ないため、ラインを上げるのが難しいかもしれません。");

                    // 3. Paint vs Kill
                    const avgPaint = teamStats[1];
                    const avgKill = teamStats[2];
                    if (avgPaint < 5) advice.push("💧 塗り力が不足しています。エリア管理や足場確保を意識しましょう。");
                    if (avgKill < 5) advice.push("⚔️ キル性能が低めです。連携して1人ずつ確実に倒す動きが重要です。");

                    if (advice.length === 0) return "✅ 非常にバランスの良い編成です！";
                    return advice.map((a, i) => <div key={i} style={{marginBottom: '4px'}}>{a}</div>);
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamAnalyzer;
