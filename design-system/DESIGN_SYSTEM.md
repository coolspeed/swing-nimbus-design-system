# Nimbus Swing Design System

이 문서는 `design-system/screenshots/00.png`부터
`design-system/screenshots/04.png`까지의 화면을 시각적으로 분석하고,
OpenJDK Nimbus `UIManager` 기본값과 대조해 만든 구현 기준이다. 화면을 그대로 복제하는
스타일 가이드가 아니라, 다른 Swing 화면에서도 같은 인상을 재현하기 위한 토큰·컴포넌트·
사용 규칙의 집합이다.

## 1. 디자인 원칙

1. **Native first** — 버튼, 입력창, 탭, 스크롤바의 그라디언트와 상태 표현은 Nimbus painter에 맡긴다.
2. **Matte first** — Nimbus의 기본 인상은 회청색의 낮은 대비와 얕은 명암이다. 넓은 흰 하이라이트,
   단단한 중간 분할선, 여러 겹의 그림자로 유리·크롬 같은 고광택 표면을 만들지 않는다.
3. **Quiet canvas, clear surface** — 회청색 캔버스 위에 흰 입력/데이터 표면을 올려 작업 영역을 구분한다.
4. **Color restraint** — 색은 selection, focus, progress, semantic feedback처럼 기능 상태를
   전달할 때만 쓴다. eyebrow, 장식 제목, 설명 문구를 accent color로 꾸미지 않는다.
5. **State is visible** — 선택, 포커스, 비활성, 진행, 오류 상태는 색뿐 아니라 테두리·아이콘·텍스트로 함께 표현한다.
6. **Four-pixel rhythm** — 배치 간격은 4의 배수로 구성하고, 폼 내부에는 8 px, 섹션 사이에는 12~16 px를 우선 사용한다.
7. **Semantic wrappers, standard widgets** — 제품 의미는 작은 helper로 제공하되 실제 컨트롤은 표준 Swing 클래스를 유지한다.

## 2. 분석 근거

| 화면 | 관찰 근거 |
|---|---|
| `00.png` | 입력, 선택, 비활성, 라디오, 슬라이더, 기본 버튼 상태 |
| `01.png` | 트리, 분할 패널, 표, 목록, 행 교대색, 스크롤 컨테이너 |
| `02.png` | determinate/indeterminate 진행, 스크롤바, 4단계 의미 피드백 |
| `03.png` | 내부 프레임, 데스크톱 배경, 정보 모달, 활성/비활성 창 |
| `04.png` | 파일 선택기, 아이콘 버튼, 콤보박스, 기본/보조 대화상자 액션 |

5개 캡처의 대표색을 양자화해 확인하면 캔버스 `#D6D9DF`가 화면별 약 38~86%,
흰 표면 `#FFFFFF`가 데이터/폼 화면에서 약 11~33%를 차지한다. 내부 프레임 화면의
청회색 배경은 `#31536D`~`#395D7A` 범위다. 캡처는 Windows 디스플레이 배율이 적용된
물리 픽셀이므로, 치수는 캡처 픽셀 대신 Java의 논리 픽셀로 정의한다.

## 3. 색상 토큰

### Native Nimbus palette

| 토큰 | 값 | 용도 |
|---|---:|---|
| `CANVAS` | `#D6D9DF` | 프레임 및 패널 기본 배경 |
| `SURFACE` | `#FFFFFF` | 입력창, 목록, 트리, 표의 작업 표면 |
| `TEXT` | `#000000` | 기본 텍스트 |
| `BASE` | `#33628C` | Nimbus 기본 강조색과 painter 기준색 |
| `BLUE_GREY` | `#A9B0BE` | 중립 테두리·컨트롤 음영 |
| `FOCUS` | `#73A4D1` | 키보드 포커스 링 |
| `SELECTION` | `#39698A` | 선택된 행·항목 |
| `ORANGE` | `#BF6204` | 기본 진행 표시 |
| `RED` | `#A92E22` | Nimbus 오류 primitive |
| `INFO_BLUE` | `#2F5CB4` | Nimbus 정보 primitive |
| `ALERT_YELLOW` | `#FFDC23` | Nimbus 경고 primitive |
| `GREEN` | `#B0B332` | Nimbus 성공 primitive |

