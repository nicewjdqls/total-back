const express = require('express');
const bcrypt = require('bcryptjs'); // bcrypt 대신 bcryptjs를 사용
const session = require('express-session');
const { connection } = require('../model/Task');
const requestIp = require('request-ip');

async function loginUser(req, res) {
    const { userId, userPw } = req.body;
    const ip = requestIp.getClientIp(req); // IP 주소 추출

    try {
        const query = "SELECT userPw, userName FROM member WHERE userId = ?";
        connection.query(query, [userId], async (error, results) => {
            if (error) {
                console.error("오류", error);
                return res.status(500).json({ message: "Login failed" });
            }

            if (results.length === 0) {
                return res.status(400).json({ message: "Invalid user ID or password" });
            }

            const user = results[0];
            // user_pw를 userPw로 변경
            const match = await bcrypt.compare(userPw, user.userPw);
            if (!match) {
                return res.status(400).json({ message: "Invalid user ID or password" });
            }

            // 로그인 성공 시 세션에 사용자 정보 저장
            req.session.user = { id: userId, name: user.userName };

            // 로그인 기록 저장
            const historyQuery = 'INSERT INTO login_history (userId, userType, ip_address) VALUES (?, ?, ?)';
            const userType = 'member'; // 사용자 유형 설정
            connection.query(historyQuery, [userId, userType, ip], (historyError) => {
                if (historyError) {
                    console.error("로그인 기록 저장 오류", historyError);
                }
            });

            res.status(200).json({ success: true, name: user.userName });
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
}

module.exports = { loginUser };
