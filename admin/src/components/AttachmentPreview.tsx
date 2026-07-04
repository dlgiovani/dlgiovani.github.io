import type { Attachment } from '../types';
import { useLazyBlobUrl } from '../hooks/useLazyBlobUrl';
import { fileExt, formatBytes, mediaClass } from '../lib/format';
import { IconDownload, IconExternal, IconFile, IconWave, IconZoom } from './icons';

interface Props {
  attachment: Attachment;
  onZoom?: () => void;
}

const KIND_LABEL: Record<string, string> = { voice: 'voice', board: 'sketch', media: 'file' };

export function AttachmentPreview({ attachment, onZoom }: Props) {
  const { setNode, status, url, error, retry } = useLazyBlobUrl(attachment.download_path);
  const cls = mediaClass(attachment.content_type, attachment.original_filename);
  const kindTag = KIND_LABEL[attachment.kind] ?? attachment.kind;

  return (
    <div className="tile" ref={setNode}>
      <div className={`tile-body${cls === 'audio' || cls === 'other' ? ' plain' : ''}`}>
        {status !== 'ready' && status !== 'error' && (
          <span className="tile-loading">
            <span className="spin" /> loading…
          </span>
        )}
        {status === 'error' && (
          <span className="tile-error">
            {error || 'Failed'} ·{' '}
            <button className="btn tiny" onClick={retry}>
              retry
            </button>
          </span>
        )}
        {status === 'ready' && url && (
          <>
            {cls === 'image' && (
              <img
                className="thumb"
                src={url}
                alt={attachment.original_filename}
                onClick={onZoom}
                loading="lazy"
              />
            )}
            {cls === 'video' && <video src={url} controls preload="metadata" />}
            {cls === 'audio' && (
              <div className="audio-wrap">
                <IconWave className="waveglyph" />
                <audio src={url} controls preload="metadata" />
              </div>
            )}
            {cls === 'pdf' && <embed src={url} type="application/pdf" style={{ width: '100%', height: 220 }} />}
            {cls === 'other' && (
              <div className="filecard">
                <IconFile />
                <span className="ext">{fileExt(attachment.original_filename)}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="tile-foot">
        <div className="meta">
          <div className="name" title={attachment.original_filename}>
            {attachment.original_filename}
          </div>
          <div className="sub">
            <span className="kind-tag">{kindTag}</span>
            <span>{formatBytes(attachment.size_bytes)}</span>
          </div>
        </div>
        {(cls === 'image' || cls === 'video') && url && onZoom && (
          <button className="btn icon tiny" onClick={onZoom} aria-label="View full size" title="View full size">
            <IconZoom width={15} height={15} />
          </button>
        )}
        {cls === 'pdf' && url && (
          <a className="btn icon tiny" href={url} target="_blank" rel="noreferrer" aria-label="Open PDF" title="Open in new tab">
            <IconExternal width={15} height={15} />
          </a>
        )}
        {url ? (
          <a className="btn icon tiny" href={url} download={attachment.original_filename} aria-label="Download" title="Download">
            <IconDownload width={15} height={15} />
          </a>
        ) : (
          <span className="btn icon tiny" style={{ opacity: 0.5 }} aria-hidden>
            <IconDownload width={15} height={15} />
          </span>
        )}
      </div>
    </div>
  );
}
