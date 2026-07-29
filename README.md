# Nimbus Swing Design System

스크린샷 분석을 기반으로 만든 Nimbus Look & Feel 디자인 시스템과 실행형 Java Swing
카탈로그입니다.

## 폴더 구조

```text
.
├─ java-app/
│  └─ Main.java
├─ design-system/
│  ├─ DESIGN_SYSTEM.md
│  ├─ NimbusTokens.java
│  ├─ NimbusComponents.java
│  └─ screenshots/
│     └─ 00.png ... 04.png
├─ .gitignore
└─ README.md
```

- `java-app/` — 디자인 시스템을 보여주는 Java 데모 프로그램
- `design-system/` — 재사용 코드, 명세 문서, 분석 원본

## 컴파일과 실행

```powershell
javac -encoding UTF-8 -d out design-system/*.java java-app/Main.java
java -cp out Main
```

컴파일 결과인 `out/`은 Git에서 제외됩니다.
