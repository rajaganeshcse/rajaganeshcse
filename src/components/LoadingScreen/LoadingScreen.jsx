import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const DEFAULT_STEPS = [
  {
    label: 'Connecting to the data source',
    detail: 'Opening a fresh request for the latest portfolio content.',
  },
  {
    label: 'Preparing the interface',
    detail: 'Composing sections, media, and detail cards for the first render.',
  },
  {
    label: 'Polishing the handoff',
    detail: 'Applying the finishing touches before the page becomes interactive.',
  },
];

function normalizeSteps(steps) {
  const source = Array.isArray(steps) && steps.length > 0 ? steps : DEFAULT_STEPS;
  return source.map((step) => (
    typeof step === 'string'
      ? { label: step, detail: '' }
      : {
          label: step?.label || 'Loading step',
          detail: step?.detail || '',
        }
  ));
}

export default function LoadingScreen({
  eyebrow = 'Live Data Sync',
  title = 'Loading the next view from the database.',
  message = 'Fresh content is on the way. We are fetching records and shaping the first screen so it opens fully composed.',
  steps,
  tone = 'public',
  fullScreen = true,
}) {
  const items = normalizeSteps(steps);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (items.length < 2) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % items.length);
    }, 1400);

    return () => window.clearInterval(intervalId);
  }, [items.length]);

  return (
    <div
      className={[
        'data-loader-shell',
        `data-loader-shell--${tone}`,
        fullScreen ? 'data-loader-shell--fullscreen' : '',
      ].filter(Boolean).join(' ')}
      aria-live="polite"
    >
      <div className="data-loader-spot data-loader-spot--one" />
      <div className="data-loader-spot data-loader-spot--two" />
      <div className="data-loader-spot data-loader-spot--three" />

      <div className="data-loader-card">
        <div className="data-loader-copy">
          <div className="data-loader-eyebrow">
            <span className="data-loader-ping" />
            <span>{eyebrow}</span>
          </div>

          <h1 className="data-loader-title">{title}</h1>
          <p className="data-loader-message">{message}</p>

          <div className="data-loader-progress">
            <div className="data-loader-progress-track">
              <div className="data-loader-progress-fill" />
            </div>

            <div className="data-loader-progress-meta">
              <span>{tone === 'admin' ? 'Dashboard channel' : 'Portfolio channel'}</span>
              <span>{`${String(activeStep + 1).padStart(2, '0')}/${String(items.length).padStart(2, '0')}`}</span>
            </div>
          </div>
        </div>

        <div className="data-loader-visual" aria-hidden="true">
          <div className="data-loader-orbit">
            <span className="data-loader-ring data-loader-ring--outer" />
            <span className="data-loader-ring data-loader-ring--middle" />
            <span className="data-loader-ring data-loader-ring--inner" />
            <span className="data-loader-scan" />

            <div className="data-loader-core">
              <div className="data-loader-core-grid" />
            </div>

            <span className="data-loader-node data-loader-node--one" />
            <span className="data-loader-node data-loader-node--two" />
            <span className="data-loader-node data-loader-node--three" />
          </div>

          <div className="data-loader-panel">
            <div className="data-loader-panel-head">
              <span>Render Queue</span>
              <strong>SYNC</strong>
            </div>

            <div className="data-loader-bars">
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="data-loader-caption">
              {tone === 'admin' ? 'Collecting dashboard records and admin tools.' : 'Collecting portfolio sections and media assets.'}
            </div>
          </div>
        </div>

        <div className="data-loader-steps">
          {items.map((step, index) => (
            <div
              key={`${step.label}-${index}`}
              className={[
                'data-loader-step',
                index === activeStep ? 'is-active' : '',
              ].filter(Boolean).join(' ')}
            >
              <span className="data-loader-step-index">{String(index + 1).padStart(2, '0')}</span>
              <div className="data-loader-step-copy">
                <strong>{step.label}</strong>
                {step.detail ? <span>{step.detail}</span> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
