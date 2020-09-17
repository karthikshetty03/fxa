#!/bin/bash -ex

DIR=$(dirname "$0")
cd "$DIR/.."

mkdir -p config

yarn lint

cd ../../
mkdir -p ~/.pm2/logs
mkdir -p artifacts/tests
yarn workspaces foreach \
    --verbose \
    --topological-dev \
    --include fxa-auth-db-mysql \
    --include fxa-auth-server \
    --include fxa-content-server \
    --include fxa-payments-server \
    --include fxa-profile-server \
    --include fxa-react \
    --include fxa-settings \
    --include fxa-shared \
    --include fxa-support-panel \
    run start
npx pm2 ls
# ensure email-service is ready
_scripts/check-url.sh localhost:8001/__heartbeat__
# ensure payments-server is ready
_scripts/check-url.sh localhost:3031/__lbheartbeat__
# ensure content-server is ready
_scripts/check-url.sh localhost:3030/bundle/app.bundle.js

cd packages/fxa-settings
mozinstall /firefox.tar.bz2
node e2e/intern.js --output="../../artifacts/tests/results.xml" --firefoxBinary=./firefox/firefox