### Semantic feedback

| 토큰 | 값 | 규칙 |
|---|---:|---|
| `SUCCESS` | `#2A7849` | 완료·저장 성공. `✓` 또는 아이콘 병기 |
| `INFORMATION` | `#325B95` | 중립적 안내. `i` 또는 아이콘 병기 |
| `WARNING` | `#996D19` | 주의 필요. 행동을 막지 않는 경고 |
| `DANGER` | `#9D3A3A` | 실패·파괴적 결과. `×` 또는 아이콘 병기 |

의미색은 넓은 배경 채움보다 제목, 1 px 테두리, 아이콘에 사용한다. 본문은 기본 텍스트색을
유지해 대비와 가독성을 보존한다. Success, Information, Warning, Error 메시지 박스에는
의미색 배경이나 옅은 tint도 넣지 않는다. 박스 내부는 주변 `CANVAS`와 같아야 한다.

## 4. 타이포그래피

기본 글꼴은 `SansSerif` 논리 글꼴이다. 이 프로젝트의 Windows/OpenJDK 24 캡처 환경에서
라틴 문자의 첫 물리 폰트는 `Arial`, 한글 fallback은 `Malgun Gothic`으로 확인했다.
웹 재현은 `"Arial", "Malgun Gothic", sans-serif` 순서를 사용한다. `Segoe UI`나 Geist로
임의 대체하지 않는다.

| 역할 | Swing | 웹 CSS | 사용처 |
|---|---|---|---|
| Page title | 20 pt Bold | 20 px / 700 | 한 화면당 하나 |
| Section title | 14 pt Bold | 14 px / 700 | 큰 콘텐츠 구획 |
| Body strong | 12 pt Bold | 12 px / 700 | `TitledBorder`, 강조 레이블 |
| Body | 12 pt Regular | 12 px / 400 | 컨트롤, 탭, 표, 메뉴, 본문 |
| Caption | 11 pt Regular | 11 px / 400 | 보조 설명, 메타데이터 |

웹 카탈로그는 Swing의 논리 폰트 크기를 같은 수치의 CSS px로 옮겨 원본 캡처의 compact
scale을 유지한다. 브라우저 기본 커닝과 합자는 끄고, 색상 토큰처럼 코드 형태로 보이는
문자열에도 임의의 모노스페이스 폰트를 섞지 않는다. `strong`, 제목, 선택 상태라는 이유만으로
굵기를 추가하지 않는다.

제목과 본문은 문장형 대소문자(sentence case)를 기본으로 한다. 버튼 레이블은 동사로
시작하고 말줄임표는 추가 입력이 필요한 액션에만 사용한다.

## 5. 간격과 크기

| 토큰 | 논리 px | 대표 용도 |
|---|---:|---|
| `SPACE_1` | 4 | 아이콘-텍스트, 촘촘한 내부 간격 |
| `SPACE_2` | 8 | 필드·카드 내부 padding |
| `SPACE_3` | 12 | 화면 가장자리, 연관 그룹 사이 |
| `SPACE_4` | 16 | 독립 섹션 사이 |
| `SPACE_5` | 24 | 큰 레이아웃 분리 |
| `SPACE_6` | 32 | 페이지 수준 여백 |

Nimbus 기본 content margin은 버튼 `6/14/6/14`, 텍스트 입력 `6/6/6/6`이다. 높이를
강제로 고정하기보다 이 inset과 글꼴로 자연 크기를 계산한다. 고해상도 화면에서는 Java의
HiDPI scaling에 맡기고 픽셀 단위 확대 코드를 추가하지 않는다.

캡처 대조가 필요한 웹 재현에서는 다음 외곽 치수를 우선한다.

| 컴포넌트 | 웹 기준 |
|---|---:|
| 탭 | 기본 24 px, 선택 25 px; 세로 padding 1 px |
| determinate progress | 19 px; 진행률 문자열은 막대 중앙 내부 |
| indeterminate progress | 13 px track; 14 px 원형을 세로 86%로 줄인 주황 foreground stream이 내부에서 수평 이동 |
| horizontal scrollbar | 15 px; 양 끝 24 px 버튼, thumb 상단 직선/하단 원호 |

