# total-back
# 나의 GitHub 페이지

안녕하세요! 구정빈 입니다. GitHub 프로필입니다.

## 프로젝 목록

### 1. 테이블 목록
CREATE TABLE member (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- 기본 키
    userId VARCHAR(255) NOT NULL UNIQUE,  -- 사용자 ID, 고유 제약 조건
    userPw VARCHAR(255) NOT NULL,          -- 사용자 비밀번호
    userName VARCHAR(255) NOT NULL,        -- 사용자 이름
    userPhone VARCHAR(20),                  -- 사용자 전화번호
    userBirthDate DATE,                     -- 사용자 생년월일
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 생성일자
);

CREATE TABLE snsmember LIKE member;

CREATE TABLE IF NOT EXISTS login_history (
    history_number INT AUTO_INCREMENT PRIMARY KEY,   -- 기본 키
    userId VARCHAR(255) NOT NULL,                    -- 사용자 ID
    userType ENUM('member', 'snsmember') NOT NULL,   -- 사용자 유형
    history TIMESTAMP DEFAULT CURRENT_TIMESTAMP     -- 로그인 기록 시간
);

CREATE TABLE IF NOT EXISTS reservation (
    id INT AUTO_INCREMENT PRIMARY KEY,        -- 예약 ID
    userId VARCHAR(255) NOT NULL,             -- 사용자 ID
    userType ENUM('member', 'snsmember') NOT NULL, -- 사용자 유형 (member 또는 snsmember)
    reserveDate DATE NOT NULL,                 -- 예약 날짜
    startTime DATETIME NOT NULL,               -- 예약 시작 시간
    endTime DATETIME NOT NULL,                 -- 예약 종료 시간
    sitNum INT NOT NULL                        -- 좌석 번호
);

## 기술 스택
- JavaScript
- Node.js
- Express
- MySQL

## 연락처
- 이메일: nicewjdqls@naver.com
- 블로그: [구정빈](https://blog.naver.com/nicewjdqls/223524107314e)
