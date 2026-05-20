# Auth Architecture Refactoring

## 목적

`auth` 모듈은 초기에는 기능 구현 중심으로 빠르게 작성되어 있었고, 인증 관련 흐름이 한 서비스에 몰려 있었습니다. 회원가입, 로그인, 아이디 중복 확인 정도의 기능 수는 적었지만, HTTP 진입점, 유스케이스 실행 흐름, 도메인 모델, TypeORM/JWT/bcrypt 같은 기술 구현이 명확히 분리되어 있지 않았습니다.

이번 리팩터링의 목적은 단순한 폴더 정리가 아니라, `auth` 모듈 안에서 각 계층의 책임을 분리하는 것이었습니다. 기준은 다음 네 계층입니다.

- `presentation`: HTTP 요청/응답, 인증 진입점, 예외의 HTTP 변환
- `application`: 유스케이스 실행 흐름, 외부 기능에 대한 포트 의존
- `domain`: 핵심 모델과 비즈니스 의미를 가진 타입
- `infrastructure`: DB, JWT, bcrypt, ORM 등 기술 구현

이 구조를 택한 이유는 `auth`가 앞으로 가장 먼저 확장될 가능성이 높은 도메인이기 때문입니다. 인증 로직은 보통 사용자 정보, 토큰, 비밀번호 정책, 소셜 로그인, 권한 처리 등으로 빠르게 커집니다. 처음부터 계층 경계를 분리해 두면 이후 기능 확장 시 수정 범위를 줄일 수 있습니다.

## Before

리팩터링 전 구조는 아래에 가까웠습니다.

- `api/auth.controller.ts`
- `application/auth.service.ts`
- `application/jwt.strategy.ts`
- `application/auth.guard.ts`
- `application/dto/*`
- `domain/user.entity.ts`
- `domain/user.repository.ts`
- `infrastructure/user.repository.persistence.ts`

이 구조의 문제는 역할 이름은 나뉘어 있어도, 실제 책임은 여러 계층에 걸쳐 섞여 있었다는 점입니다.

### 1. `api` 폴더명이 실제 역할을 충분히 설명하지 못함

기존 `api`는 단순 API 호출 계층처럼 보이지만, 실제로는 Nest Controller가 위치한 HTTP 진입점이었습니다. 이 계층은 API 자체가 아니라 `presentation`으로 보는 편이 더 정확합니다.

### 2. `AuthService`에 실행 흐름이 집중됨

회원가입, 로그인, 아이디 중복확인 로직이 모두 하나의 `AuthService`에 들어 있었습니다. 기능이 적을 때는 단순하지만, 이후 인증 기능이 늘어나면 서비스 하나가 모든 흐름을 책임지게 됩니다.

### 3. 도메인 모델과 ORM 모델이 동일함

기존 `User`는 TypeORM 데코레이터가 붙은 엔티티였습니다. 즉, 도메인 모델이면서 동시에 DB 저장 모델이었습니다. 이 구조에서는 도메인이 TypeORM에 종속됩니다.

### 4. HTTP 관심사가 안쪽 계층에 섞임

리팩터링 이전에도 인증 로직은 Nest 중심으로 작성되어 있었고, 구조를 분리하더라도 그대로 두면 유스케이스가 HTTP 성격의 예외나 표현을 직접 알게 됩니다. 이렇게 되면 유스케이스 재사용성과 테스트 독립성이 떨어집니다.

### 5. 외부 기능이 계약보다 구현 중심으로 보임

비밀번호 해싱, 토큰 발급, DB 저장은 모두 외부 기술 의존입니다. 하지만 처음 구조에서는 이런 기능이 유스케이스의 협력 대상이라기보다 구현 세부사항처럼 묶여 있었습니다.

## After

현재 `auth` 구조는 아래와 같습니다.

```text
src/auth
├── presentation
│   ├── filters
│   ├── guards
│   └── http
│       ├── dto
│       └── auth.controller.ts
├── application
│   ├── errors
│   ├── ports
│   └── use-cases
├── domain
│   ├── entities
│   └── repositories
├── infrastructure
│   ├── persistence/typeorm
│   └── security
└── auth.module.ts
```

이 구조는 폴더를 나눈 것보다, 의존 방향을 정리한 것이 핵심입니다.

- `presentation`은 `application`을 호출한다.
- `application`은 `domain`과 `port`만 안다.
- `infrastructure`는 `application`/`domain`의 계약을 구현한다.
- `domain`은 가장 안쪽에서 순수 모델을 유지한다.

