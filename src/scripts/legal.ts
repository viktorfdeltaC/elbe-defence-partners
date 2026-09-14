/**
 * The imprint and the privacy policy as dialogs on the one-pager.
 *
 * The footer links are ordinary links to /impressum and /datenschutz, which
 * work without JavaScript and can be shared. A plain click opens the same text
 * here as a dialog instead. A click with a modifier key or the middle button is
 * left alone, so "open in new tab" still does what it says. Any link carrying
 * data-legal-open is picked up — the contact form's privacy note will be one,
 * and its dialog then opens on top of the form without clearing it.
 *
 * Opening is native: showModal(), with the entry transition in CSS. Closing is
 * not, because Firefox and Safari take a dialog out of the top layer as soon as
 * close() runs and the exit transition would play underneath the sticky rail.
 * So the dialog fades first and closes after.
 */

const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Slightly longer than the 0.28s transition in LegalDialog.astro. */
const EXIT_FALLBACK_MS = 360;

const dialogs = new Map<string, HTMLDialogElement>();
for (const dialog of document.querySelectorAll<HTMLDialogElement>('dialog[data-legal-dialog]')) {
  dialogs.set(dialog.dataset.legalDialog!, dialog);
}

/** Where focus goes back to — the link that opened the dialog. */
const openers = new WeakMap<HTMLDialogElement, HTMLElement>();

// The link is passed in rather than read from document.activeElement: Safari
// does not focus a link on click, so activeElement would be <body>.
const openDialog = (dialog: HTMLDialogElement, opener: HTMLElement) => {
  if (dialog.open) return;
  openers.set(dialog, opener);
  dialog.showModal();
  // Every opening starts at the top. Only after showModal(): a closed dialog is
  // display:none, a scroll reset there does nothing, and the text would come
  // back wherever the reader left it last time.
  dialog.querySelector('.legal-dialog__body')?.scrollTo(0, 0);
};

const closeDialog = (dialog: HTMLDialogElement) => {
  if (!dialog.open || dialog.classList.contains('is-closing')) return;
  if (calm) {
    dialog.close();
    return;
  }

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    dialog.removeEventListener('transitionend', onEnd);
    // close() first, then drop the class: the other way round the dialog
    // would flash back to full opacity for a frame.
    dialog.close();
    dialog.classList.remove('is-closing');
  };
  const onEnd = (event: TransitionEvent) => {
    if (event.target === dialog && !event.pseudoElement) finish();
  };

  dialog.addEventListener('transitionend', onEnd);
  window.setTimeout(finish, EXIT_FALLBACK_MS);
  dialog.classList.add('is-closing');
};

for (const dialog of dialogs.values()) {
  // Escape: taken over so the exit fade plays.
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDialog(dialog);
  });

  dialog.querySelector('[data-legal-close]')?.addEventListener('click', () => closeDialog(dialog));

  // The backdrop is the dialog element itself — its content fills the box, so
  // nothing else hits it. Both ends of the click have to land there: selecting
  // text in the dialog and letting go outside it must not close it.
  let pressedOnBackdrop = false;
  dialog.addEventListener('pointerdown', (event) => {
    pressedOnBackdrop = event.target === dialog;
  });
  dialog.addEventListener('click', (event) => {
    if (pressedOnBackdrop && event.target === dialog) closeDialog(dialog);
    pressedOnBackdrop = false;
  });

  // A link to a place on this page — the imprint's way to the contact form —
  // closes the dialog, or the jump would happen out of sight behind it. At
  // once and without handing focus back: the browser jumps only after this
  // handler, and focusing the footer link on the way out of an animated close
  // would scroll the page straight back down to it.
  dialog.addEventListener('click', (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
    if (!link) return;
    openers.delete(dialog);
    dialog.close();
  });

  // Browsers restore focus themselves on close; this covers the ones that
  // do not, and is harmless where they do.
  dialog.addEventListener('close', () => {
    const opener = openers.get(dialog);
    if (opener?.isConnected) opener.focus();
  });
}

document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[data-legal-open]');
  const dialog = link && dialogs.get(link.dataset.legalOpen!);
  if (!link || !dialog) return;

  event.preventDefault();
  openDialog(dialog, link);
});
