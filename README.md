# DOCUMENTATION
`*root directory* : ottopoint-webreport`<br>
source of learning site :<br>
angular : [angular.io/docs](https://angular.io/docs)<br>
angular material (design) : [material.angular.io/components/categories](https://material.angular.io/components/categories)

# TABLE OF CONTENTS
---
- [LEARN CODE](#learn-code) 
- [DEPLOYMENT](#deployment)
    - [Build *Project*](#build-project)
    - [Copy Hasil Build ke Server](#copy-hasil-build-ke-server)
    - [Auto Build dan Copy](#auto-build-dan-copy)
    - [Eksekusi *Project* di Web Server (Tomcat)](#eksekusi-project-di-web-server-tomcat)
---
# LEARN CODE 
# DEPLOYMENT
## Build Project
- Sebelum *Build Project* pastikan struktur folder seperti ini :<br>
    ***SEBELUM BUILD :***
    ```sh
    ottopint-webreport (root directory project)
    ├── e2e
    ├── node_modules
    ├── src
    └── ...
    ```
    `tidak ada folder dist, ***jika ada delete saja*** untuk memastikan proses selanjutnya berjalan baik`
    *Command* untuk delete folder dist :
    ```sh
    $ rm -rf dist
    ```
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
[:top:](#table-of-contents)
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
    ```sh
    $ zip -r <name_of_renemed_folder>.zip <name_of_renemed_folder>
    ```
    keterangan :
    >`<name_of_renemed_folder>` : nama folder hasil *build project* yg telah di-*rename*<br>
- Copy file `.zip` tersebut ke server, untuk melakukan hal ini diperlukan ***sertifikat agar dapat mengakses server***(didapat dari orang yang pernah akses server), sertifikat ini berupa file dan biasanya berekstensi `.pem`. Setelah mendapatkan sertifikat, eksekusi *command* berikut:
    ```sh
    $ scp -i <fullpath/filesertifikat.pem> -P 22 <file_project.zip> ubuntu@13.228.25.85:<path_server>
    ```
    keterangan :
    >`<fullpath/filesertifikat.pem>` : path file sertifikat di local<br>
    >`<file_project.zip>` : project yang ingin di-*copy*<br>
    >`<path_server>` : path yang ada di server sebagai tempat tampung hasil *copy*<br>
[:top:](#table-of-contents)
## Auto Build dan Copy [:top:](#deployment)
- Untuk step ***Build Project*** dan ***Copy Hasil Build ke Server*** sudah disatukan dalam file :
    - untuk dev : [deploy_dev.sh](https://andromeda.ottopay.id/ottopoint/ottopoint-webreport/blob/ottopointweb-v1.0/deploy_dev.sh)
        Sehingga untuk step ***Build Project*** dan ***Copy Hasil Build ke Server*** hanya eksekusi *command* berikut :
        ```sh
        $ ./deploy_dev.sh
        ```
    - untuk prod : [deploy_prod.sh](https://andromeda.ottopay.id/ottopoint/ottopoint-webreport/blob/ottopointweb-v1.0/deploy_prod.sh)
        Sehingga untuk step ***Build Project*** dan ***Copy Hasil Build ke Server*** hanya eksekusi *command* berikut :
        ```sh
        $ ./deploy_prod.sh
        ```
[:top:](#table-of-contents)
## Eksekusi *Project* di Web Server (Tomcat) [:top:](#deployment)
- 