이 값은 글자 높이와의 상대 비율을 보존하기 위한 값이다. 탭이나 progress bar를 섹션
높이에 맞춰 늘리지 않는다.

## 6. 레이아웃

- 프레임은 `BorderLayout`: 메뉴/툴바, 헤더, 콘텐츠, 상태 표시줄 순서로 구성한다.
- 페이지 콘텐츠의 바깥 여백은 12 px, 연관 패널 사이 간격은 8~12 px를 사용한다.
- 웹 데스크톱 재현 창은 viewport를 거의 꽉 채우지 않는다. 최대 `1200 × 720 px`로 제한하고
  큰 화면에서는 사방 약 70 px의 바깥 여백을 보여 독립된 Swing 프레임처럼 보이게 한다.
- 폼 레이블은 같은 열에 정렬하며 필드가 남는 가로 공간을 차지한다.
- 마스터/디테일 구조는 `JSplitPane`을 사용하고 기본 비율은 약 27/73으로 한다.
- 데이터가 길어질 수 있는 모든 표면은 처음부터 `JScrollPane` 안에 배치한다.
- 제목이 있는 경계는 정보 구조를 만들 때만 사용한다. 장식 목적으로 중첩하지 않는다.

### Window chrome과 Electron

- 웹 카탈로그의 상단 title bar는 독립된 Swing 창을 설명하기 위한 모의 window chrome이다.
  표시 여부의 단일 출처는 `web-app/app/nimbus-config.ts`의 `SHOW_WINDOW_TITLE_BAR` 상수다.
- 브라우저 카탈로그는 `true`를 사용한다. 네이티브 프레임과 title bar를 제공하는 Electron 창은
  `false`로 바꿔 중복 title bar를 제거한다. 이때 title bar DOM뿐 아니라 전용 grid 행도 함께
  제거되어 메뉴 막대 위에 빈 공간이 남지 않아야 한다.
- Electron을 `frame: false`로 실행하고 웹 UI가 최소화·최대화·닫기 동작까지 담당한다면
  `SHOW_WINDOW_TITLE_BAR`를 `true`로 유지한다. 이 경우 drag region과 각 window control을
  Electron IPC에 연결해야 하며, 현재 카탈로그의 장식용 control을 그대로 제품 기능으로 간주하지 않는다.
- 이 상수는 화면 안의 모의 chrome만 제어한다. 운영체제 작업 표시줄과 접근성 API에 전달되는
  실제 Electron `BrowserWindow`의 `title`은 별도로 설정한다.

## 7. 컴포넌트 규칙

### Buttons

- 화면의 기본 동작은 한 개만 두고 root pane의 default button으로 지정한다.
- 보조 동작은 동일한 Nimbus 버튼을 사용하되 위치와 문구로 위계를 만든다.
- 비활성 버튼은 설명할 수 없는 경우 숨기지 말고 disabled state를 보여준다.
- 파일/색상 선택처럼 추가 대화상자를 여는 버튼에는 명확한 동사와 목적어를 쓴다.
- 일반 `JButton` 표면은 약 27 px, 헤더의 `Primary action`은 약 54 px 높이로 재현한다. 툴바처럼 원본이 조밀한 문맥에서는 23 px 높이를 유지한다.
- 기본 버튼의 세로 명암은 레퍼런스 픽셀 프로파일을 따른다. 상단 3%의 밝은 반사점(`#F6F6F8`)에서 빠르게 내려와 63–70% 구간의 가장 짙은 면(`#D6D9DF`)을 만들고, 73–100%의 짧은 하단 구간에서 반사광(`#F5F8FD`)을 가파르게 올린다. `#6E747A` 외곽선과 상·하·좌·우 inset 음영, 짙은 하단 그림자를 함께 사용해 Nimbus 특유의 입체 테두리를 만든다.

### Inputs

