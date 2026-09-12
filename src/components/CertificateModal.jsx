import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

export default function CertificateModal({ certificate, labels, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const closeOnBackdrop = (event) => {
    if (event.target !== event.currentTarget) return;
    const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) onClose();
  };

  return (
    <dialog ref={dialogRef} className="certificate-modal" aria-labelledby="certificate-modal-title" onCancel={onClose} onClick={closeOnBackdrop}>
      <header>
        <div><span>{certificate.issuer} · {certificate.date}</span><h2 id="certificate-modal-title">{certificate.title}</h2></div>
        <button type="button" onClick={onClose} aria-label={labels.close}><FiX /></button>
      </header>
      <div className={`certificate-viewer ${certificate.mediaType === "image" ? "is-image" : "is-pdf"}`}>
        {certificate.mediaType === "image" ? (
          <img src={certificate.file} alt={`${certificate.title} — ${certificate.issuer}`} />
        ) : (
          <iframe src={`${certificate.file}#toolbar=0&navpanes=0`} title={certificate.title} />
        )}
      </div>
    </dialog>
  );
}
