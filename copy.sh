mkdir -p copy/client
ls | grep -Ev "client|node_modules|copy" | xargs cp -r -t copy/
find client -maxdepth 1 -mindepth 1 | grep -Ev "node_modules" | xargs cp -r -t copy/client/