- 레이블은 필드 왼쪽 또는 위에 항상 표시한다. placeholder만으로 의미를 전달하지 않는다.
- Swing의 `JLabel`은 일반 텍스트 편집기가 아니므로 드래그 선택 대상이 아니다. 웹 대응
  `label`, `legend`, 컴포넌트 캡션, 상태 표시줄 텍스트에는 `user-select: none`을 적용하되,
  입력값과 사용자가 복사해야 하는 본문까지 선택 불가능하게 만들지는 않는다.
- 오류는 색상 테두리만 사용하지 않고 오류 문구를 필드 가까이에 배치한다.
- `JSpinner`, `JComboBox`, `JFormattedTextField`처럼 데이터 종류에 맞는 컨트롤을 선택한다.
- `JComboBox`의 화살표 버튼은 입력 표면과 분리된 우측 17 px 사각 영역으로 둔다. 이 영역은 원본처럼 가운데가 짙은 공통 청회색 크롬 그라데이션(`#D6E2EA → #9FB5C7 → #CEDCE7`)과 `#687C8E` 좌측 경계선, 중앙의 짙은 아래 화살표를 사용한다. 바깥 컨테이너에서 모서리를 잘라 외곽 테두리가 네 귀퉁이에서 끊기지 않게 하며, 브라우저 기본 화살표는 노출하지 않는다.
- `JSpinner`는 입력 표면 오른쪽에 17 px 너비의 버튼 영역을 두고, 이를 위·아래 두 칸으로 나눠 증가·감소 화살표를 각각 가둔다. 두 버튼은 `JComboBox` 화살표 버튼과 동일한 공통 청회색 크롬 팔레트와 `#687C8E` 경계선을 사용하며 브라우저 기본 number 스피너는 숨긴다. 가운데 가로선은 유지하되, 선에 맞닿는 위 버튼 하단과 아래 버튼 상단의 밝은 띠는 각각 약 1 px로 좁혀 두 면의 명암이 하나의 세로 버튼처럼 이어지게 한다.
- 비활성은 unavailable, 읽기 전용은 view-only라는 서로 다른 의미로 취급한다.

### Tabs and navigation

- 탭은 같은 수준의 화면 전환에만 사용한다.
- 탭 레이블은 웹 재현에서 12 px Regular이며, 선택되었다고 굵게 만들지 않는다.
- 선택 탭은 캡처에서 다시 측정한 낮은 채도의 진한 청회색(`#D8E2E9 → #C3D0DB →
  #ADBFCE → #96AEC1`)처럼 위에서 아래로 단조롭게 어두워져야 한다. 비선택 탭의 거의 흰
  표면과 즉시 구분될 만큼 면 전체가 짙어야 하며, 중간 이후 다시 밝아지는 glossy 반사띠를
  만들지 않는다. 검은색에 가까운 `#22313F` 외곽선을 1.5 px로 둘러 선택 상태를 한 번 더 구분한다.
- 세로 inset은 촘촘하게 유지하고 웹에서 30~31 px를 넘겨 과도한 상하 여백을 만들지 않는다.
- 탭 아래 이중선은 창 가장자리까지 닿게 늘이지 않고, 콘텐츠 fieldset과 같은 좌우 여백을 남겨 끝낸다. 웹 재현에서는 탭 위치를 유지한 채 선의 양 끝을 각각 12 px 안쪽에 둔다. 이 선은 가로 스크롤되는 tab list의 pseudo-element로 만들지 않는다. 고정 폭의 tab strip 안에서 tab list와 독립된 divider 요소로 두어, 모바일에서 탭의 scrollable width나 scroll offset이 달라져도 선은 항상 현재 보이는 창 폭을 기준으로 같은 12 px 여백을 유지해야 한다.
- 탭 수가 너무 많아 한 줄을 넘으면 정보 구조를 다시 나눈다.

### Tables, trees, and lists

- 열 머리글은 짧은 명사로 쓰고 정렬 기능이 있으면 `RowSorter`를 제공한다.
- 행 선택색은 `SELECTION`; 줄무늬는 Nimbus 기본 중립 표면을 훼손하지 않는 범위에서 사용한다.
- 표의 row hover에는 배경색, 외곽선, 그림자 등 어떤 시각 변화도 주지 않는다. Nimbus 캡처의
  표는 마우스 위치가 아니라 실제 selection/focus 상태만 표시한다.
