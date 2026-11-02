#!/bin/sh
set -e

# Runtime injection: the SPA reads window.__APP_CONFIG__.API_URL from /config.js
API_URL="${VITE_API_URL:-https://final-tutor-app-backend.onrender.com}"

cat > /usr/share/nginx/html/config.js <<EOF
window.__APP_CONFIG__ = { API_URL: "${API_URL}" };
EOF

exec nginx -g "daemon off;"
