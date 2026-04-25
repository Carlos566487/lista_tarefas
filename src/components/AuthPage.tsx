import { useState, useRef, useEffect } from 'react';
import type { AuthView } from '../hooks/useAuth';
import { CheckSquare, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, Sparkles } from 'lucide-react';

interface AuthPageProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, name: string) => Promise<void>;
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 1,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 20 + 15,
  delay: Math.random() * 10,
}));

export function AuthPage({ onSignIn, onSignUp }: AuthPageProps) {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, [view]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (view === 'login') {
        await onSignIn(email, password);
      } else {
        if (name.trim().length < 2) {
          throw new Error('Por favor, insira um nome com pelo menos 2 caracteres.');
        }
        await onSignUp(email, password, name);
        setSuccessMsg('Conta criada! Verifique seu e-mail para confirmar o cadastro.');
      }
    } catch (err: any) {
      const msg = err?.message ?? 'Ocorreu um erro. Tente novamente.';
      if (msg.includes('Invalid login credentials')) setError('E-mail ou senha incorretos.');
      else if (msg.includes('User already registered')) setError('Este e-mail já está cadastrado. Faça login.');
      else if (msg.includes('Password should be at least')) setError('A senha deve ter no mínimo 6 caracteres.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const switchView = (next: AuthView) => {
    setView(next);
    setError(null);
    setSuccessMsg(null);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="auth-root">
      {/* Animated particles background */}
      <div className="auth-particles" aria-hidden="true">
        {PARTICLES.map(p => (
          <span
            key={p.id}
            className="auth-particle"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Orbs de luz no fundo */}
      <div className="auth-orb auth-orb-1" aria-hidden="true" />
      <div className="auth-orb auth-orb-2" aria-hidden="true" />
      <div className="auth-orb auth-orb-3" aria-hidden="true" />

      {/* Card central */}
      <main className="auth-card" role="main">
        {/* Brilho superior */}
        <div className="auth-card-shine" aria-hidden="true" />

        {/* Logo */}
        <div className="auth-logo-wrap">
          <div className="auth-logo-icon">
            <CheckSquare size={22} strokeWidth={2.5} />
          </div>
          <span className="auth-logo-text">TaskFlow</span>
        </div>

        {/* Cabeçalho */}
        <div className="auth-header">
          <Sparkles className="auth-sparkle" size={16} />
          <h1 className="auth-title">
            {view === 'login' ? 'Bem-vindo de volta' : 'Criar sua conta'}
          </h1>
          <p className="auth-subtitle">
            {view === 'login'
              ? 'Acesse seus projetos e tarefas'
              : 'Comece a organizar sua vida hoje'}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {view === 'signup' && (
            <div className="auth-field auth-field-enter">
              <label htmlFor="auth-name" className="auth-label">
                <User size={13} /> Seu nome
              </label>
              <input
                ref={view === 'signup' ? (emailRef as any) : undefined}
                id="auth-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Como quer ser chamado?"
                className="auth-input"
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email" className="auth-label">
              <Mail size={13} /> E-mail
            </label>
            <input
              ref={view === 'login' ? emailRef : undefined}
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="auth-input"
              required
              disabled={loading}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password" className="auth-label">
              <Lock size={13} /> Senha
            </label>
            <div className="auth-input-wrap">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={view === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={view === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'}
                className="auth-input auth-input-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="auth-eye-btn"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <div className="auth-alert auth-alert-error" role="alert">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="auth-alert auth-alert-success" role="status">
              <Sparkles size={14} />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
            aria-label={view === 'login' ? 'Entrar na conta' : 'Criar conta'}
          >
            {loading ? (
              <Loader2 size={18} className="auth-spinner" />
            ) : (
              <span>{view === 'login' ? 'Entrar' : 'Criar conta'}</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider" aria-hidden="true">
          <span />
          <p>ou</p>
          <span />
        </div>

        {/* Trocar modo */}
        <p className="auth-switch-text">
          {view === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button
            type="button"
            onClick={() => switchView(view === 'login' ? 'signup' : 'login')}
            className="auth-switch-btn"
          >
            {view === 'login' ? 'Cadastre-se' : 'Faça login'}
          </button>
        </p>
      </main>
    </div>
  );
}
