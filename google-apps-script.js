/*
  reNOVAtion — Google Apps Script
  Deploy this as a Web App to receive waitlist & contributor form data.

  SETUP:
  1. Go to https://sheets.google.com and create a new spreadsheet
  2. Rename Sheet1 to "Waitlist"
  3. Add a second sheet and rename it to "Contributors"
  4. In "Waitlist" sheet, add headers in Row 1:  Timestamp | Email
  5. In "Contributors" sheet, add headers in Row 1:  Timestamp | Name | Email | Role | GitHub
  6. Go to Extensions > Apps Script
  7. Delete any existing code and paste this entire file
  8. Click Deploy > New Deployment
  9. Select type: "Web app"
  10. Set "Execute as": Me
  11. Set "Who has access": Anyone
  12. Click Deploy and copy the Web App URL
  13. Paste that URL into script.js where it says GOOGLE_SCRIPT_URL
*/

function doPost(e) {
    try {
        var data = JSON.parse(e.postData.contents);
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var timestamp = new Date().toLocaleString();

        if (data.type === 'waitlist') {
            var sheet = ss.getSheetByName('Waitlist');
            sheet.appendRow([timestamp, data.email]);
            return ContentService
                .createTextOutput(JSON.stringify({ status: 'ok', type: 'waitlist' }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        if (data.type === 'contributor') {
            var sheet = ss.getSheetByName('Contributors');
            sheet.appendRow([timestamp, data.name, data.email, data.role, data.github || '']);
            return ContentService
                .createTextOutput(JSON.stringify({ status: 'ok', type: 'contributor' }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        return ContentService
            .createTextOutput(JSON.stringify({ status: 'error', message: 'Unknown type' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService
            .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
