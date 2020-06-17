

mkdir -p ~/.ssh
echo -e "${SSH_KEY}//_/\\n" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

ssh-keyscan -p 9922 -t rsa kamino.deploy.umbler.com 2>&1 >> ~/.ssh/known_hosts
