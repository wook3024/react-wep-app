#social_network_service based web_app


#Technologies
사용: React-Hooks, Redux, NodeJS, Postgresql, Sequelize
예정: Redux-Saga, AWS, React-Native 
관심: Typescript, GraphQL, Apollo, Prisma, JWT


#issue
1.이미지 불러올 때 reload 되는 문제
2.sequelize 모델간의 관계성 불안정
3.보안 관련 문제점 - 1)패스워드 확인할 때 암호화 되지 않음
                  2)http통신시 지켜져야할 사용자 정보까지 보냄
4.검색엔진 최적화 관련 문제점 - 1)서버 사이드 렌더링 문제로 크롤러(bot)가 데이터를 긁어가지 못함(서버 사이드 렌더링 + 서버 스플리팅)
5.post를 불러올 때 여러번 리렌더링되는 현상이 발생
6.sequelize에서 comment를 같은 그룹으로 묶기 위해 시간값을 이용하려 했지만 알 수 없는 에러 발생 => 값을 넘겨줌으로써 임시조치
                                                   