- 표 행은 클릭과 키보드(`Enter`/`Space`)로 선택할 수 있어야 한다. 선택된 행만 Nimbus
  `SELECTION` 다크 네이비(`#39698A`) 배경과 흰 글자로 강조하고 `aria-selected`를 동기화한다.
- `Recent activity` 같은 선택 가능한 목록도 hover에는 반응하지 않는다. 클릭 또는
  `Enter`/`Space`로 선택된 실제 항목만 표와 같은 `SELECTION` 배경·흰 글자를 사용하고
  `aria-selected`를 동기화해 표와 목록의 selection 언어를 통일한다.
- `Ready`, `Draft`, `In review` 같은 상태값도 다른 column과 동일한 plain text로 표시한다.
  의미색, 배경 채움, 테두리, pill, badge, rounded square를 사용하지 않는다.
- 우클릭 메뉴의 모든 핵심 명령은 메뉴나 툴바에서도 접근 가능해야 한다.
- 빈 상태는 빈 흰 상자 대신 원인과 다음 행동을 설명한다.

### Feedback and dialogs

- 진행률을 알 수 있으면 determinate progress, 알 수 없을 때만 indeterminate progress를 사용한다.
- determinate progress의 `%` 문자열은 별도 레이블로 빼지 않고 채움 위 중앙에 겹쳐 표시한다.
- determinate progress는 `02.png`의 세로 픽셀 프로파일을 따른다. 빈 track은 상단 `#FFFFFF`에서 46% 지점의 `#CED0D4`까지 오목하게 어두워졌다가 하단 `#F9FBFF`로 반사된다. 주황 채움은 재현 화면에서 원본과 같은 대비로 보이도록 `#E7BC88`에서 54% 지점의 `#AA4A00`까지 급격히 짙어진 뒤 하단 `#F49A31` 반사띠로 올라온다. 채움 바깥 위쪽 약 3 px와 아래쪽 약 4 px에 주황 반사광을 드리우며, `#898C92` 외곽선과 위·아래 inset 음영을 함께 사용한다.
- 정적 컴포넌트 캡처를 재현하는 화면에는 원본에 없는 `Adjust progress` 레이블이나 조절용
  slider를 추가하지 않는다. 예시 진행률은 `72%`로 고정해 구조와 밀도를 그대로 보존한다.
- indeterminate progress는 짧은 사선 stripe나 반원 outline의 연속이 아니다. 캡처처럼
  밝은 흰색·회색 track 위를 하나의 주황 foreground stream이 끊김 없이 가로지르고, stream의 두께가 굵어졌다
  가늘어지는 형태가 수평 방향으로 연속해서 흘러야 한다. 완전한 sine처럼 극점의 폭이 0인
  형태도, 직선 위에 타원을 얹은 꼬치 형태도 아니다. 좁은 구간과 넓은 구간에 각각 짧은
  plateau를 두고 그 사이를 cubic Bézier 곡선으로 연결한다. 14 px 패턴 레이어의 굵은 구간은
  약 11 px까지 팽창한다. 흰 track은 16 px 기준보다 가는 13 px로 만들고, 패턴 원형은
  세로만 86%로 소폭 축소해 track 내부에 맞춘다. stream과 그림자가 border 밖으로 나오지 않게
  track에서 clipping한다.
  오렌지색을 track 전체에 채운 뒤 흰 모양을 올리는 역상 구현은 금지한다.
  원형의 44 px 물방울 주기는 가로 좌표를 75%로 재계산해 약 33 px로 압축한다. 압축 뒤에도
  이동 속도를 유지하도록 한 주기는 약 0.52초에 흘러가게 한다. 주황 stream을 반복 조각으로 구현할 때는
  각 조각의 클립 경계를 최소 1 px 겹치고 경계선을 요소 바깥으로 밀며, 좁은 plateau와 같은
  2 px 두께의 주황 core를 패턴 전체에 연속으로 이어 둔다. 애니메이션의 소수점 이동 중에도
  주기 경계에 흰색 세로 틈이나 톱니 모양 안티앨리어싱이 드러나지 않아야 한다.
  각 반복 주황 물방울 내부에는 밝은 오렌지 tone-on-tone 세로 highlight를 1 px 두 줄씩 두고,
  stream과 같은 속도·방향으로 이동시킨다.
