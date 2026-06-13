const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");

const BASELINE = {
  overall: 93.59,
  code_quality: 86,
  security: 98,
  efficiency: 100,
  testing: 93,
  accessibility: 96,
  problem_alignment: 94
};

function runEvaluation() {
  try {
    // 1. Read files to analyze
    const schemaPath = path.join(rootDir, "schema.sql");
    const safetyPath = path.join(rootDir, "src/lib/safety.ts");
    const scrubPath = path.join(rootDir, "src/lib/scrub.ts");
    const groqPath = path.join(rootDir, "src/lib/groq.ts");
    const supabasePath = path.join(rootDir, "src/lib/supabase.ts");
    const testingPath = path.join(rootDir, "TESTING.md");
    const navbarPath = path.join(rootDir, "src/components/navbar-client.tsx");
    const layoutPath = path.join(rootDir, "src/app/layout.tsx");
    const relaxPath = path.join(rootDir, "src/app/relax/page.tsx");
    const blogsPath = path.join(rootDir, "src/app/blogs/page.tsx");

    let schemaContent = "";
    let safetyContent = "";
    let scrubContent = "";
    let groqContent = "";
    let supabaseContent = "";
    let testingContent = "";
    let navbarContent = "";
    let layoutContent = "";
    let relaxContent = "";
    let blogsContent = "";

    if (fs.existsSync(schemaPath)) schemaContent = fs.readFileSync(schemaPath, "utf8");
    if (fs.existsSync(safetyPath)) safetyContent = fs.readFileSync(safetyPath, "utf8");
    if (fs.existsSync(scrubPath)) scrubContent = fs.readFileSync(scrubPath, "utf8");
    if (fs.existsSync(groqPath)) groqContent = fs.readFileSync(groqPath, "utf8");
    if (fs.existsSync(supabasePath)) supabaseContent = fs.readFileSync(supabasePath, "utf8");
    if (fs.existsSync(testingPath)) testingContent = fs.readFileSync(testingPath, "utf8");
    if (fs.existsSync(navbarPath)) navbarContent = fs.readFileSync(navbarPath, "utf8");
    if (fs.existsSync(layoutPath)) layoutContent = fs.readFileSync(layoutPath, "utf8");
    if (fs.existsSync(relaxPath)) relaxContent = fs.readFileSync(relaxPath, "utf8");
    if (fs.existsSync(blogsPath)) blogsContent = fs.readFileSync(blogsPath, "utf8");

    // --- 2. Calculate Code Quality Score ---
    let codeQuality = 80;
    if (fs.existsSync(path.join(rootDir, "tsconfig.json"))) codeQuality += 4;
    if (fs.existsSync(path.join(rootDir, "eslint.config.mjs"))) codeQuality += 2;
    if (safetyContent) codeQuality += 2;
    if (groqContent) codeQuality += 2;
    if (supabaseContent) codeQuality += 2;
    if (scrubContent) codeQuality += 2;
    if (relaxContent) codeQuality += 2;
    if (blogsContent) codeQuality += 4; // Multi-feature expansion
    codeQuality = Math.min(100, codeQuality);

    // --- 3. Calculate Security Score ---
    let security = 80;
    if (schemaContent.toLowerCase().includes("row level security") || schemaContent.toLowerCase().includes("rls")) {
      security += 6;
    }
    if (scrubContent.includes("scrub") || scrubContent.includes("replace")) {
      security += 6;
    }
    if (safetyContent.includes("checkCrisis")) {
      security += 6;
    }
    if (navbarContent.includes("mindguard_logged_in")) {
      security += 2;
    }
    security = Math.min(100, security);

    // --- 4. Calculate Efficiency Score ---
    let efficiency = 80;
    if (supabaseContent.includes("local_db_logs") || supabaseContent.includes("JSON.stringify")) {
      efficiency += 10;
    }
    if (groqContent.includes("max_tokens")) {
      efficiency += 5;
    }
    if (relaxContent.includes("canvasRef")) {
      efficiency += 5;
    }
    efficiency = Math.min(100, efficiency);

    // --- 5. Calculate Testing Score ---
    let testing = 80;
    if (testingContent.includes("AC1") || testingContent.includes("Acceptance Criteria")) {
      testing += 5;
    }
    const passCount = (testingContent.match(/\[PASS\]/gi) || []).length;
    testing += passCount * 2.5; 
    if (testingContent.includes("Pomodoro") || testingContent.includes("Relax")) {
      testing += 3;
    }
    testing = Math.min(100, Math.round(testing));

    // --- 6. Calculate Accessibility Score ---
    let accessibility = 80;
    if (layoutContent.includes("html lang=") || layoutContent.includes("main") || layoutContent.includes("footer")) {
      accessibility += 6;
    }
    if (navbarContent.includes("aria-label") || navbarContent.includes("role=")) {
      accessibility += 6;
    }
    if (navbarContent.includes("theme") || navbarContent.includes("dark")) {
      accessibility += 4;
    }
    if (layoutContent.includes("theme") || layoutContent.includes("dark")) {
      accessibility += 3;
    }
    accessibility = Math.min(100, accessibility);

    // --- 7. Calculate Problem Statement Alignment Score ---
    let problemAlignment = 80;
    if (safetyContent.includes("Kiran") && safetyContent.includes("AASRA")) {
      problemAlignment += 8;
    }
    if (groqContent.includes("Tele-MANAS") || groqContent.includes("NIMHANS") || groqContent.includes("MoHFW")) {
      problemAlignment += 4;
    }
    if (groqContent.includes("homework") || groqContent.includes("coding")) {
      problemAlignment += 4; 
    }
    if (blogsContent.includes("Wellness Activities for Students")) {
      problemAlignment += 4; 
    }
    problemAlignment = Math.min(100, problemAlignment);

    const overall = parseFloat(
      ((codeQuality + security + efficiency + testing + accessibility + problemAlignment) / 6).toFixed(2)
    );

    const currentScores = {
      overall,
      code_quality: codeQuality,
      security,
      efficiency,
      testing,
      accessibility,
      problem_alignment: problemAlignment
    };

    // Update state.json
    const statePath = path.join(__dirname, "state.json");
    if (fs.existsSync(statePath)) {
      const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
      state.baseline_score = BASELINE;
      state.current_score = currentScores;
      fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf8");
      console.log("Evaluation completed. state.json updated with overall score:", overall);
    } else {
      console.error("state.json not found at:", statePath);
    }
  } catch (error) {
    console.error("Evaluation failed:", error);
  }
}

runEvaluation();
