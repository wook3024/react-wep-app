#social_network_service based web_app


#Technologies
<br />
사용: React-Hooks, Redux, NodeJS, Postgresql, Sequelize
<br />
예정: Redux-Saga, AWS, React-Native 
<br />
관심: Typescript, GraphQL, Apollo, Prisma, JWT


#issue
1.이미지 불러올 때 reload 되는 문제 => require 사용이 어울리지 않는 건진 public 폴더에 최적화 된 건지 확인 필요 => development 모드에서 파일 크기가 커서 일어나는 문제
<br />
2.sequelize 모델간의 관계성 불안정
<br />
3.보안 관련 문제점 - 1)패스워드 확인할 때 암호화 되지 않음
                  2)http통신시 지켜져야할 사용자 정보까지 보냄
<br />
4.검색엔진 최적화 관련 문제점 - 1)서버 사이드 렌더링 문제로 크롤러(bot)가 데이터를 긁어가지 못함(서버 사이드 렌더링)
<br />
5.post를 불러올 때 여러번 리렌더링되는 현상이 발생
<br />
6.sequelize에서 comment를 같은 그룹으로 묶기 위해 시간값을 이용하려 했지만 알 수 없는 에러 발생 => 값을 넘겨줌으로써 해결
<br />
7.대댓글 부분 코드 정리 필요
<br />
8.프로필 이미지 업데이트시 reload되는 문제 발생 => 마찬가지로 development 모드에서 파일 크기가 커서 일어나는 문제
<br />
9.postman이용 시 create-react-app의 proxy설정에 유의!
<br />
10.이미지 크기가 커지면 포스트 게시 할 때 reload 일어난다. => 웹팩 설정 추가함으로써 해결(개발 모드에서만 발생하는 문제인 거 같다)devServer: {
    watchOptions: {
      ignored: [path.resolve(__dirname, "path/to/images")],
    },
  },
  <br />
11.이미지를 올릴 때 reload가 일어나지 않으면 multer에 저장된 이전 데이터가 초기화되지 않아 현재 추가한 이미지와 이전에 추가한 이미지가 같이 업로드되는 현상이 발생 => formdata 변수를 전역으로 선언해서 발생한 문제...
<br />
12.image 업데이트를 진행하면서 기존의 이미지를 삭제하려 했으나 "fs in not a function"에러가 발생. => server에서 삭제를 진행하니 정상적으로 동작. 하지만 절대경로를 이용해야 가능.
=> path.join(__dirname, path) 이용해서 해결
<br />
13.html태크에서 크기를 넘어가도 줄바꿈되지 않는 현상 => wordBreak: "break-all" 추가함으로서 해결
<br />
14.dispatch안하고 re-rendering 어떻게 할까. hashtag page에서 필요. useState 이용해서 가능할거라 생각했는데 안되네...
<br />
15.search기능으로 post찾을 시 해시태그 검색하는 방식 이용
<br />
16.env이용해서 조작 필요해보임, 
<br />
17.webpack development, production 구별하고 기능 이해 필요
<br />
18.inline style 이용하는 태그는 styled component 이용하는 방법도 좋아 보임
<br />
19.타 플랫폼에서 앱을 실행할 때 권한 문제 발생이 가능하다 => sudo npm install --unsafe-perm 해결
<br />
20.port 80 연결 시 permission denined 에러 발생 => sudo 권한 부여
<br />
21.aws에서 webpack으로 프론트서버 구동시 접근불가 현상 발생 => debServer에 host와 disableHostCheck추가함으로써 해결
<br />
22.suspend 이용해서 로딩 화면 처리 필요
<br />
23.개발과 배포단계 분리 필요
<br />
24.aws에서 이미지 업로드시 정상적으로 작동 불가
<br />
25.배포단게에서 왜 쿠기가 생성이 안되지... => expressSession의 cookie 옵션에서 domain을 추가해야함
<br />
26.chmod 400 "react-web-app-seoul .pem" 이상하게 띄어쓰기 되어있다...
<br />
27.cors의 origin 값에 도메인주소를 넣으니 작동되지 않는다. (처음엔 작동했던거 같은데)
<br />
28.aws s3 이미지 삭제를 위해 deleteobject 사용하려 했으나 작동하지 않음