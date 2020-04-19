#social_network_service based web_app


#Technologies
사용: React-Hooks, Redux, NodeJS, Postgresql, Sequelize
예정: Redux-Saga, AWS, React-Native 
관심: Typescript, GraphQL, Apollo, Prisma, JWT


#issue
1.이미지 불러올 때 reload 되는 문제 => require 사용이 어울리지 않는 건진 public 폴더에 최적화 된 건지 확인 필요
2.sequelize 모델간의 관계성 불안정
3.보안 관련 문제점 - 1)패스워드 확인할 때 암호화 되지 않음
                  2)http통신시 지켜져야할 사용자 정보까지 보냄
4.검색엔진 최적화 관련 문제점 - 1)서버 사이드 렌더링 문제로 크롤러(bot)가 데이터를 긁어가지 못함(서버 사이드 렌더링 + 서버 스플리팅)
5.post를 불러올 때 여러번 리렌더링되는 현상이 발생
6.sequelize에서 comment를 같은 그룹으로 묶기 위해 시간값을 이용하려 했지만 알 수 없는 에러 발생 => 값을 넘겨줌으로써 해결
7.대댓글 부분 코드 정리 필요                  
8.프로필 이미지 업데이트시 reload되는 문제 발생                          
9.postman이용 시 create-react-app의 proxy설정에 유의!
10.이미지 크기가 커지면 포스트 게시 할 때 reload 일어난다. => 웹팩 설정 추가함으로써 해결(개발 모드에서만 발생하는 문제인 거 같다)devServer: {
    watchOptions: {
      ignored: [path.resolve(__dirname, "path/to/images")],
    },
  }, 
11.이미지를 올릴 때 reload가 일어나지 않으면 multer에 저장된 이전 데이터가 초기화되지 않아 현재 추가한 이미지와 이전에 추가한 이미지가 같이 업로드되는 현상이 발생 => formdata 변수를 전역으로 선언해서 발생한 문제...
12.image 업데이트를 진행하면서 기존의 이미지를 삭제하려 했으나 "fs in not a function"에러가 발생. => server에서 삭제를 진행하니 정상적으로 동작. 하지만 절대경로를 이용해야 가능.
=> path.join(__dirname, path) 이용해서 해결
13.html태크에서 크기를 넘어가도 줄바꿈되지 않는 현상 => wordBreak: "break-all" 추가함으로서 해결
14.dispatch안하고 re-rendering 어떻게 할까. hashtag page에서 필요. useState 이용해서 가능할거라 생각했는데 안되네...
15.search기능으로 post찾을 시 해시태그 검색하는 방식 이용

