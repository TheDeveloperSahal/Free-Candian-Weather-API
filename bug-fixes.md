# Bug Fixes

Open issues to fix before this can go on a resume.

## 1. Empty response on failure (Critical)

- **Files:** `src/scripts/intiliazer.js`, `src/app.js`
- **Problem:** When the fetch or data-clean fails, `final_data` stays `undefined`, and the API sends back an empty HTTP 200 body (`Content-Length: 0`). Repro: `?location=Victoria` returns nothing.
- **Fix:** Always respond with proper JSON and an appropriate status code on both success and failure. Never return an empty body.

## 2. Errors are swallowed (Critical)

- **File:** `src/scripts/intiliazer.js`
- **Problem:** The `.catch()` handlers in `Intializer` only `console.log` and return `undefined`. The client never knows an error happened.
- **Fix:** Let errors propagate (throw) so `app.js` can send a real error response.

## 3. "Location Not found" branch hangs (Critical)

- **File:** `src/app.js` (lines 10-14)
- **Problem:** When `location` is missing, it sets HTTP 200 but **never sends a response** — the request just hangs.
- **Fix:** Send a response (e.g. `res.status(400).json({ error: "Location not found" })`) and add a `return`.

## 4. Missing location throws TypeError (High)

- **File:** `src/scripts/gettingurl.js` (line 3)
- **Problem:** `const { results: [{latitude,longitude}] } = ...` throws if the geocoding API returns no results (e.g. an unknown city) or the shape doesn't match.
- **Fix:** Validate `results` exists and has entries before destructuring; throw a clear error otherwise.

## 5. Naming / typo inconsistencies (Low)

- **File:** `src/scripts/DataCleaner.js`
- **Problems:**
  - `"latitide"` should be `"latitude"` (see location object)
  - `"Actual"` is inconsistently capitalized (should be `"actual"`, matching `"rounded"`)
- **Fix:** Rename keys for consistency.

## 6. No input validation + Canada-only limitation (Medium)

- **File:** `src/app.js`
- **Problem:** Non-Canadian locations (New York, London, Tokyo) return an empty body because `weather.gc.ca` only serves Canadian data (`OUT_OF_SERVICE_BOUNDARY`). No handling.
- **Fix:** Validate the location; detect out-of-service responses and return a clear user-facing error (e.g. "Location not supported — this API covers Canada only").

## Notes

- The underlying `weather.gc.ca` API is a third-party/unofficial endpoint. Confirm it's permissible for a student/portfolio project and clearly document the Canada-only scope.
- Re-test with the same locations after fixing to confirm every one returns data: Toronto, Vancouver, Ottawa, Calgary, Montreal, Edmonton, Winnipeg, Quebec, Halifax, St. John's, Saskatoon, Regina, Hamilton, Victoria.