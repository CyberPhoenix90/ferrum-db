cd ferrum-db-server
rm -rf ferrum
dotnet publish --runtime linux-x64 -c Release -o ferrum --self-contained=true
zip -r ferrum-db-server.zip ferrum
cd ..
mv ferrum-db-server/ferrum-db-server.zip .