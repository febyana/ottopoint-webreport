ng build --prod

cd dist

zip -r ottopoint-dashboard.zip ottopoint-dashboard

scp -i ~/.ssh/LightsailDefaultKey-ap-southeast-1-new.pem -P 22 ottopoint-dashboard.zip ubuntu@13.228.25.85:/home/abidin
