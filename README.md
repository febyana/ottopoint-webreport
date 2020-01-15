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
    - [Push *Project* ke Web Server (Tomcat)](#push-project-ke-web-server-tomcat)
---
# LEARN CODE
- -
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
## Auto Build dan Copy
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
## Push *Project* ke Web Server (Tomcat)
- Untuk push *project* ke web server (tomcat), dibutuhkan login dan akses root ke server dan juga sertifikat yang telah didapat pada tahap sebelumnya.
    Login ke server :
    ```sh
    $ ssh -i ~/.ssh/LightsailDefaultKey-ap-southeast-1-new.pem ubuntu@13.228.25.85
    ```
    Setelah berhasil login ke server, selanjutnya akses root di server :
    ```sh
    $ sudo su
    ```
- ***(Optional bisa di skip)*** Masuk ke `<path_server>` *folder* dimana *file project*`.zip` disimpan, pastikan bahwa *file project*`.zip` sudah ada di server.
    ```sh
    $ cd <path_server>
    $ ls
    ```
- Karena di sini memakai ***Tomcat*** sebagai *Web Server*, maka untuk menjalankan *project* hanya dibutuhkan *copy file project*`.zip` ke *folder* `/opt/tomcat/webapps/ottopointweb`. Namun sebelum di-*copy* ke *folder* tersebut pastikan tidak ada nama *file* atau *folder* yang sama dengan nama *file project*`.zip` yang akan di-*copy*, berikut *command*-nya:
    ```sh
    $ cd /opt/tomcat/webapps/ottopointweb
    $ rm <file_project>.zip
    $ rm -rf <file_project>

    $ cp <path_server>/<file_project>.zip .
    $ unzip <file_project>.zip
    ```
    keterangan :
    >`<file_project>` : nama *file project* yang sudah di-*copy* ke *server<br>
    >`<path_server>` : path yang ada di server sebagai tempat tampung hasil *copy*<br>
- Deploy Selesai, try to hit [http://13.228.25.85:8080/ottopointweb/<file_project>](http://13.228.25.85:8080/ottopointweb/<file_project>)<br>
[:top:](#table-of-contents)
