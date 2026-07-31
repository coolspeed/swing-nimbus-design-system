# Nimbus Swing Design System

스크린샷 분석을 기반으로 Java Swing Nimbus Look & Feel을 문서, Java 카탈로그,
모던 웹 애플리케이션으로 구현한 프로젝트입니다.

## 최종 배포 위치

> **Production:** <https://nimbus-swing-web.coolspeed.chatgpt.site/>

위 주소가 Java Swing Nimbus 웹 재현 버전의 공식 최종 배포 위치입니다.

## 폴더 구조

```text
.
├─ design-system/   # 공통 명세, Java 토큰/API, 원본 스크린샷
├─ java-app/        # Java Swing 실행형 카탈로그
├─ web-app/         # React + Tailwind CSS 웹 카탈로그
├─ .gitignore
└─ README.md
```

## Java 앱

```powershell
javac -encoding UTF-8 -d out design-system/*.java java-app/Main.java
java -cp out Main
```

## 웹 앱

```powershell
cd web-app
npm install
npm run dev
```

웹 앱 검증은 `npm run lint`와 `npm test`로 실행합니다.
