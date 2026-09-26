export type ContactPayload = { name: string; email: string; message: string };

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/** The address the Contact section's EMAIL slot opens a mail to. */
export const CONTACT_EMAIL = 'rychanrc@outlook.com';

/** The only place the contact-form vendor is named (decision D4).
 *  Resolves on success; throws with a message the UI can show otherwise. */
export async function submitContactForm({ name, email, message }: ContactPayload): Promise<void> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
  if (!accessKey) {
    // Fail loudly rather than report a success that never left the browser.
    throw new Error('The contact form is not configured yet. Please email me directly.');
  }

  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ access_key: accessKey, name, email, message }),
  });

  if (!res.ok) throw new Error(`Web3Forms responded ${res.status} ${res.statusText}`);

  const body = (await res.json()) as { success?: boolean; message?: string };
  if (!body.success) throw new Error(body.message || 'Web3Forms rejected the submission.');
}
