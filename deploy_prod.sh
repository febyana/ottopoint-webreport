# Build Project
rm -rf dist
ng build
# Copy Hasil Build ke Server
cd dist
mkdir v1.0
mv ottopoint-webreport/* v1.0
zip -r v1.0.zip v1.0
scp -i ~/.ssh/LightsailDefaultKey-ap-southeast-1-new.pem -P 22 v1.0.zip ubuntu@13.228.25.85:/home/abidin
