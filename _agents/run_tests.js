const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Simple helper to load TS file as JS by stripping basic types
function loadTSAsJS(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Remove interfaces
  content = content.replace(/export\s+interface\s+\w+\s*\{[\s\S]*?\}/g, '');
  
  // 2. Remove type imports
  content = content.replace(/import\s+type\s+[\s\S]*?;/g, '');
  
  // 3. Remove function parameter and return types: e.g. (text: string): boolean
  // Match : string, : boolean, : CrisisResource[], etc.
  content = content.replace(/:\s*(string|boolean|CrisisResource\[\]|any|Record<[^>]+>)/g, '');
  
  // 4. Map exports to the exports object
  content = content.replace(/export\s+function\s+(\w+)/g, 'exports.$1 = function $1');
  content = content.replace(/export\s+const\s+/g, 'exports.');
  
  // 5. Wrap inside an object to export
  const evalEnv = {};
  const wrappedCode = `(function(exports) {
    ${content}
  })(evalEnv);`;
  
  try {
    eval(wrappedCode);
  } catch (err) {
    console.error("Failed to eval TS-to-JS parsed code for:", filePath);
    console.error(err);
    throw err;
  }
  
  return evalEnv;
}

function runTests() {
  console.log("=== MINDGUARD AUTOMATED TEST RUNNER ===");
  let passed = 0;
  let failed = 0;
  
  function test(name, fn) {
    try {
      fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}`);
      console.error(err);
      failed++;
    }
  }

  // 1. Test safety.ts
  const safety = loadTSAsJS(path.join(__dirname, '../src/lib/safety.ts'));
  
  test("checkCrisis - matches suicidal keyword", () => {
    assert.strictEqual(safety.checkCrisis("I feel suicidal"), true);
  });
  
  test("checkCrisis - matches end my life", () => {
    assert.strictEqual(safety.checkCrisis("i want to end my life"), true);
  });
  
  test("checkCrisis - returns false for safe input", () => {
    assert.strictEqual(safety.checkCrisis("I am stressed about my chemistry mock test"), false);
  });
  
  test("checkCrisis - handles empty input", () => {
    assert.strictEqual(safety.checkCrisis(""), false);
    assert.strictEqual(safety.checkCrisis(null), false);
  });

  // 2. Test scrub.ts
  const scrub = loadTSAsJS(path.join(__dirname, '../src/lib/scrub.ts'));
  
  test("scrubPII - redacts email addresses", () => {
    const input = "Send details to test.user@hoop.com please.";
    const expected = "Send details to [EMAIL_REDACTED] please.";
    assert.strictEqual(scrub.scrubPII(input), expected);
  });
  
  test("scrubPII - redacts Indian phone numbers", () => {
    const input = "Call me at +919876543210 or 9123456789.";
    const expected = "Call me at [PHONE_REDACTED] or [PHONE_REDACTED].";
    assert.strictEqual(scrub.scrubPII(input), expected);
  });
  
  test("scrubPII - redacts name introductions", () => {
    const input = "Hello, my name is Rahul Sharma and I am a student.";
    const expected = "Hello, my name is [NAME_REDACTED] and I am a student.";
    assert.strictEqual(scrub.scrubPII(input), expected);
  });
  
  test("scrubPII - leaves safe text unchanged", () => {
    const input = "I am preparing for the JEE physics exam next week.";
    assert.strictEqual(scrub.scrubPII(input), input);
  });

  console.log("\n=======================================");
  console.log(`Test Summary: ${passed} passed, ${failed} failed.`);
  console.log("=======================================");
  
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
