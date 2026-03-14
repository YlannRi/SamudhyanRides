export type TrustedContact = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  email?: string;
  isPrimary?: boolean;
};

type ProfileRecord = Record<string, unknown>;

function toTrimmedString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function getProfileRecord(value: unknown): ProfileRecord | null {
  if (Array.isArray(value)) {
    return value.length > 0 && value[0] && typeof value[0] === 'object'
      ? value[0] as ProfileRecord
      : null;
  }

  return value && typeof value === 'object' ? value as ProfileRecord : null;
}

export function normalizeTrustedContacts(value: unknown): TrustedContact[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') {
      return [];
    }

    const record = entry as Record<string, unknown>;
    const id = toTrimmedString(record.id);
    const firstName = toTrimmedString(record.firstName);
    const lastName = toTrimmedString(record.lastName);
    const phone = toTrimmedString(record.phone);
    const address = toTrimmedString(record.address) || undefined;
    const email = toTrimmedString(record.email) || undefined;

    if (!id || !firstName || !lastName || !phone) {
      return [];
    }

    return [{
      id,
      firstName,
      lastName,
      phone,
      address,
      email,
      isPrimary: Boolean(record.isPrimary),
    }];
  });
}

export function getPrimaryTrustedContact(contacts: TrustedContact[]) {
  return contacts.find((contact) => contact.isPrimary) ?? contacts[0] ?? null;
}

export function loadTrustedContactsFromStorage() {
  try {
    return normalizeTrustedContacts(JSON.parse(localStorage.getItem('trustedContacts') ?? '[]'));
  } catch {
    return [];
  }
}

export function saveTrustedContactsToStorage(contacts: TrustedContact[]) {
  localStorage.setItem('trustedContacts', JSON.stringify(contacts));
}
