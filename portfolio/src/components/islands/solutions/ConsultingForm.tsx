import { useEffect, useRef, useState } from 'react';
import { submitConsultingRequest } from '../../../lib/api/consulting';
import { SketchBoard, boardToBlob, emptyBoardState } from './SketchBoard';
import styles from './Solutions.module.css';
import type { Category, SolutionsStrings } from './types';

type ToolKey = 'write' | 'voice' | 'media' | 'link' | 'board';
type RecState = 'idle' | 'recording' | 'done' | 'denied';

interface MediaItem {
  file: File;
  url: string;
  isImage: boolean;
  ext: string;
  sizeLabel: string;
}

// Field limits mirror the API's validation (backend/app/routers/consulting.py);
// exceeding any of them there returns a 422, so enforce them in the inputs.
const MAX_NAME = 120;
const MIN_CONTACT = 3;
const MAX_CONTACT = 200;
const MAX_COMPANY = 200;
const MAX_MESSAGE = 2000;
const MAX_NOTE = 8000;
const MAX_LINK = 500;
const MAX_LINKS = 10;
const MAX_MEDIA = 8;

function sizeLabel(bytes: number): string {
  const kb = bytes / 1024;
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(kb))} KB`;
}

const ICONS: Record<ToolKey, React.ReactNode> = {
  write: (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13 L11 5 L13 7 L5 15 L2 16 Z" />
      <path d="M10 6 L12 8" />
    </svg>
  ),
  voice: (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6.5" y="2" width="5" height="9" rx="2.5" />
      <path d="M4 8.5 a5 5 0 0 0 10 0" />
      <path d="M9 13.5 V16" />
    </svg>
  ),
  media: (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3.5" width="14" height="11" rx="2" />
      <circle cx="6.5" cy="7.5" r="1.4" />
      <path d="M3 13 L7 9 L11 12.5 L13 11 L15 13" />
    </svg>
  ),
  link: (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 10.5 a3 3 0 0 1 0-4 L10 4.5 a3 3 0 0 1 4 4 L13 9.5" />
      <path d="M10 7.5 a3 3 0 0 1 0 4 L8 13.5 a3 3 0 0 1-4-4 L5 8.5" />
    </svg>
  ),
  board: (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="3.5" width="6" height="4.5" rx="1" />
      <rect x="10.5" y="10" width="6" height="4.5" rx="1" />
      <path d="M7.5 5.8 H12 a1.5 1.5 0 0 1 1.5 1.5 V10" />
    </svg>
  ),
};

interface Props {
  category: Category;
  form: SolutionsStrings['form'];
  sandbox: SolutionsStrings['sandbox'];
  apiUrl: string;
  accent: string;
}

export function ConsultingForm({ category, form, sandbox, apiUrl, accent }: Props) {
  const f = form;
  const sb = sandbox;

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [note, setNote] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [tools, setTools] = useState<Record<ToolKey, boolean>>({
    write: false,
    voice: false,
    media: false,
    link: false,
    board: false,
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const [recState, setRecState] = useState<RecState>('idle');
  const [recSeconds, setRecSeconds] = useState(0);
  const [recURL, setRecURL] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const voiceBlobRef = useRef<Blob | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const boardRef = useRef(emptyBoardState());

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
      const mr = recorderRef.current;
      if (mr && mr.state !== 'inactive') mr.stop();
    },
    []
  );

  const toggleTool = (k: ToolKey) => {
    const opening = !tools[k];
    if (k === 'link' && opening && links.length === 0) setLinks(['']);
    if (k === 'voice' && !opening) stopRec();
    setTools((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      recorderRef.current = mr;
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
        voiceBlobRef.current = blob;
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        setRecState('done');
        setRecURL(URL.createObjectURL(blob));
      };
      mr.start();
      setRecState('recording');
      setRecSeconds(0);
      setRecURL(null);
      timerRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    } catch {
      setRecState('denied');
    }
  };

  const stopRec = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const mr = recorderRef.current;
    if (mr && mr.state !== 'inactive') mr.stop();
  };

  const resetRec = () => {
    stopRec();
    if (recURL) URL.revokeObjectURL(recURL);
    voiceBlobRef.current = null;
    setRecState('idle');
    setRecURL(null);
    setRecSeconds(0);
  };

  const recTime = `${Math.floor(recSeconds / 60)}:${String(recSeconds % 60).padStart(2, '0')}`;

  const addMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    // cap mirrors the API's 8-file limit so submissions aren't rejected server-side
    const files = Array.from(e.target.files ?? []).slice(0, Math.max(0, MAX_MEDIA - media.length));
    const items = files.map((file) => {
      const dot = file.name.lastIndexOf('.');
      return {
        file,
        url: URL.createObjectURL(file),
        isImage: file.type.startsWith('image/'),
        ext: (dot >= 0 ? file.name.slice(dot + 1) : 'file').slice(0, 4).toUpperCase(),
        sizeLabel: sizeLabel(file.size),
      };
    });
    setMedia((prev) => [...prev, ...items]);
    e.target.value = '';
  };

  const removeMedia = (i: number) => {
    setMedia((prev) => {
      URL.revokeObjectURL(prev[i].url);
      return prev.filter((_, j) => j !== i);
    });
  };

  const setLink = (i: number, v: string) =>
    setLinks((prev) => prev.map((l, j) => (j === i ? v : l)));
  const removeLink = (i: number) =>
    setLinks((prev) => {
      const next = prev.filter((_, j) => j !== i);
      return next.length ? next : [''];
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setError(false);
    setSending(true);
    try {
      stopRec();
      const fd = new FormData();
      fd.append('category', category);
      fd.append('name', name.trim());
      fd.append('contact', contact.trim());
      if (company.trim()) fd.append('company', company.trim());
      if (message.trim()) fd.append('message', message.trim());
      if (note.trim()) fd.append('extra_note', note.trim());
      const cleanLinks = links.map((l) => l.trim()).filter(Boolean);
      if (cleanLinks.length) fd.append('links', JSON.stringify(cleanLinks));
      if (voiceBlobRef.current) fd.append('voice', voiceBlobRef.current, 'voice-note.webm');
      for (const m of media) fd.append('media', m.file, m.file.name);
      const sketch = await boardToBlob(boardRef.current);
      if (sketch) fd.append('board', sketch, 'sketch.png');
      const ok = await submitConsultingRequest(fd, apiUrl);
      if (ok) setSent(true);
      else setError(true);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className={styles.thanks}>
        <p className={styles.thanksTitle}>{f.thanksTitle}</p>
        <p className={styles.thanksBody}>{f.thanksBody}</p>
      </div>
    );
  }

  const chip = (k: ToolKey, label: string) => (
    <button
      type="button"
      className={`${styles.chip} ${tools[k] ? styles.chipActive : ''}`}
      onClick={() => toggleTool(k)}
    >
      {ICONS[k]}
      {label}
    </button>
  );

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>
          {f.name} <span className={styles.req}>*</span>
        </label>
        <input
          required
          type="text"
          maxLength={MAX_NAME}
          className={styles.input}
          placeholder={f.namePh}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          {f.contact} <span className={styles.req}>*</span>
        </label>
        <input
          required
          type="text"
          minLength={MIN_CONTACT}
          maxLength={MAX_CONTACT}
          className={styles.input}
          placeholder={f.contactPh}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>{f.company}</label>
        <input
          type="text"
          maxLength={MAX_COMPANY}
          className={styles.input}
          placeholder={f.companyPh}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>{f.message}</label>
        <textarea
          rows={3}
          maxLength={MAX_MESSAGE}
          className={styles.textarea}
          placeholder={f.messagePh}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className={styles.sandbox}>
        <div className={styles.sandboxHead}>
          <span className={styles.sandboxTitle}>{sb.title}</span>
          <span className={styles.sandboxReassure}>{sb.reassure}</span>
        </div>

        <div className={styles.chips}>
          {chip('write', sb.write)}
          {chip('voice', sb.voice)}
          {chip('media', sb.media)}
          {chip('link', sb.link)}
          {chip('board', sb.board)}
        </div>

        {tools.write && (
          <div className={styles.panelIn}>
            <textarea
              rows={5}
              maxLength={MAX_NOTE}
              className={styles.writeArea}
              placeholder={sb.writePh}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        )}

        {tools.voice && (
          <div className={`${styles.voicePanel} ${styles.panelIn}`}>
            {recState === 'idle' && (
              <div className={styles.voiceRow}>
                <button type="button" className={styles.recBtn} onClick={startRec}>
                  <span className={styles.recDotIdle} />
                  {sb.recIdle}
                </button>
                <span className={styles.hintText}>{sb.recHint}</span>
              </div>
            )}
            {recState === 'recording' && (
              <div className={styles.voiceRow}>
                <span className={styles.recDotLive} />
                <span className={styles.recTime}>{recTime}</span>
                <button type="button" className={styles.pillBtn} onClick={stopRec}>
                  <span className={styles.stopSquare} />
                  {sb.recStop}
                </button>
              </div>
            )}
            {recState === 'done' && (
              <div className={styles.voiceRow}>
                <audio controls src={recURL ?? undefined} className={styles.audioPlayer} />
                <button type="button" className={styles.pillBtn} onClick={resetRec}>
                  {sb.recRedo}
                </button>
              </div>
            )}
            {recState === 'denied' && <span className={styles.deniedText}>{sb.recDenied}</span>}
          </div>
        )}

        {tools.media && (
          <div className={`${styles.mediaPanel} ${styles.panelIn}`}>
            <label className={styles.mediaDrop}>
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf"
                onChange={addMedia}
              />
              <svg width="22" height="22" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12 V3 M5.5 6.5 L9 3 L12.5 6.5" />
                <path d="M3 11 V14 a1 1 0 0 0 1 1 H14 a1 1 0 0 0 1-1 V11" />
              </svg>
              <span className={styles.mediaDropText}>{sb.mediaDrop}</span>
              <span className={styles.mediaDropHint}>{sb.mediaHint}</span>
            </label>
            {media.map((m, i) => (
              <div className={styles.fileRow} key={m.url}>
                {m.isImage ? (
                  <span className={styles.thumb} style={{ backgroundImage: `url(${m.url})` }} />
                ) : (
                  <span className={styles.fileExt}>{m.ext}</span>
                )}
                <div className={styles.fileMeta}>
                  <span className={styles.fileName}>{m.file.name}</span>
                  <span className={styles.fileSize}>{m.sizeLabel}</span>
                </div>
                <button type="button" className={styles.removeBtn} onClick={() => removeMedia(i)}>
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {tools.link && (
          <div className={`${styles.linkPanel} ${styles.panelIn}`}>
            {links.map((l, i) => (
              <div className={styles.linkRow} key={i}>
                <input
                  type="url"
                  maxLength={MAX_LINK}
                  className={styles.linkInput}
                  placeholder={sb.linkPh}
                  value={l}
                  onChange={(e) => setLink(i, e.target.value)}
                />
                {links.length > 1 && (
                  <button type="button" className={styles.removeBtn} onClick={() => removeLink(i)}>
                    &times;
                  </button>
                )}
              </div>
            ))}
            {links.length < MAX_LINKS && (
              <button
                type="button"
                className={styles.addLinkBtn}
                onClick={() => setLinks((prev) => [...prev, ''])}
              >
                + {sb.linkAdd}
              </button>
            )}
          </div>
        )}

        {tools.board && <SketchBoard board={boardRef.current} accent={accent} s={sb} />}
      </div>

      {error && <div className={styles.errorNote}>{f.error}</div>}

      <div className={styles.submitRow}>
        <button type="submit" className={styles.submitBtn} disabled={sending}>
          {sending ? f.sending : f.submit}
        </button>
        <span className={styles.orNote}>{f.or}</span>
      </div>
    </form>
  );
}
