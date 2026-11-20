# Feedback backend

The site's Contribute page posts submissions to a Google Apps Script web app, which appends each one as a row in the "Submissions" tab of a Google Sheet. The site is static, so this script is the only server-side piece.

## One-time setup (about two minutes)

1. Open the feedback spreadsheet and choose **Extensions > Apps Script**.
2. Replace the contents of `Code.gs` with [`Code.gs`](Code.gs) from this folder. Optionally set `NOTIFY_EMAIL` to get an email for each submission. Save.
3. Choose **Deploy > New deployment**. Select type **Web app**. Set **Execute as: Me** and **Who has access: Anyone** (not "Anyone with Google account", which would make visitors sign in). Click **Deploy** and approve the permissions prompt (it asks to edit this spreadsheet and, if `NOTIFY_EMAIL` is set, to send email as you).
4. Copy the web app URL (it ends in `/exec`) and paste it into `FEEDBACK_ENDPOINT` in `lib/site.ts`. Commit; the site redeploys.

If "Anyone" is not offered (some Google Workspace domains restrict anonymous web apps), deploy the same script from a sheet in an account that allows it, or ask your Workspace admin.

## Updating the script later

Edit the code, then **Deploy > Manage deployments > Edit (pencil) > Version: New version > Deploy**. The URL stays the same.

## How it behaves

- With JavaScript, the page sends the form with `fetch` and shows the result inline. Without JavaScript, the form posts directly and the script returns a short confirmation page with a link back to the site.
- Until `FEEDBACK_ENDPOINT` is set, the form opens an email to stanfordimpact@stanford.edu with the fields filled in.
- Spam guards: a hidden honeypot field, a minimum time on the page, length caps, and a site-wide limit of 30 submissions per 10 minutes. Values that start with `=`, `+`, `-`, `@` or a tab are stored as text so they cannot run as formulas.
- Name, email and affiliation are optional. Columns L and M (Status, Triage notes) are for staff.
