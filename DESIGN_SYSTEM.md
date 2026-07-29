# Nimbus Swing Design System

이 문서는 `screenshots/00.png`부터 `screenshots/04.png`까지의 화면을 시각적으로 분석하고,
OpenJDK Nimbus `UIManager` 기본값과 대조해 만든 구현 기준이다. 화면을 그대로 복제하는
스타일 가이드가 아니라, 다른 Swing 화면에서도 같은 인상을 재현하기 위한 토큰·컴포넌트·
사용 규칙의 집합이다.

## 1. 디자인 원칙

1. **Native first** — 버튼, 입력창, 탭, 스크롤바의 그라디언트와 상태 표현은 Nimbus painter에 맡긴다.
2. **Quiet canvas, clear surface** — 회청색 캔버스 위에 흰 입력/데이터 표면을 올려 작업 영역을 구분한다.
3. **State is visible** — 선택, 포커스, 비활성, 진행, 오류 상태는 색뿐 아니라 테두리·아이콘·텍스트로 함께 표현한다.
4. **Four-pixel rhythm** — 배치 간격은 4의 배수로 구성하고, 폼 내부에는 8 px, 섹션 사이에는 12~16 px를 우선 사용한다.
5. **Semantic wrappers, standard widgets** — 제품 의미는 작은 helper로 제공하되 실제 컨트롤은 표준 Swing 클래스를 유지한다.

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
유지해 대비와 가독성을 보존한다.

## 4. 타이포그래피

기본 글꼴은 `SansSerif` 논리 글꼴이다. 운영체제별 실제 폰트 매핑을 허용해 Swing의
플랫폼 적응성을 유지한다.

| 역할 | 크기/스타일 | 사용처 |
|---|---|---|
| Page title | 20 pt Bold | 한 화면당 하나 |
| Section title | 14 pt Bold | 큰 콘텐츠 구획 |
| Body strong | 12 pt Bold | fieldset 제목, 강조 레이블 |
| Body | 12 pt Regular | 컨트롤, 표, 메뉴, 본문 |
| Caption | 11 pt Regular | 보조 설명, 메타데이터 |

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

## 6. 레이아웃

- 프레임은 `BorderLayout`: 메뉴/툴바, 헤더, 콘텐츠, 상태 표시줄 순서로 구성한다.
- 페이지 콘텐츠의 바깥 여백은 12 px, 연관 패널 사이 간격은 8~12 px를 사용한다.
- 폼 레이블은 같은 열에 정렬하며 필드가 남는 가로 공간을 차지한다.
- 마스터/디테일 구조는 `JSplitPane`을 사용하고 기본 비율은 약 27/73으로 한다.
- 데이터가 길어질 수 있는 모든 표면은 처음부터 `JScrollPane` 안에 배치한다.
- 제목이 있는 경계는 정보 구조를 만들 때만 사용한다. 장식 목적으로 중첩하지 않는다.

## 7. 컴포넌트 규칙

### Buttons

- 화면의 기본 동작은 한 개만 두고 root pane의 default button으로 지정한다.
- 보조 동작은 동일한 Nimbus 버튼을 사용하되 위치와 문구로 위계를 만든다.
- 비활성 버튼은 설명할 수 없는 경우 숨기지 말고 disabled state를 보여준다.
- 파일/색상 선택처럼 추가 대화상자를 여는 버튼에는 명확한 동사와 목적어를 쓴다.

### Inputs

- 레이블은 필드 왼쪽 또는 위에 항상 표시한다. placeholder만으로 의미를 전달하지 않는다.
- 오류는 색상 테두리만 사용하지 않고 오류 문구를 필드 가까이에 배치한다.
- `JSpinner`, `JComboBox`, `JFormattedTextField`처럼 데이터 종류에 맞는 컨트롤을 선택한다.
- 비활성은 unavailable, 읽기 전용은 view-only라는 서로 다른 의미로 취급한다.

### Tabs and navigation

- 탭은 같은 수준의 화면 전환에만 사용한다.
- 선택된 탭의 Nimbus 강조와 키보드 mnemonic을 유지한다.
- 탭 수가 너무 많아 한 줄을 넘으면 정보 구조를 다시 나눈다.

### Tables, trees, and lists

- 열 머리글은 짧은 명사로 쓰고 정렬 기능이 있으면 `RowSorter`를 제공한다.
- 행 선택색은 `SELECTION`; 줄무늬는 Nimbus 기본 중립 표면을 훼손하지 않는 범위에서 사용한다.
- 우클릭 메뉴의 모든 핵심 명령은 메뉴나 툴바에서도 접근 가능해야 한다.
- 빈 상태는 빈 흰 상자 대신 원인과 다음 행동을 설명한다.

### Feedback and dialogs

- 진행률을 알 수 있으면 determinate progress, 알 수 없을 때만 indeterminate progress를 사용한다.
- 정보/경고/오류는 `JOptionPane`의 표준 아이콘과 버튼 순서를 우선한다.
- 모달은 즉시 결정이 필요한 경우에만 사용한다.
- 내부 프레임은 복수 문서를 동시에 다루는 MDI 작업 공간에서만 사용한다.

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
