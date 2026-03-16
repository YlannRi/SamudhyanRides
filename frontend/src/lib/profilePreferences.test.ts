import { beforeEach, describe, expect, it } from 'vitest';
import {
  getPrimaryTrustedContact,
  getProfileRecord,
  loadTrustedContactsFromStorage,
  normalizeTrustedContacts,
  saveTrustedContactsToStorage,
} from './profilePreferences';

describe('profilePreferences', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('extracts a profile record from objects and arrays', () => {
    expect(getProfileRecord({ firstName: 'Alex' })).toEqual({ firstName: 'Alex' });
    expect(getProfileRecord([{ firstName: 'Alex' }])).toEqual({ firstName: 'Alex' });
    expect(getProfileRecord([])).toBeNull();
    expect(getProfileRecord('invalid')).toBeNull();
  });

  it('normalizes trusted contacts and drops invalid entries', () => {
    expect(
      normalizeTrustedContacts([
        {
          id: ' contact-1 ',
          firstName: ' Alex ',
          lastName: ' Driver ',
          phone: ' 07123 456789 ',
          address: ' 1 Example Street ',
          email: ' alex@example.com ',
          isPrimary: 1,
        },
        {
          id: 'missing-fields',
          firstName: 'Alex',
        },
        null,
      ]),
    ).toEqual([
      {
        id: 'contact-1',
        firstName: 'Alex',
        lastName: 'Driver',
        phone: '07123 456789',
        address: '1 Example Street',
        email: 'alex@example.com',
        isPrimary: true,
      },
    ]);

    expect(normalizeTrustedContacts('invalid')).toEqual([]);
  });

  it('finds the primary contact and falls back safely', () => {
    const contacts = [
      { id: '1', firstName: 'Alex', lastName: 'Driver', phone: '123' },
      { id: '2', firstName: 'Sam', lastName: 'Passenger', phone: '456', isPrimary: true },
    ];

    expect(getPrimaryTrustedContact(contacts)).toEqual(contacts[1]);
    expect(getPrimaryTrustedContact([contacts[0]])).toEqual(contacts[0]);
    expect(getPrimaryTrustedContact([])).toBeNull();
  });

  it('loads and saves trusted contacts from storage', () => {
    const contacts = [
      { id: '1', firstName: 'Alex', lastName: 'Driver', phone: '123', isPrimary: true },
    ];

    saveTrustedContactsToStorage(contacts);
    expect(JSON.parse(localStorage.getItem('trustedContacts') ?? '[]')).toEqual(contacts);
    expect(loadTrustedContactsFromStorage()).toEqual(contacts);
  });

  it('returns an empty contact list when stored data is invalid json', () => {
    localStorage.setItem('trustedContacts', '{broken-json');

    expect(loadTrustedContactsFromStorage()).toEqual([]);
  });
});
