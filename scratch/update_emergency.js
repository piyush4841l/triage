const fs = require('fs');
const content = fs.readFileSync('src/components/emergency/EmergencyFastTrackModal.tsx', 'utf8');

let newContent = content.replace(
  'const [abhaId, setAbhaId] = useState("");',
  'const [abhaId, setAbhaId] = useState("");\n  const [aadhaarId, setAadhaarId] = useState("");\n  const [idType, setIdType] = useState<"abha" | "aadhaar">("abha");'
);

newContent = newContent.replace(
  'import { \n  AlertOctagon',
  'import { \n  AlertOctagon, \n  Fingerprint'
);

newContent = newContent.replace(
  /const effectiveAbha = abhaId\.trim\(\) \|\| undefined;/,
  'const cleanAadhaar = aadhaarId.replace(/\\D/g, "");\n    const effectiveAbha = abhaId.trim() || (cleanAadhaar ? `AADHAAR-${cleanAadhaar}` : undefined);'
);

const abhaSectionRegex = /\{\/\*\s*2\.\s*ABHA\s*ID\s*\/\s*Aadhaar\s*\*\/\}\s*<div>[\s\S]*?<\/div>/;

const newAbhaSection = `            {/* 2. ABHA ID / Aadhaar Toggle */}
            <div className="sm:col-span-2 space-y-2 mt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>{lang === "hi" ? "पहचान पत्र (ABHA / आधार)" : "Identity Verification (ABHA / Aadhaar)"}</span>
                <span className="text-slate-500 font-normal ml-1">(Optional)</span>
              </label>

              {/* Toggle buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIdType("abha");
                    setAadhaarId("");
                  }}
                  className={\`h-10 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm \${
                    idType === "abha"
                      ? "bg-red-600 text-white shadow-red-600/30 ring-2 ring-red-400"
                      : "bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-red-500"
                  }\`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{lang === "hi" ? "आभा आईडी (ABHA ID)" : "ABHA ID"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIdType("aadhaar");
                    setAbhaId("");
                  }}
                  className={\`h-10 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm \${
                    idType === "aadhaar"
                      ? "bg-red-600 text-white shadow-red-600/30 ring-2 ring-red-400"
                      : "bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-red-500"
                  }\`}
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>{lang === "hi" ? "आधार नंबर (Aadhaar)" : "Aadhaar Number"}</span>
                </button>
              </div>

              {/* Conditional Input Box based on selected ID */}
              {idType === "abha" && (
                <div className="animate-in fade-in duration-200 mt-1">
                  <input
                    type="text"
                    value={abhaId}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\\D/g, "").slice(0, 14);
                      if (digits.length <= 2) setAbhaId(digits);
                      else if (digits.length <= 6) setAbhaId(\`\${digits.slice(0, 2)}-\${digits.slice(2)}\`);
                      else if (digits.length <= 10) setAbhaId(\`\${digits.slice(0, 2)}-\${digits.slice(2, 6)}-\${digits.slice(6)}\`);
                      else setAbhaId(\`\${digits.slice(0, 2)}-\${digits.slice(2, 6)}-\${digits.slice(6, 10)}-\${digits.slice(10, 14)}\`);
                    }}
                    maxLength={17}
                    placeholder="14-digit ABHA ID"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-red-500 focus:outline-none text-sm"
                  />
                </div>
              )}

              {idType === "aadhaar" && (
                <div className="animate-in fade-in duration-200 mt-1">
                  <input
                    type="text"
                    value={aadhaarId}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\\D/g, "").slice(0, 12);
                      setAadhaarId(digits);
                    }}
                    maxLength={12}
                    placeholder="12-digit Aadhaar Number"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-red-500 focus:outline-none text-sm"
                  />
                </div>
              )}
            </div>`;

newContent = newContent.replace(abhaSectionRegex, newAbhaSection);

// Make sure to replace exactly the div for Full Name
newContent = newContent.replace(
  '{/* 1. Full Name */}\n            <div>',
  '{/* 1. Full Name */}\n            <div className="sm:col-span-2">'
);

fs.writeFileSync('src/components/emergency/EmergencyFastTrackModal.tsx', newContent);
console.log('updated');
