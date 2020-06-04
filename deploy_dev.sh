# Build Project
rm -rf dist
ng build
# Copy Hasil Build ke Server
cd dist
mkdir dev
mv ottopoint-webreport/* dev
zip -r dev.zip dev
scp -i ~/.ssh/LightsailDefaultKey-ap-southeast-1-new.pem -P 22 dev.zip ubuntu@13.228.25.85:/home/ubuntu
