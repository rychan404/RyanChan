import { memo, useState } from 'react';
import { DitherFade } from '../layout/DitherFade';
import { Footer } from '../layout/Footer';
import { BeachScene } from '../scenes/BeachScene';
import { PixelIcon } from '../components/PixelIcon';
import { submitContactForm } from '../lib/contact';
import { useHydrated } from '../hooks/useHydrated';

export type ContactStatus = 'idle' | 'sending' | 'sent' | 'error';

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  /** Present without a type means a textarea. */
  input: { type?: 'text' | 'email'; placeholder: string };
  last?: boolean;
};

function Field({ id, label, value, onChange, input, last }: FieldProps) {
  const common = {
    id, value, className: 'pixel-input', placeholder: input.placeholder, style: { width: '100%' },
  };
  return (
    <div className="pixel-field" style={{ marginBottom: last ? '24px' : '20px' }}>
      <label className="pixel-label" htmlFor={id} style={{ display: 'block', marginBottom: '8px' }}>
        {label}
      </label>
      {input.type ? (
        <input {...common} type={input.type} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <textarea {...common} rows={5} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function Result({ kind, message, action, onAction }: {
  kind: 'success' | 'danger';
  message: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div role="status" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}>
      <div className={`pixel-toast pixel-toast--${kind}`} style={{ width: '100%' }}>
        <PixelIcon
          name={kind === 'success' ? 'ui/check-box-solid' : 'ui/times-solid'}
          size={24}
          color={kind === 'success' ? 'var(--color-primary)' : 'var(--color-danger)'}
        />
        <span style={{ fontSize: 'var(--fs-16)' }}>{message}</span>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="pixel-btn pixel-btn--ghost pixel-btn--sm rc-ghost-btn"
        style={{ width: '100%', boxShadow: 'var(--shadow-control) var(--color-border)' }}
      >
        <PixelIcon name="ui/refresh-solid" size={16} />
        {action}
      </button>
    </div>
  );
}

function ContactImpl() {
  const hydrated = useHydrated();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState<ContactStatus>('idle');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await submitContactForm({ name, email, message: msg });
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        background: 'var(--color-bg)',
        order: 4,
      }}
    >
      <DitherFade ink="var(--color-surface)" />
      <div className="rc-section-inner">
        <h2 className="rc-section-title">
          Contact Me
        </h2>
        <p className="rc-section-lede">
          Feel free to reach out about the work I do!
        </p>

        <div
          className="rc-grid-contact"
          style={{
            display: 'grid',
            marginTop: '44px',
            alignItems: 'stretch',
          }}
        >
          {/* Form Card */}
          <form
            onSubmit={onSubmit}
            className="pixel-card"
            style={{
              background: 'var(--color-surface)',
              padding: '32px',
              '--color-border': 'var(--edge-on-surface)',
            } as React.CSSProperties}
          >
            <Field id="c-name" label="Name" value={name} onChange={setName}
              input={{ type: 'text', placeholder: 'Your name' }} />
            <Field id="c-email" label="Email" value={email} onChange={setEmail}
              input={{ type: 'email', placeholder: 'your@email.com' }} />
            <Field id="c-msg" label="Message" value={msg} onChange={setMsg} last
              input={{ placeholder: 'Your message...' }} />

            {/* Idle/Sending Button */}
            {(status === 'idle' || status === 'sending') && (
              <button
                type="submit"
                className="pixel-btn"
                disabled={status === 'sending'}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  '--color-border': 'var(--edge-primary)',
                } as React.CSSProperties}
              >
                {status === 'sending' ? (
                  <>
                    SENDING…
                    <span
                      style={{
                        animation: 'pxblink 1s steps(1,end) infinite',
                        background: 'currentColor',
                        width: '12px',
                        height: '20px',
                        display: 'inline-block',
                      }}
                    />
                  </>
                ) : (
                  <>
                    <PixelIcon name="ui/envelope-solid" size={18} />
                    Send Message
                  </>
                )}
              </button>
            )}

            {status === 'sent' && (
              <Result
                kind="success"
                message="Message sent! Thank you. I'll respond ASAP!"
                action="Send Another"
                onAction={() => {
                  setStatus('idle');
                  setName('');
                  setEmail('');
                  setMsg('');
                }}
              />
            )}
            {status === 'error' && (
              <Result kind="danger" message={error} action="Try Again" onAction={() => setStatus('idle')} />
            )}
          </form>

          {/* Beach Scene Panel */}
          <div
            className="rc-contact-scene"
            style={{
              border: 'var(--border-thick) solid var(--edge-on-surface)',
              boxShadow: 'var(--shadow-card) var(--edge-on-surface)',
              background: 'var(--color-bg-alt)',
              position: 'relative',
              overflow: 'hidden',
              imageRendering: 'pixelated',
            }}
          >
            {hydrated ? <BeachScene /> : null}
          </div>
        </div>
      </div>

      <Footer marginTop="80px" />
    </section>
  );
}

// Memoized so a theme toggle, which re-renders Home for its themeClass,
// does not cascade through every section. The scenes subscribe to the theme
// context directly, so they still update.
export const Contact = memo(ContactImpl);
