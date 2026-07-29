# Nimbus Swing Design System

`screenshots/`의 실제 실행 화면을 시각 분석하고 OpenJDK Nimbus 기본값과 대조해 만든
Java Swing 디자인 시스템입니다. 실행형 카탈로그와 재사용 가능한 토큰/API, 상세 사용
가이드를 함께 제공합니다.

## 구성

- `Main.java` — Foundations, Controls, Data views, Feedback, Overlays 카탈로그
- `NimbusTokens.java` — 색상, 타이포그래피, 간격, content inset 토큰
- `NimbusComponents.java` — 제목, 보조 레이블, 메시지 카드, 색상 swatch helper
- `DESIGN_SYSTEM.md` — 분석 근거, 원칙, 토큰, 컴포넌트 및 접근성 명세
- `screenshots/` — 디자인 시스템을 추출한 원본 화면

## 실행

JDK 8 이상에서 아래 명령으로 실행합니다.

```powershell
javac -encoding UTF-8 Main.java NimbusTokens.java NimbusComponents.java
java Main
```

`Foundations` 탭에서 색상·타입·간격·상태를 확인할 수 있습니다. 다른 탭에는 메뉴/툴바,
입력 컨트롤, 테이블, 트리, 목록, 진행 표시, 의미 피드백, 툴팁, 컨텍스트 메뉴,
표준 대화상자와 내부 창(`JInternalFrame`)이 포함되어 있습니다.
