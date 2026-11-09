import { formatDate, formatNaira, initialsOf, makeId } from '../format';

describe('formatNaira', () => {
  it('groups thousands and rounds by default', () => {
    expect(formatNaira(14500.5)).toBe('₦14,501');
    expect(formatNaira(1000)).toBe('₦1,000');
  });

  it('keeps two decimals when requested', () => {
    expect(formatNaira(14500.5, true)).toBe('₦14,500.50');
  });

  it('falls back to zero for empty values', () => {
    expect(formatNaira()).toBe('₦0');
  });
});

describe('formatDate', () => {
  it('passes through friendly labels', () => {
    expect(formatDate('Today, 10:42 AM')).toBe('Today, 10:42 AM');
    expect(formatDate('Yesterday, 2:15 PM')).toBe('Yesterday, 2:15 PM');
  });

  it('returns a dash for missing dates', () => {
    expect(formatDate()).toBe('—');
  });

  it('formats the current ISO date as today', () => {
    expect(formatDate(new Date().toISOString())).toMatch(/^Today, /);
  });
});

describe('initialsOf', () => {
  it('uses the first and last name initials', () => {
    expect(initialsOf('Ibrahim Adeyemi')).toBe('IA');
  });

  it('handles a single name and empty input', () => {
    expect(initialsOf('Ibrahim')).toBe('I');
    expect(initialsOf()).toBe('U');
  });
});

describe('makeId', () => {
  it('creates a prefixed reference', () => {
    expect(makeId()).toMatch(/^TRX-\d{7}$/);
    expect(makeId('RC')).toMatch(/^RC-\d{7}$/);
  });
});
