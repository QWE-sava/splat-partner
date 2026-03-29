import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Palette } from 'lucide-react';
import { weapons } from '../data/weapons';

const ProfileCardMaker = () => {
  const [name, setName] = useState('プレイヤー名');
  const [rank, setRank] = useState('S+');
  const [favWeapon, setFavWeapon] = useState(weapons[0].name);
  const [description, setDescription] = useState('一緒に遊びましょう！');
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadCard = () => {
    if (cardRef.current === null) return;
    
    toPng(cardRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `splat-profile-${name}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
      });
  };

  return (
    <div className="profile-card-maker">
      <div className="grid" style={{
        display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '2rem'
      }}>
        <div className="card">
          <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem'}}>
            <Palette size={24}/> <h2>カードを作成</h2>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <label style={{fontSize: '0.9rem', opacity: 0.8}}>プレイヤー名:</label>
            <input 
              className="btn" 
              style={{background: 'rgba(255,255,255,0.1)', color: 'white', textAlign: 'left', textTransform: 'none'}}
              value={name} onChange={(e) => setName(e.target.value)} 
            />
            
            <label style={{fontSize: '0.9rem', opacity: 0.8}}>ウデマエ:</label>
            <input 
              className="btn" 
              style={{background: 'rgba(255,255,255,0.1)', color: 'white', textAlign: 'left', textTransform: 'none'}}
              value={rank} onChange={(e) => setRank(e.target.value)} 
            />

            <label style={{fontSize: '0.9rem', opacity: 0.8}}>好きなブキ:</label>
            <select 
              className="btn" 
              style={{
                background: 'rgba(255,255,255,0.1)', 
                color: 'white', 
                textAlign: 'left',
                appearance: 'auto' // Ensure standard dropdown behavior for easier styling
              }}
              value={favWeapon} onChange={(e) => setFavWeapon(e.target.value)}
            >
              {weapons.map(w => (
                <option key={w.id} value={w.name} style={{ background: '#222', color: 'white' }}>
                  {w.name}
                </option>
              ))}
            </select>

            <label style={{fontSize: '0.9rem', opacity: 0.8}}>ひとこと:</label>
            <textarea 
              className="btn" 
              style={{background: 'rgba(255,255,255,0.1)', color: 'white', textAlign: 'left', minHeight: '80px', textTransform: 'none'}}
              value={description} onChange={(e) => setDescription(e.target.value)} 
            />
          </div>
          
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '2rem'}}>
            <button className="btn" onClick={downloadCard}>
              <Download size={20} /> 画像を保存する
            </button>
            <button 
              className="btn" 
              style={{background: '#000', color: '#fff', border: '1px solid #444'}}
              onClick={() => {
                const text = `SplatPartnerで自己紹介カードを作成しました！\nみんなよろしく！`;
                const url = 'https://splat-partner.pages.dev/';
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=SplatPartner,スプラトゥーン3`, '_blank');
              }}
            >
              𝕏 で作成報告する
            </button>
          </div>
          <p style={{fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem', textAlign: 'center'}}>※保存した画像を添付して投稿してね！</p>
        </div>

        <div className="preview-container">
          <h2 style={{opacity: 0.5, fontSize: '1rem', marginBottom: '1rem', textAlign: 'center'}}>プレビュー</h2>
          <div 
            ref={cardRef}
            style={{
              width: '100%',
              aspectRatio: '16/9',
              background: 'linear-gradient(135deg, #1A1A2E 0%, #0F0F1A 100%)',
              border: '10px solid var(--neon-cyan)',
              borderRadius: '20px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: 'white',
              position: 'relative',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}
          >
            {/* Splash decorative elements for card */}
            <div style={{position: 'absolute', top: '-20%', right: '-10%', width: '150px', height: '150px', backgroundColor: 'var(--neon-pink)', filter: 'blur(30px)', opacity: 0.4, borderRadius: '50%'}}></div>
            <div style={{position: 'absolute', bottom: '-10%', left: '-10%', width: '100px', height: '100px', backgroundColor: 'var(--neon-yellow)', filter: 'blur(30px)', opacity: 0.3, borderRadius: '50%'}}></div>

            <div style={{zIndex: 1}}>
              <div style={{fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem'}} className="neon-text">{name}</div>
              <div style={{display: 'flex', gap: '1rem'}}>
                <span style={{background: 'var(--neon-pink)', padding: '0.2rem 1rem', borderRadius: '50px', fontWeight: 900}}>Rank: {rank}</span>
              </div>
            </div>

            <div style={{zIndex: 1, textAlign: 'right'}}>
              <div style={{fontSize: '0.9rem', opacity: 0.7}}>お気に入りブキ</div>
              <div style={{fontSize: '1.4rem', fontWeight: 700}}>{favWeapon}</div>
            </div>

            <div style={{zIndex: 1, borderTop: '2px dashed rgba(255,255,255,0.2)', paddingTop: '1rem', marginTop: '1rem', fontStyle: 'italic'}}>
              {description}
            </div>

            <div style={{position: 'absolute', bottom: '1rem', right: '1.5rem', opacity: 0.2, fontSize: '0.8rem', fontWeight: 900}}>
              SplatPartner #スプラ3ブキ診断
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardMaker;
