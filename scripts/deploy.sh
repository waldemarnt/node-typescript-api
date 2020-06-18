#!/usr/bin/env bash

# Init .ssh dir and expand $SSH_KEY
mkdir -p ~/.ssh
echo -e "${SSH_KEY//_/\\n}" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

# Add umbler's git to the list of known_hosts to prevent terminal for asking to confirm the host
ssh-keyscan -p 9922 -t rsa kamino.deploy.umbler.com 2>&1 >> ~/.ssh/known_hosts
