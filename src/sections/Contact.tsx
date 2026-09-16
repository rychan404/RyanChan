import { useState } from 'react';
import { DitherFade } from '../layout/DitherFade';
import { Footer } from '../layout/Footer';
import { BeachScene } from '../scenes/BeachScene';
import { PixelIcon } from '../components/PixelIcon';
import { submitContactForm } from '../lib/contact';
import { useIsMobile } from '../hooks/useMediaQuery';
import { PRIMARY_EDGE, contactGridCols, contactSceneHeight, sectionHeadingShadow } from '../lib/responsive';

export type ContactStatus = 'idle' | 'sending' | 'sent' | 'error';

const CARD_EDGE =
  'var(--px-edge, hsl(from var(--color-surface) calc(h + 36) calc(s * 1.15) calc(l * 0.3)))';

export function Contact() {
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
        <h2 style={{ textShadow: sectionHeadingShadow(isMobile), marginBottom: '4px' }}>
          Contact Me
        </h2>
        <p style={{ marginBottom: '44px', fontSize: '14px', color: 'var(--color-text-muted)' }}>
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
              '--color-border': CARD_EDGE,
              '--shadow-pixel': `2px 2px 0 ${CARD_EDGE}`,
            } as React.CSSProperties}
          >
            {/* Name Field */}
            <div className="pixel-field" style={{ marginBottom: '20px' }}>
              <label
                className="pixel-label"
                htmlFor="c-name"
                style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}
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
                style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}
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
                style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}
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
                style={{ width: '100%', fontFamily: 'monospace' }}
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
                  '--color-border': PRIMARY_EDGE,
                  '--shadow-pixel': `2px 2px 0 ${PRIMARY_EDGE}`,
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
                  <span style={{ fontSize: '16px' }}>
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
                  style={{ width: '100%', boxShadow: 'var(--shadow-pixel)' }}
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
                  <span style={{ fontSize: '16px' }}>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="pixel-btn pixel-btn--ghost pixel-btn--sm rc-ghost-btn"
                  style={{ width: '100%', boxShadow: 'var(--shadow-pixel)' }}
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
              border: `4px solid var(--color-bg-alt, ${CARD_EDGE})`,
              boxShadow: `6px 6px 0 var(--color-bg-alt, ${CARD_EDGE})`,
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

        <Footer marginTop="80px" />
      </div>
    </section>
  );
}
