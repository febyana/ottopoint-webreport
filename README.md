# DOCUMENTATION
`*root directory* : ottopoint-webreport`<br>
source of learning site :<br>
angular : [angular.io/docs](https://angular.io/docs)<br>
angular material (design) : [material.angular.io/components/categories](https://material.angular.io/components/categories)

# TABLE OF CONTENTS
---
- [LEARN CODE](#learn-code)
    - [Installation](#installation)
        - [Node](#node)
        - [NPM](#npm)
        - [Angular CLI](#angular-cli)
    - [Get Started With Angular](#get-started-with-angular)
        - [Angular CLI Usage](#angular-cli-usage)
- [DEPLOYMENT](#deployment)
    - [Build *Project*](#build-project)
    - [Copy Hasil Build ke Server](#copy-hasil-build-ke-server)
    - [Auto Build dan Copy](#auto-build-dan-copy)
    - [Push *Project* ke Web Server (Tomcat)](#push-project-ke-web-server-tomcat)
---

# LEARN CODE
## Installation
### Node
- *Install* Node dengan *command* berikut :
    ```sh
    $ brew install node
    ```
- Cek jika Node sudah ter-*install* :
    ```sh
    $ node -v
    ```

[:top:](#table-of-contents)
### NPM
- *Install* NPM dengan *command* berikut :
    ```sh
    $ brew install npm
    ```
- Cek jika NPM sudah ter-*install* :
    ```sh
    $ npm -v
    ```

[:top:](#table-of-contents)
### Angular CLI
- *Install* Angular CLI dengan *command* berikut :
    ```sh
    $ npm install @angular/cli
    ```
- Cek jika Angular CLI sudah ter-*install* :
    ```sh
    $ ng version
    ```

[:top:](#table-of-contents)
## Get Started With Angular
### Angular CLI Usage
- **Buat *project* baru** :
    ```sh
    $ ng new <nama_aplikasi>
    ```
    keterangan :
    >`<nama_aplikasi>` : nama aplikasi disini adalah **ottopoint-webreport**

    Maka akan terbuat *folder project* dengan struktur *folder* sebagai berikut :
    ```sh
    ottopoint-webreport (root directory project)
    ├── e2e
    ├── node_modules
    ├── src
    │   ├── app
    │   ├── assets
    │   ├── environments
    │   └── ...
    └── ...
    ```
    **Di Folder `/ottopoint-webreport/src/app` ini lah tempat kita berkarya :)**
- **Buat *Component* baru**, menurut penulis *Component* merupakan bagian-bagian kecil dari keseluruhan aplikasi. Misal disini aplikasi yang dibuat adalah *dashboard* untuk *ottopoint webreport* yang didalamnya terdapat bagian-bagian atau *component-component* seperti page login dan didalam page login sendiri terdapat bagian-bagian lagi seperti *form login* dan *tombol login* yang juga termasuk kedalam *component*, berikut *command* untuk generate *component* :<br>
    **note** : `Command untuk Generate Component ini hanya dapat dilakukan di dalam <root_directory_project>`
    ```sh
    $ cd <root_directory_project>
    $ ng generate component <nama_component>
    ```
    atau
    ```sh
    $ cd <root_directory_project>
    $ ng g c <nama_component>
    ```
    keterangan :
    >`<root_directory_project>` : folder awal yang namanya dihasilkan dari *generate project*<br>
    `<nama_component` : nama component

    Dengan menjalankan *command* diatas akan secara otomatis membuat folder dan file-file didalamnya. Misal nama *component*-nya adalah **login**, sehingga struktur folder yang akan terbuat akan menjadi seperti ini :
    ```sh
    src
    ├── app
    │   ├── login
    │   │   ├── login.component.css
    │   │   ├── login.component.html
    │   │   ├── login.component.spec.ts
    │   │   └── login.component.ts
    │   └── ...
    ├── assets
    ├── environments
    └── ...
    ```
    Dapat dilihat terdapat beberapa *file* didalam *folder `login`*, berikut masing-masing fungsi dari *files* tersebut :
    >`login.component.css` : file untuk menulis syntax [css](https://www.devaradise.com/id/2013/08/mengenal-apa-itu-css-dan-bagaimana-menggunakannya.html)<br>
    `login.component.html` : file untuk menulis syntax [html](http://www.pindexain.com/apa-itu-html/)<br>
    `login.component.spec.ts` : file yang digunakan angular untuk mengenal bahwa folder ini adalah sebuah **Component**<br>
    `login.component.ts` : file untuk menulis semua proses yang terjadi dibalik tampilan yang begitu indah :D, misalnya ketika kita menekan tombol login, maka yang terjadi adalah "file ini" akan mengirim input yang diketik pada *form login* (atau disebut *request*) ke-*backend* untuk melakukan pengecekan apakah input yg dilakukan benar atau salah, setelah menerima response dari backend "file ini" juga akan memberi perintah untuk menampilkan notif agar user dapat mengetahui bahwa tombol login bekerja.<br>

[:top:](#table-of-contents)
---

# DEPLOYMENT
## Build Project
- Sebelum *Build Project* pastikan struktur folder seperti ini :<br>
    **SEBELUM BUILD :**
    ```sh
    ottopoint-webreport (root directory project)
    ├── e2e
    ├── node_modules
    ├── src
    └── ...
    ```
    `jika ada folder dist delete saja, untuk memastikan proses selanjutnya berjalan baik`
    *Command* untuk delete folder dist :
    ```sh
    $ rm -rf dist
    ```
- Didalam *root directory project*, eksekusi *command* berikut untuk build *project* :
    ```sh
    $ ng build
    ```
- Setelah berhasil build **tanpa ada tulisan merah-merah atau error** maka stuktur folder *project* menjadi seperti ini :<br>
    **SESUDAH BUILD :**
    ```sh
    ottopoint-webreport (root directory project)
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
    Jika ingin **deploy ke Development**, *rename* folder `ottopoint-webreport` menjadi `dev` :
    ```sh
    $ mkdir dev
    $ mv ottopoint-webreport/* dev
    ```
    Jika ingin **deploy ke Production**, *rename* folder `ottopoint-webreport` menjadi `v1.0`(versi saat ini) :
    ```sh
    $ mkdir v1.0
    $ mv ottopoint-webreport/* v1.0
    ```
- *Compress* folder yang telah di-*rename* tersebut menjadi file berekstensi `.zip` :
    ```sh
    $ zip -r <name_of_renemed_folder>.zip <name_of_renemed_folder>
    ```
    keterangan :
    >`<name_of_renemed_folder>` : nama folder hasil *build project* yg telah di-*rename*

- Copy file `.zip` tersebut ke server, untuk melakukan hal ini diperlukan **sertifikat agar dapat mengakses server**(didapat dari orang yang pernah akses server), sertifikat ini berupa file dan biasanya berekstensi `.pem`. Setelah mendapatkan sertifikat, eksekusi *command* berikut:
    ```sh
    $ scp -i <fullpath/filesertifikat.pem> -P 22 <file_project.zip> ubuntu@13.228.25.85:<path_server>
    ```
    keterangan :
    >`<fullpath/filesertifikat.pem>` : path file sertifikat di local<br>
    `<file_project.zip>` : project yang ingin di-*copy*<br>
    `<path_server>` : path yang ada di server sebagai tempat tampung hasil *copy*

[:top:](#table-of-contents)
## Auto Build dan Copy
- Untuk step **Build Project** dan **Copy Hasil Build ke Server** sudah disatukan dalam file :
    - untuk dev : [deploy_dev.sh](https://andromeda.ottopay.id/ottopoint/ottopoint-webreport/blob/ottopointweb-v1.0/deploy_dev.sh)
        Sehingga untuk step **Build Project** dan **Copy Hasil Build ke Server** hanya eksekusi *command* berikut :
        ```sh
        $ ./deploy_dev.sh
        ```
    - untuk prod : [deploy_prod.sh](https://andromeda.ottopay.id/ottopoint/ottopoint-webreport/blob/ottopointweb-v1.0/deploy_prod.sh)
        Sehingga untuk step **Build Project** dan **Copy Hasil Build ke Server** hanya eksekusi *command* berikut :
        ```sh
        $ ./deploy_prod.sh
        ```

[:top:](#table-of-contents)
## Push *Project* ke Web Server (Tomcat)
- Untuk push *project* ke web server (tomcat), dibutuhkan login dan akses root ke server dan juga sertifikat yang telah didapat pada tahap sebelumnya.<br>
    Login ke server :
    ```sh
    $ ssh -i <full_path_sertifikat>/<file_sertifikat> ubuntu@13.228.25.85
    ```
    keterangan :
    >`<full_path_sertifikat>` : path local dimana file sertifikat tersimpan, biasanya ada di `~/.ssh/`<br>
    `<file_sertifikat>` : file sertifikat, biasanya berekstensi `.pem`

    Setelah berhasil login ke server, selanjutnya akses root di server :
    ```sh
    $ sudo su
    ```
- **(Optional bisa di skip)** Masuk ke `<path_server>` *folder* dimana *file project*`.zip` disimpan, pastikan bahwa *file project*`.zip` sudah ada di server.
    ```sh
    $ cd <path_server>
    $ ls
    ```
    keterangan :
    >`<path_server>` : path yang ada di server sebagai tempat tampung hasil *copy*

- Karena di sini memakai **Tomcat** sebagai *Web Server*, maka untuk menjalankan *project* hanya dibutuhkan *copy file project*`.zip` ke *folder* `/opt/tomcat/webapps/ottopointweb` lalu di unzip. **Namun sebelum di-*copy*, pastikan didalam folder tersebut tidak ada nama *file* atau *folder* yang sama dengan nama *file project*`.zip` yang akan di-*copy*** , berikut *command*-nya:
    ```sh
    $ cd /opt/tomcat/webapps/ottopointweb
    $ rm <file_project>.zip
    $ rm -rf <file_project>

    $ cp <path_server>/<file_project>.zip .
    $ unzip <file_project>.zip
    ```
    keterangan :
    >`<file_project>` : nama *file project* yang sudah di-*copy* ke *server*<br>
    `<path_server>` : path yang ada di server sebagai tempat tampung hasil *copy*

- Deploy Selesai, try to hit [http://13.228.25.85:8080/ottopointweb/<file_project>](http://13.228.25.85:8080/ottopointweb/<file_project>)

[:top:](#table-of-contents)