## 계층별 설계 의도

### Presentation

`presentation`은 HTTP와 가장 가까운 계층입니다.

- `AuthController`
- request/response DTO
- `AuthGuard`
- `AuthExceptionFilter`

이 계층의 책임은 요청을 받아 유스케이스에 전달하고, 결과를 HTTP 응답으로 바꾸는 것입니다. 즉, 웹 프레임워크에 가장 가까운 코드는 여기서 끝내는 것이 목표입니다.

`api` 대신 `presentation`으로 이름을 바꾼 이유도 여기에 있습니다. 이 폴더는 단순 “API 코드”가 아니라, 외부 요청이 시스템에 들어오는 진입 계층이기 때문입니다.

### Application

`application`은 사용자의 요청을 도메인 행위와 외부 포트 호출로 조합해 유스케이스 흐름을 정의하는 계층입니다.

- `SignUpUseCase`
- `SignInUseCase`
- `CheckUsernameUseCase`
- `PasswordHasherPort`
- `AccessTokenIssuerPort`
- application-level errors

이 계층은 “무엇을 해야 하는가”를 정의합니다.

예를 들어 로그인 유스케이스는:

1. 사용자를 조회하고
2. 비밀번호를 비교하고
3. 토큰을 발급받고
4. 결과를 반환합니다.

중요한 점은 이 계층이 DB, JWT, bcrypt의 구현체를 직접 모르도록 만든 것입니다. 대신 포트를 통해 “이 기능이 필요하다”는 계약만 선언합니다.

이렇게 하면 유스케이스는 구현보다 흐름 중심으로 읽히게 됩니다. 즉 구현체 부분이 변경되더라고 유스케이스의 수정은 필요 없어지게 됩니다.

### Domain

`domain`은 가장 안쪽 계층입니다.

- 순수 `User` 모델
- `UserRepository` 계약

기존에는 `User`가 TypeORM 엔티티였기 때문에, 도메인 모델이 저장 기술에 묶여 있었습니다. 리팩터링 후에는 도메인 모델을 ORM 엔티티와 분리했습니다.

이 분리는 단순 형식이 아니라 의미가 있습니다.

- 도메인은 “사용자란 무엇인가”를 표현
- ORM 엔티티는 “사용자를 DB에 어떻게 저장하는가”를 표현

즉 같은 사용자라도 관심사가 다르기 때문에 분리합니다.

### Infrastructure

`infrastructure`는 바깥 구현 계층입니다.

- `TypeormUserRepository`
- `UserOrmEntity`
- `UserMapper`
- `BcryptPasswordHasher`
- `JwtTokenIssuer`
- `JwtStrategy`

이 계층의 역할은 `application`이 정의한 포트와 `domain`의 모델을 실제 기술로 연결하는 것입니다.

예를 들어:

- `UserRepository` 포트는 `TypeormUserRepository`가 구현
- `PasswordHasherPort`는 `BcryptPasswordHasher`가 구현
- `AccessTokenIssuerPort`는 `JwtTokenIssuer`가 구현

이 구조를 택한 이유는 구현 교체 가능성을 확보하기 위해서입니다. 지금은 TypeORM, bcrypt, JWT를 쓰지만 나중에 바뀌더라도 유스케이스는 그대로 유지할 수 있습니다.

## 포트를 둔 이유

이번 리팩터링에서 중요한 포인트 중 하나는 `port`를 명시적으로 도입한 것입니다.

포트는 안쪽 계층이 바깥 계층에 요구하는 기능 계약입니다. (구현 방식은 몰라도 필요한 기능만 정의)

예를 들어 로그인 유스케이스는 다음이 필요합니다.

- 사용자 조회
- 비밀번호 비교
- 액세스 토큰 발급

하지만 유스케이스가 다음 구현을 직접 알 필요는 없습니다.

- TypeORM으로 조회하는지
- bcrypt로 비교하는지
- JWT로 발급하는지

그래서 유스케이스는 포트만 알고, 실제 구현은 `infrastructure`가 담당합니다.

이 방식의 장점은 다음과 같습니다.

- 유스케이스가 기술 세부사항에 덜 종속됨
- 테스트 시 가짜 구현체로 대체 가능
- 구현 교체 시 변경 범위 축소
- 의존 방향이 안쪽에서 바깥쪽으로 새지 않음

