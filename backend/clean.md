1. 의존성은 바깥 → 안쪽으로만 향한다
   (Dependency Rule)

2. Domain은 어떤 프레임워크/기술 구현도 몰라야 한다 (제일 안쪽, 순수해야함)

3. Application은 비즈니스 흐름만 담당하고 구현 기술을 몰라야 한다 (인프라쪽 변경을 용이하게 하기 위함)

4. Infrastructure는 안쪽 계층의 계약(Port)을 구현한다

5. Presentation은 요청/응답 변환과 진입점 역할만 담당한다

6. 안쪽 계층은 바깥 계층 타입/구현에 의존하면 안 된다

7. 구현이 아니라 추상(Interface/Port)에 의존한다
   (Dependency Inversion)

8. 객체 조립(구현체 연결)은 Composition Root(Module)에서 한다

9. 외부 기술(DB/JWT/ORM/Framework)은 교체 가능해야 한다

10. 비즈니스 규칙은 기술 변화에 영향받지 않아야 한다
