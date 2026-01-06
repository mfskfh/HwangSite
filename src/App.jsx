import React from "react";

/* =======================
   공통 토스 버튼
======================= */
function TossButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  style = {},
}) {
  const [hover, setHover] = React.useState(false);

  const baseColor = variant === "primary" ? "#3182f6" : "#ffffff";
  const hoverColor = variant === "primary" ? "#1b64da" : "#f4f6f8";
  const textColor = variant === "primary" ? "#ffffff" : "#333";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        padding: "14px",
        borderRadius: "12px",
        border: variant === "primary" ? "none" : "1px solid #e5e8eb",
        background: disabled ? "#e5e8eb" : hover ? hoverColor : baseColor,
        color: disabled ? "#6b7684" : textColor,
        fontSize: "15px",
        fontWeight: "bold",
        cursor: disabled ? "default" : "pointer",
        transform: hover && !disabled ? "scale(1.02)" : "scale(1)",
        boxShadow:
          hover && !disabled
            ? "0 10px 25px rgba(0,0,0,0.15)"
            : "none",
        transition: "all 0.18s ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/* =======================
   로그인 / 회원가입
======================= */
function Auth({ onLogin }) {
  const [mode, setMode] = React.useState("login");
  const [uid, setUid] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [error, setError] = React.useState("");
  const [users, setUsers] = React.useState({ student1: "1234" });

  const handleLogin = () => {
    if (users[uid] && users[uid] === pw) onLogin(uid);
    else setError("아이디 또는 비밀번호가 올바르지 않아요");
  };

  const handleSignup = () => {
    if (!uid || !pw) return setError("아이디와 비밀번호를 입력하세요");
    if (users[uid]) return setError("이미 존재하는 아이디예요");
    setUsers({ ...users, [uid]: pw });
    setMode("login");
    setUid("");
    setPw("");
    setError("");
    alert("회원가입 완료!");
  };

  return (
    <div style={authBg}>
      <div style={authBox}>
        <h1>출결 관리</h1>
        <p style={subText}>
          {mode === "login"
            ? "로그인하고 출결을 관리하세요"
            : "회원가입 후 이용하세요"}
        </p>

        <input
          style={inputStyle}
          placeholder="아이디"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
        />
        <input
          style={{ ...inputStyle, marginTop: "14px" }}
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />

        {error && <p style={errorText}>{error}</p>}

        {mode === "login" ? (
          <>
            <TossButton onClick={handleLogin} style={{ marginTop: "20px" }}>
              로그인
            </TossButton>
            <TossButton
              variant="sub"
              onClick={() => setMode("signup")}
              style={{ marginTop: "12px" }}
            >
              회원가입
            </TossButton>
          </>
        ) : (
          <>
            <TossButton onClick={handleSignup} style={{ marginTop: "20px" }}>
              회원가입 완료
            </TossButton>
            <TossButton
              variant="sub"
              onClick={() => setMode("login")}
              style={{ marginTop: "12px" }}
            >
              로그인으로 돌아가기
            </TossButton>
          </>
        )}
      </div>
    </div>
  );
}

/* =======================
   출결 홈
======================= */
function Attendance({ user, onLogout }) {
  const TARGET = 8 * 60 * 60;
  const [working, setWorking] = React.useState(false);
  const [worked, setWorked] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    if (!working) return;
    const timer = setInterval(() => {
      setWorked((t) => Math.min(t + 1, TARGET));
    }, 1000);
    return () => clearInterval(timer);
  }, [working]);

  const todayPercent = Math.floor((worked / TARGET) * 100);

  return (
    <div style={pageBg}>
      <div style={header}>
        <h2>{user}님</h2>
        <TossButton
          variant="sub"
          style={{ width: "36px", height: "36px", padding: "0" }}
        >
          ●
        </TossButton>
      </div>

      {/* 출석 버튼 영역 */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {!expanded ? (
          <>
            <TossButton
              onClick={() => setWorking((p) => !p)}
              style={{
                flex: 1,
                background: working ? "#e5e8eb" : "#3182f6",
                color: working ? "#6b7684" : "#fff",
              }}
            >
              {working ? "출석중" : "출석하기"}
            </TossButton>

            <TossButton
              variant="sub"
              onClick={() => setExpanded(true)}
              style={{ width: "48px" }}
            >
              ⋮
            </TossButton>
          </>
        ) : (
          <>
            <TossButton
              variant="sub"
              onClick={() => setExpanded(false)}
              style={{ width: "48px" }}
            >
              {"<"}
            </TossButton>

            {["지각", "조퇴", "결석", "휴가"].map((t) => (
              <TossButton key={t} variant="sub">
                {t}
              </TossButton>
            ))}
          </>
        )}
      </div>

      <Card title="오늘 출결 현황" percent={todayPercent} />
      <Card title="총 출결 현황" percent={82} />

      <TossButton
        variant="sub"
        onClick={onLogout}
        style={{ marginTop: "16px" }}
      >
        로그아웃
      </TossButton>
    </div>
  );
}

/* =======================
   카드
======================= */
function Card({ title, percent }) {
  return (
    <div style={card}>
      <p style={cardTitle}>{title}</p>
      <p style={percentText}>{percent}%</p>
      <div style={barBg}>
        <div style={{ ...barFill, width: `${percent}%` }} />
      </div>
    </div>
  );
}

/* =======================
   App
======================= */
export default function App() {
  const [user, setUser] = React.useState(null);
  return user ? (
    <Attendance user={user} onLogout={() => setUser(null)} />
  ) : (
    <Auth onLogin={setUser} />
  );
}

/* =======================
   스타일
======================= */
const authBg = {
  height: "100vh",
  background: "#f4f6f8",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const authBox = {
  width: "360px",
  background: "#fff",
  padding: "32px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};
const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #e5e8eb",
  boxSizing: "border-box",
};
const subText = { color: "#6b7684", marginBottom: "24px" };
const errorText = { color: "#f04452", marginTop: "12px" };
const pageBg = { minHeight: "100vh", background: "#f4f6f8", padding: "24px" };
const header = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px",
};
const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "16px",
  marginBottom: "16px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
};
const cardTitle = { fontSize: "14px", color: "#6b7684" };
const percentText = { fontSize: "18px", fontWeight: "bold", margin: "8px 0" };
const barBg = {
  height: "10px",
  background: "#e5e8eb",
  borderRadius: "6px",
};
const barFill = {
  height: "100%",
  background: "#3182f6",
  transition: "width 0.4s ease",
};
