#!/usr/bin/env bash

# NotifyX Build Verification Script
# This script verifies the build output and package configuration

set -e

echo "🔍 NotifyX Build Verification"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if dist exists
if [ ! -d "dist" ]; then
  echo -e "${RED}❌ dist/ directory not found. Run 'bun run build:all' first${NC}"
  exit 1
fi

echo "📦 Checking build outputs..."
echo ""

# Check required files
REQUIRED_FILES=("dist/notifyx.es.js" "dist/notifyx.min.js" "dist/notifyx.min.css" "dist/index.d.ts")

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    size=$(du -h "$file" | cut -f1)
    echo -e "${GREEN}✓${NC} $file ($size)"
  else
    echo -e "${RED}✗${NC} $file (missing)"
    exit 1
  fi
done

echo ""
echo "📊 Bundle sizes:"
echo ""

# Show bundle sizes
if command -v gzip &> /dev/null; then
  es_size=$(stat -f%z dist/notifyx.es.js 2>/dev/null || stat -c%s dist/notifyx.es.js 2>/dev/null)
  umd_size=$(stat -f%z dist/notifyx.min.js 2>/dev/null || stat -c%s dist/notifyx.min.js 2>/dev/null)
  css_size=$(stat -f%z dist/notifyx.min.css 2>/dev/null || stat -c%s dist/notifyx.min.css 2>/dev/null)
  
  es_gzip=$(gzip -c dist/notifyx.es.js | wc -c | tr -d ' ')
  umd_gzip=$(gzip -c dist/notifyx.min.js | wc -c | tr -d ' ')
  css_gzip=$(gzip -c dist/notifyx.min.css | wc -c | tr -d ' ')
  
  printf "  ESM:  %'d bytes (raw) | %'d bytes (gzip)\n" "$es_size" "$es_gzip"
  printf "  UMD:  %'d bytes (raw) | %'d bytes (gzip)\n" "$umd_size" "$umd_gzip"
  printf "  CSS:  %'d bytes (raw) | %'d bytes (gzip)\n" "$css_size" "$css_gzip"
  
  # Size check
  if [ "$umd_gzip" -gt 2048 ]; then
    echo -e "\n${YELLOW}⚠️  UMD gzipped size is above 2KB target${NC}"
  fi
else
  ls -lh dist/*.js dist/*.css
fi

echo ""
echo "🔍 Checking package.json configuration..."
echo ""

# Check package.json fields
if command -v jq &> /dev/null; then
  main=$(jq -r '.main' package.json)
  module=$(jq -r '.module' package.json)
  types=$(jq -r '.types' package.json)
  sideEffects=$(jq -r '.sideEffects' package.json)
  
  [ "$main" == "dist/notifyx.min.js" ] && echo -e "${GREEN}✓${NC} main: $main" || echo -e "${RED}✗${NC} main: $main"
  [ "$module" == "dist/notifyx.es.js" ] && echo -e "${GREEN}✓${NC} module: $module" || echo -e "${RED}✗${NC} module: $module"
  [ "$types" == "./dist/index.d.ts" ] && echo -e "${GREEN}✓${NC} types: $types" || echo -e "${RED}✗${NC} types: $types"
  [ "$sideEffects" == "false" ] && echo -e "${GREEN}✓${NC} sideEffects: $sideEffects" || echo -e "${RED}✗${NC} sideEffects: $sideEffects"
else
  echo "Install 'jq' for detailed package.json validation"
fi

echo ""
echo "🧪 Checking TypeScript declarations..."
echo ""

# Check if types are exported
if grep -q "export.*ToastOptions" dist/index.d.ts; then
  echo -e "${GREEN}✓${NC} ToastOptions exported"
else
  echo -e "${RED}✗${NC} ToastOptions not found"
fi

if grep -q "export.*ToastType" dist/index.d.ts; then
  echo -e "${GREEN}✓${NC} ToastType exported"
else
  echo -e "${RED}✗${NC} ToastType not found"
fi

if grep -q "export.*Position" dist/index.d.ts; then
  echo -e "${GREEN}✓${NC} Position exported"
else
  echo -e "${RED}✗${NC} Position not found"
fi

if grep -q "declare class NotifyX" dist/index.d.ts; then
  echo -e "${GREEN}✓${NC} NotifyX class declared"
else
  echo -e "${RED}✗${NC} NotifyX class not found"
fi

echo ""
echo "📝 Checking for license headers..."
echo ""

if grep -q "@license" dist/notifyx.min.js; then
  echo -e "${GREEN}✓${NC} License header preserved in UMD build"
else
  echo -e "${YELLOW}⚠️${NC}  No license header in UMD build"
fi

echo ""
echo "✅ Build verification complete!"
echo ""
echo "💡 Tips:"
echo "  - Keep UMD gzipped size under 2KB"
echo "  - Run 'bun run build:all' before publishing"
echo "  - Check bundle size after each feature addition"
echo ""
