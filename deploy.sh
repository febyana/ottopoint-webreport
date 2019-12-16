ng build --prod

cd dist

zip -r ottopointweb-v1.0.zip ottopointweb-v1.0

scp -i ~/.ssh/LightsailDefaultKey-ap-southeast-1-new.pem -P 22 ottopointweb-v1.0.zip ubuntu@13.228.25.85:/home/abidin
