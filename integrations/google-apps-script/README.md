# Roamstead Google Sheets bridge setup

Dedicated private spreadsheet: https://docs.google.com/spreadsheets/d/1I8c3eefg2R0brmbxSqoyT-JIVqt8ydbZsi4Lz3BWiRo/edit

## Deployment
1. Sign into the Google account that can edit the dedicated Roamstead spreadsheet.
2. Open the spreadsheet, then Extensions > Apps Script. Rename the script project "Roamstead Submission Bridge".
3. Replace the default Code.gs contents with the exact contents of integrations/google-apps-script/Code.gs. Save.
4. In Apps Script > Project Settings > Script Properties, add ROAMSTEAD_BRIDGE_SECRET as a unique, randomly generated password of at least 32 characters. Save. Generate and store it in a password manager; do not place it in Drive, source control, or chat.
5. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone. Authorize using the spreadsheet owner's account. Anyone access is necessary for a headless Vercel server request, but every operation is HMAC authenticated and expires after 5 minutes. Never share the /exec URL beyond the server's environment configuration.
6. Copy the deployed https://script.google.com/macros/s/.../exec URL into Vercel project roamstead-v2 > Settings > Environment Variables as ROAMSTEAD_SHEETS_SCRIPT_URL (Production), and add the exact same secret as ROAMSTEAD_SHEETS_SHARED_SECRET (Production, sensitive).
7. Redeploy main. Verify /admin/early-access reads the permanent Sheets ledger; run a new test signup (using a distinct authorized test email), confirm sheet row, Resend email, and admin season and area.
8. Do NOT delete or alter earlier Resend contacts or change subscription preferences. Historical rows can only be migrated with accurate source details.

## Security and status
Apps Script is owned by the Roamstead spreadsheet owner; no Google Cloud service-account key is needed, and the organization key creation restriction remains active.
The script refuses invalid or expired signatures, uses a lock for writes, and makes writes idempotent by submission UUID.
This is not yet active until Apps Script is deployed, the secret matches, and the Vercel environment variables are added.
Until then, the admin retains the Resend fallback and current notification behavior. The site currently performs sheet append AFTER successful notification delivery; a subsequent reliability pass should make the ledger the first durable operation and reconcile delivery status, before claiming complete audit durability.
