import React, { useState } from 'react';
import { signInWithPopup, signInAnonymously } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import type { User } from '../types';

interface AuthComponentProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthComponent: React.FC<AuthComponentProps> = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      onAuthSuccess({
        uid: user.uid,
        displayName: user.displayName || 'Anonymous User',
        email: user.email || '',
        photoURL: user.photoURL || undefined,
        isAnonymous: false
      });
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError('Googleでのログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInAnonymously(auth);
      const user = result.user;
      
      onAuthSuccess({
        uid: user.uid,
        displayName: 'ゲストユーザー',
        email: '',
        isAnonymous: true
      });
    } catch (error: any) {
      console.error('Anonymous sign in error:', error);
      setError('匿名ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>🎌 アニメ・漫画オタク度チェッカー 🎌</h2>
        <p>あなたのアニメ・漫画知識を試してみませんか？</p>
      </div>

      <div className="auth-buttons">
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="google-signin-button"
        >
          <span className="google-icon">🔍</span>
          Googleでログイン
          <span className="auth-benefit">（成績保存・ランキング参加）</span>
        </button>

        <div className="divider">
          <span>または</span>
        </div>

        <button
          onClick={handleAnonymousSignIn}
          disabled={loading}
          className="anonymous-signin-button"
        >
          <span className="anonymous-icon">👤</span>
          ゲストとしてプレイ
          <span className="auth-benefit">（匿名・お試し）</span>
        </button>
      </div>

      {loading && (
        <div className="loading-message">
          <div className="spinner"></div>
          <p>ログイン中...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="auth-info">
        <h3>🌟 こんな人におすすめ 🌟</h3>
        <ul>
          <li>📺 アニメが大好きな人</li>
          <li>📚 漫画を読み漁っている人</li>
          <li>🤔 自分のオタク度を知りたい人</li>
          <li>🏆 友達と知識を競いたい人</li>
          <li>📖 新しいアニメ・漫画を発見したい人</li>
        </ul>
      </div>

      <div className="features">
        <h3>✨ 機能紹介 ✨</h3>
        <div className="feature-grid">
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <h4>難易度選択</h4>
            <p>初級から超オタク級まで</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎪</span>
            <h4>ジャンル選択</h4>
            <p>少年漫画、SF、ファンタジーなど</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⏰</span>
            <h4>タイマー機能</h4>
            <p>制限時間内での回答</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🏅</span>
            <h4>オタク度判定</h4>
            <p>あなたのレベルを判定</p>
          </div>
        </div>
      </div>
    </div>
  );
};