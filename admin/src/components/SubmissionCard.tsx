import { useState } from 'react';
import type { ConsultingRequest } from '../types';
import { categoryLabel, contactHref, formatDate, relativeTime } from '../lib/format';
import { MediaGrid } from './MediaGrid';
import { IconCheck, IconCopy } from './icons';

interface Props {
  req: ConsultingRequest;
  busy: boolean;
  onToggleHandled: (req: ConsultingRequest) => void;
}

function CopyButton({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className="copybtn"
      title="Copy"
      aria-label="Copy contact"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1200);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {done ? <IconCheck width={14} height={14} /> : <IconCopy width={14} height={14} />}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <div className="label">{label}</div>
      <div className="value">{children}</div>
    </div>
  );
}

export function SubmissionCard({ req, busy, onToggleHandled }: Props) {
  const handled = !!req.handled_at;
  const href = contactHref(req.contact);

  return (
    <article className={`card${handled ? ' is-handled' : ''}`}>
      <div className="card-head">
        <span className="cat">{categoryLabel(req.category)}</span>
        {handled && (
          <span className="badge-done">
            <IconCheck width={12} height={12} /> Handled
          </span>
        )}
        <span className="grow" style={{ flex: 1 }} />
        <span className="when" title={formatDate(req.submitted_at)}>
          {relativeTime(req.submitted_at)}
        </span>
      </div>

      <h2>{req.name}</h2>
      <div className="identity">
        <span className="contact">
          {href ? (
            <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              {req.contact}
            </a>
          ) : (
            req.contact
          )}
          <CopyButton value={req.contact} />
        </span>
        {req.company && (
          <>
            <span className="sep">·</span>
            <span>{req.company}</span>
          </>
        )}
      </div>

      <div className="fields">
        {req.message && <Field label="Message">{req.message}</Field>}
        {req.extra_note && <Field label="Extra note">{req.extra_note}</Field>}
        {req.links && req.links.length > 0 && (
          <Field label="Links">
            <div className="linklist">
              {req.links.map((l, i) => (
                <a key={i} href={l} target="_blank" rel="noreferrer noopener">
                  {l}
                </a>
              ))}
            </div>
          </Field>
        )}
      </div>

      <MediaGrid attachments={req.attachments} />

      <div className="card-actions">
        <button className="btn" onClick={() => onToggleHandled(req)} disabled={busy}>
          {busy ? <span className="spin" /> : handled ? 'Reopen' : <><IconCheck width={15} height={15} /> Mark handled</>}
        </button>
        <span className="when" style={{ marginLeft: 'auto' }}>
          {handled ? `Handled ${formatDate(req.handled_at as string)}` : `#${req.id} · ${formatDate(req.submitted_at)}`}
        </span>
      </div>
    </article>
  );
}
