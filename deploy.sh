ng build --prod

cd dist

zip -r ottopoint-webreport.zip ottopoint-webreport

scp -i ~/.ssh/LightsailDefaultKey-ap-southeast-1-new.pem -P 22 ottopoint-webreport.zip ubuntu@13.228.25.85:/home/abidin
