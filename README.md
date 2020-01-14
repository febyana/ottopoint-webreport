# DOCUMENTATION
source of learning site :
angular : [angular.io/docs](https://angular.io/docs)
angular material (design) : [material.angular.io/components/categories](https://material.angular.io/components/categories)

**TABLE OF CONTENTS**
---
- [LEARN](#preperations) 
    
- [DEPLOYMENT](#deployment)
    - [Build Project](#build-project)
---
# DEPLOYMENT
## Build Project
- Di dalam *root directory project*, eksekusi *command* berikut untuk build *project* :
    ```shell
    $ ng build
    ```
    - Setelah berhasil build ***tanpa ada tulisan merah-merah atau error*** maka stuktur folder *project* menjadi seperti ini :<br>
    ***SESUDAH BUILD***
    ```shell
    ottopint-webreport (*root directory project*)
    ├── ***dist***
    ├── e2e
    ├── node_modules
    ├── src
    └── ...
    ```
    ***SEBELUM BUILD***
// lakukan SEBELUM ./deploy.sh dieksekusi
cd /home/abidin
rm v1.0.zip

// lakukan SETELAH ./deploy.sh dieksekusi
cd /opt/tomcat/webapps/ottopointweb
rm v1.0.zip
rm -rf v1.0

cp /home/abidin/v1.0.zip .
unzip v1.0.zip
