const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { connection } = require('../model/Task');
const requestIp = require('request-ip');

async function loginUser(req, res) {
    // 리액트에서 전송하는 데이터에 맞게 userId와 userPw로 수정
    const { userId, userPw } = req.body;
    const ip = requestIp.getClientIp(req); // IP 주소 추출

    try {
        const query = "SELECT user_pw, name FROM member WHERE user_id = ?";
        connection.query(query, [userId], async (error, results) => {
            if (error) {
                console.error("오류", error);
                return res.status(500).json({ message: "Login failed" });
            }

            if (results.length === 0) {
                return res.status(400).json({ message: "Invalid user ID or password" });
            }

            const user = results[0];
            const match = await bcrypt.compare(userPw, user.user_pw);
            if (!match) {
                return res.status(400).json({ message: "Invalid user ID or password" });
            }

            // 로그인 성공 시 세션에 사용자 정보 저장
            req.session.user = { id: userId, name: user.name };

            // 로그인 기록 저장
            const historyQuery = "INSERT INTO login_history (user_id, ip_address, history) VALUES (?, ?, CURRENT_TIMESTAMP)";
            connection.query(historyQuery, [userId, ip], (historyError) => {
                if (historyError) {
                    console.error("로그인 기록 저장 오류", historyError);
                }
            });

            res.status(200).json({ success: true, name: user.name });
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
}
module.exports = { loginUser };
