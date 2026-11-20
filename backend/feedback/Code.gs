/**
 * When Social Science Scales: feedback form backend.
 *
 * Receives submissions from the site's /contribute form and appends one row per
 * submission to the "Submissions" tab of the spreadsheet this script is attached to.
 * Setup steps are in backend/feedback/README.md.
 */

var SHEET_NAME = 'Submissions';
var SITE_URL = 'https://michael-149.github.io/big-wins-microsite/';
// Address that gets an email for each new submission. Leave '' for no alerts.
var NOTIFY_EMAIL = '';

var TYPES = ['suggest-case', 'correction', 'vertical', 'near-miss', 'general'];
var MAX_LENGTH = { message: 5000, links: 2000, short: 300, version: 40 };
var MIN_SECONDS_ON_PAGE = 3;      // faster submissions are treated as bots
var MAX_PER_TEN_MINUTES = 30;     // site-wide flood guard

function doPost(e) {
  var p = (e && e.parameter) || {};
  var wantsHtml = p.format === 'html';
  try {
    // Honeypot: real visitors never see or fill the "website" field.
    if (p.website) return respond_(wantsHtml, true, 'Thank you.');

    var startedAt = Number(p.t0);
    if (!startedAt || (Date.now() - startedAt) / 1000 < MIN_SECONDS_ON_PAGE) {
      throw new Error('Please take a moment to review your message, then submit again.');
    }

    var message = clean_(p.message, MAX_LENGTH.message);
    if (message.replace(/^'/, '').length < 10) throw new Error('Please add a message of at least a few words.');

    var email = clean_(p.email, MAX_LENGTH.short);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('That email address does not look complete.');
    }

    throttle_();

    var type = TYPES.indexOf(p.type) >= 0 ? p.type : 'general';
    var row = [
      new Date(),
      type,
      clean_(p.page, MAX_LENGTH.short),
      clean_(p.topic, MAX_LENGTH.short),
      message,
      clean_(p.links, MAX_LENGTH.links),
      clean_(p.name, MAX_LENGTH.short),
      email,
      clean_(p.affiliation, MAX_LENGTH.short),
      p.credit === 'yes' ? 'Yes' : 'No',
      clean_(p.version, MAX_LENGTH.version),
      'New',
      ''
    ];

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      if (!sheet) throw new Error('The feedback sheet is not set up. Please email stanfordimpact@stanford.edu.');
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        'When Social Science Scales: new ' + type + ' submission',
        'Page: ' + row[2] + '\nTopic: ' + row[3] + '\n\n' + row[4] + '\n\nLinks: ' + row[5] +
          '\nFrom: ' + (row[6] || 'anonymous') + (row[7] ? ' <' + row[7] + '>' : '') +
          '\n\nOpen the sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
      );
    }

    return respond_(wantsHtml, true, 'Thank you. We received your submission.');
  } catch (err) {
    return respond_(wantsHtml, false, String((err && err.message) || err));
  }
}

function doGet() {
  return respond_(false, true, 'The feedback endpoint is running.');
}

// Trim, cap length, and stop spreadsheet formula injection (a value starting with
// = + - @ or a tab would otherwise run as a formula when the row is written).
function clean_(value, max) {
  var s = String(value === undefined || value === null ? '' : value)
    .replace(/\r\n?/g, '\n')
    .trim()
    .slice(0, max);
  if (/^[=+\-@\t]/.test(s)) s = "'" + s;
  return s;
}

function throttle_() {
  var cache = CacheService.getScriptCache();
  var key = 'count';
  var count = Number(cache.get(key) || 0);
  if (count >= MAX_PER_TEN_MINUTES) {
    throw new Error('We are receiving many submissions right now. Please try again in a few minutes.');
  }
  cache.put(key, String(count + 1), 600);
}

function respond_(asHtml, ok, message) {
  if (asHtml) {
    var safe = String(message).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
    return HtmlService.createHtmlOutput(
      '<!doctype html><meta charset="utf-8"><title>When Social Science Scales</title>' +
        '<body style="font-family:Arial,sans-serif;max-width:640px;margin:48px auto;padding:0 16px;line-height:1.5">' +
        '<h1 style="font-weight:400">' + (ok ? 'Thank you' : 'Something went wrong') + '</h1>' +
        '<p>' + safe + '</p>' +
        '<p><a href="' + SITE_URL + '">Return to When Social Science Scales</a></p></body>'
    );
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: ok, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}
