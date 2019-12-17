// lakukan SEBELUM ./deploy.sh dieksekusi
cd /home/abidin
rm v1.0.zip

// lakukan SETELAH ./deploy.sh dieksekusi
cd /opt/tomcat/webapps/ottopointweb
rm v1.0.zip
rm -rf v1.0

cp /home/abidin/v1.0.zip .
unzip v1.0.zip