- indeterminate stream은 determinate보다 밝은 전용 주황 프로파일(`#F0C995 → #C36903 → #F8AA48`)을 사용하고, 위에는 밝은 반사선, 아래에는 짙은 drop shadow를 더해 흰 track에서 떠 있는 볼록한 흐름으로 보이게 한다. track 상반부는 `#777C84` 외곽선 다음에 흰 반사선을 2 px 겹치고, 52% 지점의 `#D8D9DC`까지 내려가는 오목면으로 만든다.
- horizontal scrollbar의 화살표 버튼은 트랙 쪽 경계만 오목하게 파고, thumb는 상단이
  직선이고 하단 두 모서리가 둥근 Nimbus의 비대칭 실루엣을 유지한다. 웹 재현에서는
  전체 높이 15 px, 끝 버튼 폭 24 px, 오목한 홈 반경 약 7 px를 기준으로 하며 패널 폭에
  따라 세로 크기를 늘리지 않는다. 오목한 경계는 트랙색 도형을 버튼 위에 덧칠해 흉내
  내지 말고 mask/clip으로 버튼 자체를 잘라 실제 하부 트랙이 보이게 한다. thumb의 면은
  기본 상태는 절제된 회청색(`#E6EDEF → #95AEC3 → #DCEBF0`)으로 칠한다. 정밀 포인터의 hover에서만 한 단계 밝은 프로파일(`#F5F9FA → #A6BED1 → #E9F7FA`)로 전환하며, 터치 기기의 고착된 가상 hover에는 이 밝기 변화가 적용되지 않아야 한다. 가장 짙은 지점은 높이의 약 32%에 두며, 넓게 퍼지는 바깥 그림자는 1 px·22% 불투명도로 제한한다. 기본·hover 상태의 좌우와 하단 1 px 외곽선은 검정에 가까우면서 청색 기운을 남긴 `#0C1D28`, 상단 1 px은 반사광 역할의 연한 하늘색 `#B9D8E7`로 분리하고, 표면 안쪽 우측 음영과 `#526F85` 하단 inset으로 입체감을 만든다. 눌린 상태는 `screenshots/scroll bar.png`의 중앙 세로 픽셀을 기준으로 상단 반사색 `#8DA8BE`에서 35% 지점의 `#386791`까지 급격히 어두워졌다가 하단의 `#7AA7D2`로 밝아지는 청회색 프로파일을 사용하며, `#091C29` 외곽선과 `#A5C8DB` 상단 반사선, `#416484` 하단 inset으로 깊이를 고정한다. 모든 상태에서 상단 모서리는 수평 5 px·수직 3 px만 둥글려 양끝의 날카로움을 완화하고, 하단 모서리는 수평 22 px·수직 14 px의 타원 곡률을 사용해 양옆 사선이 길게 들어오도록 한다. rail은 `screenshots/scroll bar.png`의 thumb가 없는 여러 x 좌표에서 측정한 단조 증가 곡선을 기반으로 한다. 웹 재현에서는 상단 암부만 검정 방향으로 약 30% 보강한 `#494A4C → #646669 → #7F8184 → #93969A → #AAACB2`를 사용한 뒤 원본 중간톤 `#C2C4CA → #C7C9CF → #CFD2D8 → #D6D9DF`로 부드럽게 복귀한다. 전체 곡선은 아래로 갈수록 계속 밝아져야 하며, 중간 하이라이트나 재암부, 별도 inset shadow를 넣지 않는다.
- 웹 카탈로그의 horizontal scrollbar는 양쪽 화살표 클릭, track 클릭, thumb drag와
  `Arrow`/`Page`/`Home`/`End` 키로 0–100 위치를 바꾸며 slider ARIA 값을 함께 동기화한다.
- context menu는 포인터로 호출했을 때 viewport 기준 클릭 좌표(`clientX`, `clientY`)를 시작점으로
  삼고, 메뉴가 viewport를 벗어나는 경우에만 4 px 안전 여백 안으로 이동한다. 키보드로 호출하면
  트리거의 왼쪽 아래를 대체 시작점으로 사용한다.
