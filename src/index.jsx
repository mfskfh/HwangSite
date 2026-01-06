import React, { useState, useEffect } from "react";

// =======================
// 로그인 페이지
// =======================
function Login({ onLogin }) {
  const [uid, setUid] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const USERS = { student1: "1234", student2: "5678" };

  const handleLogin = () => {
    if (USERS[uid] && USERS[uid] === pw) {
      onLogin(uid);
    } else {
      setError("❌ 아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "Arial, sans-serif" }}>
      <h1>로그인</h1>
      <input
        type="text"
        placeholder="아이디"
        value={uid}
        onChange={(e) => setUid(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", marginBottom: "10px" }}
      /><br/>
      <input
        type="password"
        placeholder="비밀번호"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", marginBottom: "10px" }}
      /><br/>
      <button
        onClick={handleLogin}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        로그인
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

// =======================
// 출결 메인 페이지
// =======================
function AttendanceMain({ user, onLogout }) {
  const [todayChecked, setTodayChecked] = useState(false);
  const [workedHours, setWorkedHours] = useState(0);
  const [statusPopup, setStatusPopup] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState("");

  const totalWorkHours = 8;
  const totalDays = 365;
  const attendedDays = 250;

  const handleAttendance = () => {
    setTodayChecked(true);
    setAttendanceStatus("출석");
    setWorkedHours(0);
  };

  const handleStatusSelect = (status) => {
    setAttendanceStatus(status);
    setStatusPopup(false);
  };

  useEffect(() => {
    let interval;
    if (todayChecked && workedHours < totalWorkHours && attendanceStatus === "출석") {
      interval = setInterval(() => {
        setWorkedHours((prev) => Math.min(prev + 0.1, totalWorkHours));
      }, 3600);
    }
    return () => clearInterval(interval);
  }, [todayChecked, workedHours, attendanceStatus]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", position: "relative" }}>
      {/* 마이페이지 버튼 */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onLogout}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {user[0].toUpperCase()}
        </button>
      </div>

      <h1 style={{ textAlign: "center" }}>출결 메인 페이지</h1>

      {/* 출석 + 상태 선택 버튼 */}
      <div style={{ textAlign: "center", margin: "20px 0", position: "relative" }}>
        <button
          onClick={handleAttendance}
          disabled={todayChecked && attendanceStatus === "출석"}
          style={{
            padding: "15px 40px",
            fontSize: "16px",
            cursor: todayChecked && attendanceStatus === "출석" ? "not-allowed" : "pointer",
            marginRight: "10px",
          }}
        >
          {todayChecked && attendanceStatus === "출석" ? "✅ 출석 완료" : "출석하기"}
        </button>

        <button
          onClick={() => setStatusPopup(!statusPopup)}
          style={{
            padding: "15px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          출결 상태 선택
        </button>

        {/* 상태 선택 팝업 */}
        {statusPopup && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "white",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              zIndex: 10,
              width: "120px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {["결석", "조퇴", "지각", "병결", "휴가"].map((s) => (
              <button
                key={s}
                onClick={() => handleStatusSelect(s)}
                style={{
                  height: "40px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 오늘 근무 현황 바 */}
      <div style={{ maxWidth: "600px", margin: "0 auto 20px auto" }}>
        <h3>오늘 근무 현황</h3>
        <div
          style={{
            width: "100%",
            height: "25px",
            background: "#ddd",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${attendanceStatus === "출석" ? (workedHours / totalWorkHours) * 100 : 0}%`,
              height: "100%",
              background: "#4CAF50",
              transition: "width 0.5s",
            }}
          ></div>
        </div>
        <p style={{ textAlign: "right" }}>
          {attendanceStatus
            ? attendanceStatus === "출석"
              ? `${workedHours.toFixed(1)} / ${totalWorkHours}시간`
              : `오늘 상태: ${attendanceStatus}`
            : "❌ 오늘 출석하지 않음"}
        </p>
      </div>

      {/* 총 출결 현황 바 */}
      <div style={{ maxWidth: "600px", margin: "30px auto" }}>
        <h3>총 출결 현황 (1년 기준)</h3>
        <div
          style={{
            width: "100%",
            height: "25px",
            background: "#ddd",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(attendedDays / totalDays) * 100}%`,
              height: "100%",
              background: "#4CAF50",
              transition: "width 0.5s",
            }}
          ></div>
        </div>
        <p style={{ textAlign: "right" }}>
          {attendedDays} / {totalDays}일
        </p>
      </div>
    </div>
  );
}

// =======================
// 메인 App
// =======================
export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (uid) => {
    setUser(uid);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return user ? <AttendanceMain user={user} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />;
}
