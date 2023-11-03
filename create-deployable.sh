cd ferrum-db-server
rm -rf ferrum
dotnet publish --runtime linux-x64 -c Release -o ferrum --self-contained=true
cd ..
zip -r ferrum-db-server.zip ferrum-db-server/ferrum
