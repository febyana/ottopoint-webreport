# DOCUMENTATION
`*root directory* : ottopoint-webreport`<br>
source of learning site :<br>
angular : [angular.io/docs](https://angular.io/docs)<br>
angular material (design) : [material.angular.io/components/categories](https://material.angular.io/components/categories)

**TABLE OF CONTENTS**
---
- [LEARN CODE](#learn-code) 
- [DEPLOYMENT](#deployment)
    - [Build *Project*](#build-project)
    - [Copy Hasil Build ke Server](#copy-hasil-build-ke-server)
    - [Eksekusi *Project* di Web Server (Tomcat)](#masukan-hasil-copy-ke-web-server-tomcat)
---
# DEPLOYMENT
## Build Project
- Didalam *root directory project*, eksekusi *command* berikut untuk build *project* :
    ```sh
    $ ng build
    ```
- Setelah berhasil build ***tanpa ada tulisan merah-merah atau error*** maka stuktur folder *project* menjadi seperti ini :<br>
    ***SESUDAH BUILD :***
    ```sh
    ottopint-webreport (root directory project)
    ├── dist
    ├── e2e
    ├── node_modules
    ├── src
    └── ...
    ```
    ***SEBELUM BUILD :***
    ```sh
    ottopint-webreport (root directory project)
    ├── e2e
    ├── node_modules
    ├── src
    └── ...
    ```
## Copy Hasil Build ke Server
- Masuk ke folder `dist` :
    ```sh
    $ cd dist
    ```
- Di dalam folder `dist` ada folder `ottopoint-webreport` yang merupakan hasil build, *rename* folder tersebut menjadi `dev` atau `v1.0`(versi saat ini).<br>
    Jika ingin ***deploy ke Development***, *rename* folder `ottopoint-webreport` menjadi `dev` :
    ```sh
    $ mkdir dev
    $ mv ottopoint-webreport/* dev
    ```
    Jika ingin ***deploy ke Production***, *rename* folder `ottopoint-webreport` menjadi `v1.0`(versi saat ini) :
    ```sh
    $ mkdir v1.0
    $ mv ottopoint-webreport/* v1.0
    ```
- *Compress* folder yang telah di-*rename* tersebut menjadi file berekstensi `.zip`.<br>
    Jika ingin ***deploy ke Development***, *rename* folder `ottopoint-webreport` menjadi `dev` :
    ```sh
    $ zip -r dev.zip ottopoint-webreport
    ```
    Jika ingin ***deploy ke Production***, *rename* folder `ottopoint-webreport` menjadi `v1.0`(versi saat ini) :
    ```sh
    $ zip -r v1.0.zip ottopoint-webreport
    ```
- Copy file `.zip` tersebut ke server, untuk melakukan hal ini diperlukan ***sertifikat agar dapat mengakses server***(didapat dari yang pernah akses server), sertifikat ini berupa file dan biasanya berekstensi `.pem`. Setelah mendapatkan sertifikat, eksekusi *command* berikut:
    ```sh
    scp -i <fullpath/filesertifikat.pem> -P 22 <file_project.zip> ubuntu@13.228.25.85:<path_server>
    ```
    >`<fullpath/filesertifikat.pem>`    : path file sertifikat di local
    >`<file_project.zip>`               : project yangg ingin di-*copy*
    >`<path_server>`                    : path yang ada di server sebagai tempat tampung hasil *copy*


// lakukan SEBELUM ./deploy.sh dieksekusi
cd /home/abidin
rm ottopoint-webreport.zip

// lakukan SETELAH ./deploy.sh dieksekusi
cd /opt/tomcat/webapps/ottopointweb
rm ottopoint-webreport.zip
rm -rf ottopoint-webreport

cp /home/abidin/ottopoint-webreport.zip .
unzip ottopoint-webreport.zip
