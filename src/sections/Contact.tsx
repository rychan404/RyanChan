import { memo, useState } from 'react';
import { DitherFade } from '../layout/DitherFade';
import { Footer } from '../layout/Footer';
import { BeachScene } from '../scenes/BeachScene';
import { PixelIcon } from '../components/PixelIcon';
import { submitContactForm } from '../lib/contact';
import { useIsMobile } from '../hooks/useMediaQuery';
import { contactGridCols, contactSceneHeight, sectionHeadingShadow } from '../lib/responsive';

export type ContactStatus = 'idle' | 'sending' | 'sent' | 'error';


function ContactImpl() {
  const isMobile = useIsMobile();
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
        padding: '0 0 0',
        order: 4,
      }}
    >
      <DitherFade ink="var(--color-surface)" />
      <div style={{ padding: '56px var(--section-pad-x) 0' }}>
        <h2 className="rc-section-title" style={{ textShadow: sectionHeadingShadow(isMobile) }}>
          Contact Me
        </h2>
        <p className="rc-section-lede">
          Feel free to reach out about the work I do!
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: contactGridCols(isMobile),
            gap: '48px',
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
            {/* Name Field */}
            <div className="pixel-field" style={{ marginBottom: '20px' }}>
              <label
                className="pixel-label"
                htmlFor="c-name"
                style={{ display: 'block', marginBottom: '8px' }}
              >
                Name
              </label>
              <input
                id="c-name"
                type="text"
                className="pixel-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                style={{ width: '100%' }}
              />
            </div>

            {/* Email Field */}
            <div className="pixel-field" style={{ marginBottom: '20px' }}>
              <label
                className="pixel-label"
                htmlFor="c-email"
                style={{ display: 'block', marginBottom: '8px' }}
              >
                Email
              </label>
              <input
                id="c-email"
                type="email"
                className="pixel-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ width: '100%' }}
              />
            </div>

            {/* Message Field */}
            <div className="pixel-field" style={{ marginBottom: '24px' }}>
              <label
                className="pixel-label"
                htmlFor="c-msg"
                style={{ display: 'block', marginBottom: '8px' }}
              >
                Message
              </label>
              <textarea
                id="c-msg"
                className="pixel-input"
                rows={5}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Your message..."
                style={{ width: '100%' }}
              />
            </div>

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

            {/* Success Toast */}
            {status === 'sent' && (
              <div
                role="status"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  className="pixel-toast pixel-toast--success"
                  style={{ width: '100%' }}
                >
                  <PixelIcon
                    name="ui/check-box-solid"
                    size={24}
                    color="var(--color-primary)"
                  />
                  <span style={{ fontSize: 'var(--fs-16)' }}>
                    Message sent! Thank you. I'll respond ASAP!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle');
                    setName('');
                    setEmail('');
                    setMsg('');
                  }}
                  className="pixel-btn pixel-btn--ghost pixel-btn--sm rc-ghost-btn"
                  style={{ width: '100%', boxShadow: 'var(--shadow-control) var(--color-border)' }}
                >
                  <PixelIcon name="ui/refresh-solid" size={16} />
                  Send Another
                </button>
              </div>
            )}

            {/* Error Toast */}
            {status === 'error' && (
              <div
                role="status"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  className="pixel-toast pixel-toast--danger"
                  style={{ width: '100%' }}
                >
                  <PixelIcon
                    name="ui/times-solid"
                    size={24}
                    color="var(--color-danger)"
                  />
                  <span style={{ fontSize: 'var(--fs-16)' }}>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="pixel-btn pixel-btn--ghost pixel-btn--sm rc-ghost-btn"
                  style={{ width: '100%', boxShadow: 'var(--shadow-control) var(--color-border)' }}
                >
                  <PixelIcon name="ui/refresh-solid" size={16} />
                  Try Again
                </button>
              </div>
            )}
          </form>

          {/* Beach Scene Panel */}
          <div
            style={{
              border: 'var(--border-thick) solid var(--edge-on-surface)',
              boxShadow: 'var(--shadow-card) var(--edge-on-surface)',
              background: 'var(--color-bg-alt)',
              height: contactSceneHeight(isMobile),
              position: 'relative',
              overflow: 'hidden',
              imageRendering: 'pixelated',
            }}
          >
            <BeachScene />
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
