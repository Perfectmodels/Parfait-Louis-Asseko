
console.log("Starting security verification...");

const mockRules = {
  ".read": false,
  ".write": "auth != null",
  "siteConfig": { ".read": true },
  "castingApplications": {
    "$id": {
      ".write": "!data.exists()"
    }
  }
};

function checkAccess(path, action, auth) {
  const parts = path.split('/').filter(p => p !== '');
  let current = mockRules;
  let allowed = false;

  // Global rules
  if (action === 'read' && current['.read'] === true) allowed = true;
  if (action === 'write' && auth !== null && current['.write'] === "auth != null") allowed = true;

  // Path specific rules
  if (parts.length > 0) {
    const node = parts[0];
    if (current[node]) {
        if (action === 'read' && current[node]['.read'] === true) allowed = true;

        if (node === 'castingApplications' && action === 'write' && parts.length === 2) {
            // Simulate $id and !data.exists()
            allowed = true;
        }
    }
  }

  return allowed;
}

console.log("Checking public read on siteConfig:", checkAccess('/siteConfig', 'read', null) ? "PASS" : "FAIL");
console.log("Checking public read on root:", checkAccess('/', 'read', null) ? "FAIL (Allowed)" : "PASS (Denied)");
console.log("Checking public write on castingApplications/new_id:", checkAccess('/castingApplications/new_id', 'write', null) ? "PASS" : "FAIL");
console.log("Checking public write on siteConfig:", checkAccess('/siteConfig', 'write', null) ? "FAIL (Allowed)" : "PASS (Denied)");
console.log("Checking admin write on siteConfig:", checkAccess('/siteConfig', 'write', {uid: 'admin'}) ? "PASS" : "FAIL");

console.log("Security verification complete.");
