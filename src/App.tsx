import { useState } from 'react';
import './App.css';
import MainQuiz from './components/MainQuiz.tsx';
import StageDiagnosis from './components/StageDiagnosis.tsx';
import TeamAnalyzer from './components/TeamAnalyzer.tsx';
import ProfileCardMaker from './components/ProfileCardMaker.tsx';
import { Palette, Swords, Layout, Users } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('quiz');

  return (
    <div className="App">
      <div className="ink-bg">
        <div className="splash" style={{backgroundColor: 'var(--neon-pink)', top: '10%', left: '10%'}}></div>
        <div className="splash" style={{backgroundColor: 'var(--neon-cyan)', top: '60%', right: '10%'}}></div>
        <div className="splash" style={{backgroundColor: 'var(--neon-yellow)', bottom: '10%', left: '40%'}}></div>
      </div>

      <header className="container" style={{textAlign: 'center', paddingBottom: '0'}}>
        <h1 className="neon-text" style={{fontSize: '3rem', margin: '1rem 0'}}>SplatPartner</h1>
        <p style={{opacity: 0.8, fontSize: '1.2rem'}}>今日のキミに最高のブキを。</p>
      </header>

      <nav className="container" style={{paddingTop: '1rem'}}>
        <div className="tab-container">
          <div 
            className={`tab ${activeTab === 'quiz' ? 'active' : ''}`} 
            onClick={() => setActiveTab('quiz')}
          >
            <Swords size={20} style={{marginRight: '8px', verticalAlign: 'middle'}}/> 
            ブキ診断
          </div>
          <div 
            className={`tab ${activeTab === 'stage' ? 'active' : ''}`} 
            onClick={() => setActiveTab('stage')}
          >
            <Layout size={20} style={{marginRight: '8px', verticalAlign: 'middle'}}/>
            ステージで選ぶ
          </div>
          <div 
            className={`tab ${activeTab === 'team' ? 'active' : ''}`} 
            onClick={() => setActiveTab('team')}
          >
            <Users size={20} style={{marginRight: '8px', verticalAlign: 'middle'}}/>
            チーム編成
          </div>
          <div 
            className={`tab ${activeTab === 'card' ? 'active' : ''}`} 
            onClick={() => setActiveTab('card')}
          >
            <Palette size={20} style={{marginRight: '8px', verticalAlign: 'middle'}}/>
            自己紹介カード
          </div>
        </div>
      </nav>

      <main className="container" style={{paddingTop: 0}}>
        {activeTab === 'quiz' && <MainQuiz />}
        {activeTab === 'stage' && <StageDiagnosis />}
        {activeTab === 'team' && <TeamAnalyzer />}
        {activeTab === 'card' && <ProfileCardMaker />}
      </main>

      <footer className="container" style={{textAlign: 'center', opacity: 0.5, borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '4rem', paddingBottom: '2rem'}}>
        <p>© 2026 SplatPartner</p>
        <p style={{fontSize: '0.7rem', marginTop: '1rem', lineHeight: '1.4'}}>
          本アプリケーションはファンによる非公式プロジェクトです。<br />
          『スプラトゥーン』は任天堂株式会社の商標です。当サイトは任天堂株式会社とは一切関係ありません。
        </p>
      </footer>
    </div>
  )
}

export default App