## 에러를 분리한 이유

기존 구조에서는 유스케이스가 HTTP 예외를 직접 던질 가능성이 컸습니다. 리팩터링 후에는 `application/errors`에 의미 중심 에러를 두고, `presentation`에서 이를 HTTP 응답으로 변환하도록 정리했습니다.

예:

- `UserAlreadyExistsError`
- `InvalidCredentialsError`

이렇게 분리한 이유는 에러의 의미를 계층에 맞게 유지하기 위해서입니다.

- `application`은 “무슨 문제가 발생했는가”를 표현
- `presentation`은 “그 문제를 HTTP로 어떻게 보여줄 것인가”를 표현

즉, `application`은 `409 Conflict`를 알 필요가 없고, `presentation`이 이를 책임집니다.

## DTO를 분리한 이유

DTO도 같은 원칙으로 나눴습니다.

- `presentation/http/dto/*`
  - HTTP 요청/응답 형태
  - `class-validator` 사용
- `application`
  - 유스케이스 입력/출력 모델
  - HTTP를 모르는 command/result 성격

겉으로 보면 중복처럼 보일 수 있지만, 역할이 다릅니다.

- HTTP 요청 DTO는 클라이언트와의 계약
- 유스케이스 입력 모델은 애플리케이션 실행 계약

이 둘을 분리해 두면 나중에 입력 방식이 바뀌더라도 유스케이스를 덜 흔들 수 있습니다.

## 실제로 좋아진 점

이번 리팩터링으로 얻은 실질적인 이점은 다음과 같습니다.

### 1. 요청 흐름을 따라 코드 읽는 순서가 명확해짐

`auth` 기능은 요청 흐름 기준으로 다음 순서로 읽으면 됩니다.

1. `auth.module.ts`
2. `presentation/http/auth.controller.ts`
3. `application/use-cases/*`
4. `domain/*`
5. `infrastructure/*`

여기서 주의할 점은 `infrastructure`가 안쪽 계층이라는 뜻은 아닙니다.  
Clean Architecture 기준으로 `infrastructure`는 `presentation`과 함께 가장 바깥쪽 계층입니다.

다만 실제 코드를 이해할 때는 유스케이스가 어떤 포트를 요구하는지 먼저 보고, 마지막에 그 포트를 어떤 infrastructure 구현체가 채우는지 확인하면 흐름이 잘 읽힙니다.

### 2. 책임 분리가 더 명확해짐

이제 다음 질문에 대한 답이 파일 구조만 봐도 드러납니다.

- HTTP 요청은 누가 받는가
- 실행 흐름은 누가 담당하는가
- 사용자 모델은 어디에 있는가
- DB/JWT/bcrypt는 어디에서 구현되는가

### 3. 이후 확장에 유리해짐

다음과 같은 기능이 추가될 때 구조적으로 대응하기 쉬워졌습니다.

- refresh token
- 소셜 로그인
- 비밀번호 정책 강화
- 사용자 잠금 처리
- 인증 이벤트 발행

기존 구조에서는 `AuthService`가 계속 비대해졌을 가능성이 높지만, 현재 구조에서는 유스케이스 단위로 확장할 수 있습니다.

## 아직 남아 있는 선택지

현재 구조는 실용성과 구조 정리를 균형 있게 맞춘 상태입니다. 다만 더 엄격한 클린 아키텍처를 원한다면 다음 선택지도 있습니다.

- `application`에서 Nest DI 데코레이터까지 제거
- `domain/errors` 추가
- `checkUsername` 결과를 완전히 의미 중심 값으로 유지
- `auth` 기준 integration/e2e 테스트 재작성

다만 현재 프로젝트 규모에서는 이 정도 구조 분리만으로도 충분히 큰 개선이 있었고, 지나친 보일러플레이트를 늘리지 않는 것이 더 실용적입니다.

## 결론

이번 `auth` 리팩터링의 핵심은 “폴더명을 바꿨다”가 아닙니다. 핵심은 다음입니다.

- HTTP 진입점은 `presentation`
- 실행 흐름은 `application`
- 핵심 모델은 `domain`
- 기술 구현은 `infrastructure`

이 기준을 명확히 나눔으로써 `auth` 모듈이 앞으로 커져도 구조가 무너지지 않도록 기반을 만든 것이 이번 리팩터링의 가장 큰 목적이었습니다.
