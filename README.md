# Social-network-service based web-app

<br />
<br />

# Description
* 소셜네트워크서비스 기능 제공을 위해 제작 
* 프론트엔드 부분은 React와 Redux를 이용했고, 백엔드 부분은 Express를 사용
* 트래픽의 총량을 줄이기 위해 싱글 페이지 애플리케이션으로 구현
* 포스팅 작성, 대댓글, 팔로우, 좋아요, 알림과 같은 기능을 포함 

<br />
<br />
<br />

# Technologies
* 사용: React-Hooks, Redux, NodeJS, Postgresql, Sequelize, AWS
* 예정: Redux-Saga, React-Native 
* 관심: Typescript, GraphQL, Apollo, Prisma, JWT

<br />
<br />

# Guidlines

### Install

#### 1. Clone git code
$ git clone https://github.com/wook3024/react-web-app.git

#### 2. Move react-web-app folder
$ cd react-web-app

#### 3. Install package
1. postgres install in ubuntu-18-04 - https://linuxize.com/post/how-to-install-postgresql-on-ubuntu-18-04/
 (Requires create database and change confige of sequelize)
2. npm install (use sudo npm install --unsafe-perm when a privilege error occurs)
3. npm install -g pm2 or nodemon (choose one)


### Start application
1. npm start (use sudo npm start when a permission denined error occurs)
2. pm2 start src/server/server.js or nodemon src/server/server.js

<br />
<br />

# Issue
* 이미지 불러올 때 reload 되는 문제 => require 사용이 어울리지 않는 건진 public 폴더에 최적화 된 건지 확인 필요 => development 모드에서 파일 크기가 커서 일어나는 문제
* sequelize 모델간의 관계성 불안정
* 보안 관련 문제점 - 1)패스워드 확인할 때 암호화 되지 않음
                  2)http통신시 지켜져야할 사용자 정보까지 보냄
* 검색엔진 최적화 관련 문제점 - 1)서버 사이드 렌더링 문제로 크롤러(bot)가 데이터를 긁어가지 못함(서버 사이드 렌더링)
* post를 불러올 때 여러번 리렌더링되는 현상이 발생
* sequelize에서 comment를 같은 그룹으로 묶기 위해 시간값을 이용하려 했지만 알 수 없는 에러 발생 => 값을 넘겨줌으로써 해결
* 대댓글 부분 코드 정리 필요
* 프로필 이미지 업데이트시 reload되는 문제 발생 => 마찬가지로 development 모드에서 파일 크기가 커서 일어나는 문제
* postman이용 시 create-react-app의 proxy설정에 유의!
* 이미지 크기가 커지면 포스트 게시 할 때 reload 일어난다. => 웹팩 설정 추가함으로써 해결(개발 모드에서만 발생하는 문제인 거 같다)devServer: {
    watchOptions: {
      ignored: [path.resolve(__dirname, "path/to/images")],
    },
  },
* 이미지를 올릴 때 reload가 일어나지 않으면 multer에 저장된 이전 데이터가 초기화되지 않아 현재 추가한 이미지와 이전에 추가한 이미지가 같이 업로드되는 현상이 발생 => formdata 변수를 전역으로 선언해서 발생한 문제...
* image 업데이트를 진행하면서 기존의 이미지를 삭제하려 했으나 "fs in not a function"에러가 발생. => server에서 삭제를 진행하니 정상적으로 동작. 하지만 절대경로를 이용해야 가능.
=> path.join(__dirname, path) 이용해서 해결
* html태크에서 크기를 넘어가도 줄바꿈되지 않는 현상 => wordBreak: "break-all" 추가함으로서 해결
* dispatch안하고 re-rendering 어떻게 할까. hashtag page에서 필요. useState 이용해서 가능할거라 생각했는데 안되네...
* search기능으로 post찾을 시 해시태그 검색하는 방식 이용
* env이용해서 조작 필요해보임, 
* webpack development, production 구별하고 기능 이해 필요
* inline style 이용하는 태그는 styled component 이용하는 방법도 좋아 보임
* 타 플랫폼에서 앱을 실행할 때 권한 문제 발생이 가능하다 => sudo npm install --unsafe-perm 해결
* port 80 연결 시 permission denined 에러 발생 => sudo 권한 부여
* aws에서 webpack으로 프론트서버 구동시 접근불가 현상 발생 => debServer에 host와 disableHostCheck추가함으로써 해결
* suspend 이용해서 로딩 화면 처리 필요
* 개발과 배포단계 분리 필요
* aws에서 이미지 업로드시 정상적으로 작동 불가
* 배포단게에서 왜 쿠기가 생성이 안되지... => expressSession의 cookie 옵션에서 domain을 추가해야함
* chmod 400 "react-web-app-seoul .pem" 이상하게 띄어쓰기 되어있다...
* cors의 origin 값에 도메인주소를 넣으니 작동되지 않는다. (처음엔 작동했던거 같은데)
* aws s3 이미지 삭제를 위해 deleteobject 사용하려 했으나 작동하지 않음 => https 폴더 타고 들어가면 삭제마커 표시된 이미지가 생성됨 (어떻게 이용하는거지?)
* aws s3에서 cors구성했는데도 한번씩 access 에러 발생
* https 연결을 위해 포트 443을 이용했는데 에러 발생 => 80번 포트로 연결해 http로 연결되면 자동으로 리다이렉션 되면서 https사용 가능한거 같아...



<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
----------------------------------------------------------------
<br />
Install PostgreSQL on Ubuntu
01. Installing PostgreSQL
Refresh the local package index and install the PostgreSQL server along with the PostgreSQL contrib package which provides several additional features for the PostgreSQL database:
$ sudo apt update
$ sudo apt install postgresql postgresql-contrib

02. Verifying PostgreSQL Installation
Once the installation is completed, the PostgreSQL service will start automatically.
To verify the installation we will try to connect to the PostgreSQL database server using the psql and print the server version:
$ sudo -u postgres psql -c "SELECT version();"


PostgreSQL Roles and Authentication Methods
To log in to the PostgreSQL server as the postgres user first you need to switch to the user postgres and then you can access a PostgreSQL prompt using the psql utility:
$ sudo su - postgres


Creating PostgreSQL Role and Database
01. Create a new PostgreSQL Role
The following command will create a new role named john:
$ sudo su - postgres -c "createuser john"
02. Create a new PostgreSQL Database
Create a new database named johndb using the createdb command:
$ sudo su - postgres -c "createdb johndb"
03. Grant privileges
To grant permissions to the john user on the database we created in the previous step, connect to the PostgreSQL shell:
$ sudo -u postgres psql
and run the following query:
$ grant all privileges on database johndb to john;
