# 프로젝트 구현 사항

## 프로젝트 환경설정

- `Next.js`, `TypeScript` 사용
- github issues를 사용하여 이슈 관리
- 전역상태 관리 도구로 `recoil` 사용
- 라이브러리 사용 여부 언급이 없어서 `Next.js`에서 지원하지 않는 전역상태 도구만 추가적으로 사용하고, 스타일링이나 서버 상태 관리 라이브러리는 따로 사용하지 않고 구현했습니다.

## [리스트] 특정 키워드에 대해 검색된 서적 정보를 보여준다.

[🐱 이슈 바로가기↗︎](https://github.com/sparrowscout/trevari_assign/issues/1)

- 무한스크롤 :

  - `keywordArr`, `pageNumber`, `operator` 를 담은 지역 상태와 스크롤 바를 활용하여 구현
  - 스크롤 바가 리스트 컴포넌트의 div element 끝까지 스크롤되었다면, `pageNumber++`
  - `useEffect`를 사용해 상태 변화 감지해서 `fetch`

- 특정 키워드 입력받기
  - `opertaor` 종류를 `enum`을 활용해서 고정
  - 사용자가 버튼을 클릭했을 때 사용자가 입력한 검색어를 `operator`로 `split`한 배열로 변환
  - API 호출 결과는 검색어 배열의 0번 인덱스와 1번 인덱스, 총 2개의 검색어만 반영됨

## [상세] 서적 리스트 중 선택된 서적의 상세 정보를 보여준다.

[🐱 이슈 바로가기↗︎](https://github.com/sparrowscout/trevari_assign/issues/2)

- 서적 리스트 중 특정 서적의 표지 이미지, 혹은 타이틀을 선택하면 상세 화면에 해당 서적의 데이터 노출하는 로직으로 구현 완료
  - 전역상태관리 라이브러리 `recoil` 을 사용하여 `isbn13` 데이터를 전역으로 관리

<br/>

# 프로젝트 실행

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
