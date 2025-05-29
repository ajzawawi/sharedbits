const path = require('path');
const fs = require('fs-extra');

function loadPlatformConfig(basePath = process.cwd(), defaults = {}) {
    const configPath = path.join(basePath, '.platform');
    const config = { ...defaults };
  
    if (!fs.existsSync(configPath)) return config;
  
    const raw = fs.readFileSync(configPath, 'utf-8');
    const lines = raw.split('\n');
  
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, value] = trimmed.split('=');
      if (key && value) config[key.trim()] = value.trim();
    }
  
    return config;
  }
  
  module.exports = {loadPlatformConfig}