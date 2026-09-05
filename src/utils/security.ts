export const generateSecureId = (prefix: string): string => {
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const bytes = new Uint32Array(4);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes, (value) =>
      value.toString(16).padStart(8, '0')
    ).join('');
    return `${prefix}-${hex}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const sanitizeText = (value: string, maxLength = 200): string => {
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
};

export const copyTextSecurely = async (text: string): Promise<boolean> => {
  if (!text) return false;

  if (navigator?.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall back to a manual hidden textarea copy for non-secure contexts.
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch {
    return false;
  }
};
