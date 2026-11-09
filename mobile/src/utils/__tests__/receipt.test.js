import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {
  buildReceiptHtml,
  printTransactionReceipt,
  shareTransactionReceipt,
} from '../receipt';

jest.mock('expo-print', () => ({
  printAsync: jest.fn(() => Promise.resolve()),
  printToFileAsync: jest.fn(() => Promise.resolve({ uri: 'file:///receipt.pdf' })),
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  shareAsync: jest.fn(() => Promise.resolve()),
}));

const transaction = {
  id: 'TRX-1234567',
  service: 'Data Purchase',
  desc: 'MTN 1GB (SME)',
  amount: 260,
  status: 'Successful',
  date: '2026-11-05T10:42:00.000Z',
  isCredit: false,
  network: 'MTN',
  phone: '08012345678',
};

const user = { name: 'Ibrahim' };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('buildReceiptHtml', () => {
  it('renders the branded receipt with transaction details', () => {
    const html = buildReceiptHtml(transaction, user);

    expect(html).toContain('PrimeData');
    expect(html).toContain('Transaction Receipt');
    expect(html).toContain('TRX-1234567');
    expect(html).toContain('₦260');
    expect(html).toContain('MTN 1GB (SME)');
    expect(html).toContain('08012345678');
    expect(html).toContain('Ibrahim');
    expect(html).toContain('Successful');
  });

  it('marks credit transactions with a plus sign', () => {
    const html = buildReceiptHtml(
      { ...transaction, isCredit: true, status: 'Pending' },
      user
    );

    expect(html).toContain('+₦260');
    expect(html).toContain('Pending');
  });

  it('escapes HTML from transaction fields', () => {
    const html = buildReceiptHtml(
      { ...transaction, desc: '<script>alert("x")</script>' },
      user
    );

    expect(html).not.toContain('<script>alert("x")</script>');
    expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  });

  it('omits optional rows that have no value', () => {
    const html = buildReceiptHtml(
      { ...transaction, network: undefined, phone: undefined },
      user
    );

    expect(html).not.toContain('Provider');
    expect(html).not.toContain('Recipient');
  });
});

describe('printTransactionReceipt', () => {
  it('sends the receipt HTML to the printer', async () => {
    await printTransactionReceipt(transaction, user);

    expect(Print.printAsync).toHaveBeenCalledTimes(1);
    expect(Print.printAsync.mock.calls[0][0].html).toContain('TRX-1234567');
  });
});

describe('shareTransactionReceipt', () => {
  it('creates a PDF and opens the share sheet', async () => {
    await shareTransactionReceipt(transaction, user);

    expect(Print.printToFileAsync).toHaveBeenCalledTimes(1);
    expect(Sharing.shareAsync).toHaveBeenCalledWith(
      'file:///receipt.pdf',
      expect.objectContaining({ mimeType: 'application/pdf' })
    );
  });

  it('throws when sharing is unavailable', async () => {
    Sharing.isAvailableAsync.mockResolvedValueOnce(false);

    await expect(shareTransactionReceipt(transaction, user)).rejects.toThrow(
      'Sharing is not available on this device'
    );
    expect(Sharing.shareAsync).not.toHaveBeenCalled();
  });
});
