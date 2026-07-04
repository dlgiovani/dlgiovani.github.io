import { useMemo, useState } from 'react';
import type { Attachment } from '../types';
import { mediaClass } from '../lib/format';
import { AttachmentPreview } from './AttachmentPreview';
import { Lightbox } from './Lightbox';

interface Props {
  attachments: Attachment[];
}

export function MediaGrid({ attachments }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Only images and videos open in the lightbox; audio/pdf/other stay inline.
  const zoomable = useMemo(
    () => attachments.filter((a) => ['image', 'video'].includes(mediaClass(a.content_type, a.original_filename))),
    [attachments],
  );

  if (!attachments.length) return null;

  return (
    <>
      <div className="media">
        {attachments.map((a) => {
          const zi = zoomable.indexOf(a);
          return (
            <AttachmentPreview
              key={a.id}
              attachment={a}
              onZoom={zi >= 0 ? () => setLightboxIdx(zi) : undefined}
            />
          );
        })}
      </div>
      {lightboxIdx != null && zoomable.length > 0 && (
        <Lightbox
          items={zoomable}
          index={lightboxIdx}
          onIndex={setLightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}
