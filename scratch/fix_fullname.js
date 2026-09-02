const fs = require('fs');
let content = fs.readFileSync('src/components/emergency/EmergencyFastTrackModal.tsx', 'utf8');
content = content.replace(/\{\/\*\s*1\.\s*Full Name\s*\*\/\}\s*<div>/, '{/* 1. Full Name */}\n            <div className="sm:col-span-2">');
fs.writeFileSync('src/components/emergency/EmergencyFastTrackModal.tsx', content);
console.log('updated');
