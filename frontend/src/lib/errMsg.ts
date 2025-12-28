import { toast } from 'sonner';
import { capitalize, formatKey } from './utils';

export const showError = (err: any) => {
  const normalizeMessage = (msg: any) => ({
    title: msg?.path ? capitalize(formatKey(msg.path)) : 'Error',
    description: msg?.message || String(msg) || 'Something went wrong!',
  });

  let messages: { title: string; description?: string }[] = [];

  if (typeof err === 'string') {
    messages = [{ title: 'Error', description: err }];
  } else if (Array.isArray(err)) {
    messages = err.map(normalizeMessage);
  } else {
    const errData = err?.response?.data;

    if (Array.isArray(errData?.errors)) {
      messages = errData.errors.map(normalizeMessage);
    } else if (errData?.message) {
      messages = [{ title: 'Error', description: errData.message }];
    } else if (errData?.error) {
      messages = [{ title: 'Error', description: errData.error }];
    } else if (err?.message) {
      messages = [{ title: 'Error', description: err.message }];
    }
  }

  if (!messages.length) {
    messages = [{ title: 'Error', description: 'Something went wrong!' }];
  }

  // ✅ Deduplicate by description to avoid spamming the same error
  const seen = new Set<string>();
  messages.forEach((msg) => {
    if (!msg.description || seen.has(msg.description)) return;
    seen.add(msg.description);
    toast.error(msg.title, { description: msg.description });
  });
};