- Success, Information, Warning, Error 메시지 박스는 의미색 1 px border와 제목/아이콘만
  사용한다. 배경색과 `color-mix()` tint는 금지하고 내부는 주변 canvas가 그대로 보여야 한다.
- 상태 표시줄의 `Ready` 앞에는 초록색 점 같은 웹식 상태 장식을 붙이지 않는다. 원본처럼
  `Ready • Nimbus Look & Feel`을 중립색 plain text로 표시한다.
- 정보/경고/오류는 `JOptionPane`의 표준 아이콘과 버튼 순서를 우선한다.
- 모달은 즉시 결정이 필요한 경우에만 사용한다.
- `JFileChooser` 재현은 `04.png`처럼 경로 필드 오른쪽에 상위 폴더, 홈 폴더, 새 폴더,
  List, Details 버튼을 이 순서로 둔다. 다섯 버튼은 실제 경로·목록 상태를 바꾸고, List와
  Details는 `aria-pressed`로 현재 보기를 표시하며 파일 선택은 File name 필드와 동기화한다.
- 내부 프레임은 복수 문서를 동시에 다루는 MDI 작업 공간에서만 사용한다. 제목 표시줄을
  포인터로 드래그하면 desktop 경계 안에서 이동하고, 클릭·포커스로 활성 창과 z-order가 바뀌어야 한다.
  활성 창의 최소화·최대화·닫기 버튼은 `03.png`/`04.png`에 맞춰 각각 오렌지·연두·빨강으로
  칠하고 비활성 창에서는 회색으로 낮춘다. 세 버튼은 장식이 아니라 최소화, 최대화/복원,
  닫기 동작을 실제 수행해야 한다.

### Titled groups

- Swing의 이 패턴 이름은 `TitledBorder`이며, 보통 `JPanel`에 적용한다. 일반 UI 용어로는
  group box, HTML 대응 요소로는 `fieldset`/`legend`다.
- 제목이 놓인 구간에는 외곽선이 없어야 한다. 제목 배경색으로 선을 덧칠하지 말고,
  border painter 또는 `legend`의 실제 border interruption으로 선을 끊는다.
- 제목 뒤 배경은 주변 패널과 정확히 같은 `CANVAS`여야 하며 inset highlight나 box-shadow가
  제목 아래를 연속해서 지나가면 안 된다.

## 8. 상태 명세

모든 interactive component는 최소한 다음 상태를 검토한다.

`default → hover → pressed → focused → selected → disabled`

폼 컴포넌트에는 `read-only`, `invalid`, `valid`를 추가한다. 포커스 링 `#73A4D1`은
키보드 사용자의 현재 위치이므로 제거하지 않는다. 아이콘만 있는 버튼은 tooltip과
accessible name을 모두 제공한다.

## 9. 접근성

- 텍스트와 배경의 대비는 WCAG AA를 목표로 한다.
- 성공/경고/오류를 색만으로 구분하지 않는다.
- 메뉴와 탭에는 mnemonic을 지정하고 모든 핵심 동작은 키보드로 도달 가능하게 한다.
- 레이블은 `setLabelFor()`로 입력 컴포넌트와 연결한다.
- tooltip은 보조 설명이며 필수 정보를 담는 유일한 수단으로 사용하지 않는다.
- 최소 글꼴 크기를 임의로 줄이지 않고 OS/Java 스케일링을 존중한다.

## 10. 코드 사용

```java
installNimbus();
NimbusTokens.applyNativePalette();

JPanel section = NimbusComponents.titledPanel("Account");
JLabel title = NimbusComponents.pageTitle("Workspace settings");
JPanel notice = NimbusComponents.messageCard(
        "Success",
        "All changes have been saved.",
        NimbusTokens.SUCCESS);
```

`NimbusTokens`는 값의 단일 출처이고, `NimbusComponents`는 의미가 필요한 얇은 wrapper다.
표준 버튼·입력·표 자체를 새 클래스로 감싸거나 Nimbus painter를 복제하지 않는다.
