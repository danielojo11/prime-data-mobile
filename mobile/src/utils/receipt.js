import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { formatFullDate, formatNaira } from './format';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => {
    switch (character) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}

function statusStyles(status) {
  if (status === 'Successful') {
    return { background: '#ECFDF5', color: '#047857' };
  }
  if (status === 'Pending') {
    return { background: '#FFFBEB', color: '#B45309' };
  }
  return { background: '#FEF2F2', color: '#B91C1C' };
}

function printOnWeb(html) {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return Promise.reject(new Error('Printing is not available'));
  }

  return new Promise((resolve, reject) => {
    const frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.style.position = 'fixed';
    frame.style.right = '0';
    frame.style.bottom = '0';
    frame.style.width = '0';
    frame.style.height = '0';
    frame.style.border = '0';
    document.body.appendChild(frame);

    const cleanup = () => {
      if (frame.parentNode) frame.parentNode.removeChild(frame);
    };

    try {
      const doc = frame.contentWindow?.document;
      if (!doc) throw new Error('Printing is not available');

      doc.open();
      doc.write(html);
      doc.close();

      frame.contentWindow.onafterprint = () => {
        cleanup();
        resolve();
      };

      window.setTimeout(() => {
        try {
          frame.contentWindow.focus();
          frame.contentWindow.print();
          window.setTimeout(resolve, 1000);
          window.setTimeout(cleanup, 60000);
        } catch (error) {
          cleanup();
          reject(error);
        }
      }, 250);
    } catch (error) {
      cleanup();
      reject(error);
    }
  });
}

export function buildReceiptHtml(transaction, user) {
  const status = transaction.status || 'Successful';
  const badge = statusStyles(status);
  const amount = `${transaction.isCredit ? '+' : '-'}${formatNaira(transaction.amount)}`;
  const customer = user?.name || transaction.customerName || 'PrimeData Customer';

  const rows = [
    ['Service', transaction.service || transaction.type || 'Transaction'],
    ['Description', transaction.desc || '—'],
    ['Provider', transaction.network],
    ['Recipient', transaction.phone],
    ['Customer', customer],
    ['Date', formatFullDate(transaction.date)],
    ['Reference', transaction.id || '—'],
  ].filter(([, value]) => value);

  const detailRows = rows
    .map(
      ([label, value]) => `
        <tr${label === 'Reference' ? ' class="reference"' : ''}>
          <td class="label">${escapeHtml(label)}</td>
          <td class="value">${escapeHtml(value)}</td>
        </tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>PrimeData Receipt</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 32px 20px;
            background: #F4F5F7;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            color: #111827;
          }
          .receipt {
            max-width: 420px;
            margin: 0 auto;
            background: #FFFFFF;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid #E5E7EB;
          }
          .header {
            background: #050505;
            padding: 24px 24px 22px;
            text-align: center;
            color: #FFFFFF;
          }
          .mark {
            width: 46px;
            height: 46px;
            margin: 0 auto 10px;
            border-radius: 14px;
            background: linear-gradient(135deg, #34D399, #10B981);
            color: #04140E;
            font-size: 22px;
            font-weight: 800;
            line-height: 46px;
            text-align: center;
          }
          .brand { font-size: 19px; font-weight: 800; letter-spacing: -0.3px; }
          .tagline { margin-top: 3px; font-size: 10px; letter-spacing: 1.6px; text-transform: uppercase; color: #9CA3AF; }
          .summary { padding: 24px 24px 18px; text-align: center; }
          .receipt-label { font-size: 10px; letter-spacing: 1.4px; text-transform: uppercase; color: #6B7280; }
          .amount { margin-top: 8px; font-size: 30px; font-weight: 800; letter-spacing: -0.8px; color: ${transaction.isCredit ? '#047857' : '#111827'}; }
          .status {
            display: inline-block;
            margin-top: 10px;
            padding: 4px 11px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.4px;
            text-transform: uppercase;
            background: ${badge.background};
            color: ${badge.color};
          }
          .details { padding: 4px 24px 20px; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 9px 0; font-size: 12px; vertical-align: top; border-bottom: 1px solid #F3F4F6; }
          tr:last-child td { border-bottom: none; }
          .label { color: #6B7280; }
          .value { text-align: right; font-weight: 600; color: #111827; word-break: break-word; }
          .reference .value { font-family: 'SFMono-Regular', Consolas, monospace; font-weight: 700; letter-spacing: 0.3px; }
          .footer {
            padding: 16px 24px 22px;
            border-top: 1px dashed #E5E7EB;
            text-align: center;
            font-size: 10px;
            line-height: 1.6;
            color: #9CA3AF;
          }
          .thanks { color: #10B981; font-weight: 700; font-size: 11px; margin-bottom: 4px; }
          @media print {
            body { background: #FFFFFF; padding: 0; }
            .receipt { border: none; border-radius: 0; max-width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="mark">P</div>
            <div class="brand">PrimeData</div>
            <div class="tagline">VTU &amp; Digital Services</div>
          </div>

          <div class="summary">
            <div class="receipt-label">Transaction Receipt</div>
            <div class="amount">${escapeHtml(amount)}</div>
            <div class="status">${escapeHtml(status)}</div>
          </div>

          <div class="details">
            <table>${detailRows}</table>
          </div>

          <div class="footer">
            <div class="thanks">Thank you for choosing PrimeData</div>
            Printed on ${escapeHtml(formatFullDate(new Date()))}<br />
            support@primedata.com · primedata.com
          </div>
        </div>
      </body>
    </html>`;
}

export async function printTransactionReceipt(transaction, user) {
  const html = buildReceiptHtml(transaction, user);
  if (Platform.OS === 'web') {
    return printOnWeb(html);
  }
  return Print.printAsync({ html });
}

export async function shareTransactionReceipt(transaction, user) {
  const html = buildReceiptHtml(transaction, user);

  if (Platform.OS === 'web') {
    return printOnWeb(html);
  }

  const { uri } = await Print.printToFileAsync({ html });
  const available = await Sharing.isAvailableAsync();

  if (!available) {
    throw new Error('Sharing is not available on this device');
  }

  return Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: 'Share PrimeData receipt',
    UTI: 'com.adobe.pdf',
  });
}
