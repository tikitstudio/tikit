// create_notice.js
// Node.js로 실행:  node create_notice.js

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const filePath = path.join(__dirname, "notices.json");

function loadNotices() {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf8").trim() || "[]";
  return JSON.parse(raw);
}

function saveNotices(list) {
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf8");
  console.log("\n✅ notices.json 저장 완료!");
}

function makeId(existingList) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  // 같은 날에 이미 몇 개 있는지 카운트
  const prefix = `${yyyy}${mm}${dd}`;
  const sameDay = existingList.filter((n) => n.id.startsWith(prefix));
  const nextIndex = sameDay.length + 1;
  const indexStr = String(nextIndex).padStart(2, "0");

  return `${prefix}-${indexStr}`; // 예: 20250201-01
}

function makeDateString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

async function main() {
  const notices = loadNotices();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function q(prompt) {
    return new Promise((resolve) => rl.question(prompt, resolve));
  }

  const title = await q("제목을 입력하세요: ");
  const content = await q("내용을 입력하세요: ");
  const importantAns = await q("중요 공지인가요? (y/N): ");
  const imageUrl = await q("이미지 URL (없으면 Enter): ");

  rl.close();

  const id = makeId(notices);
  const date = makeDateString();
  const important =
    importantAns.trim().toLowerCase() === "y" ||
    importantAns.trim().toLowerCase() === "yes";

  const newNotice = {
    id,
    title,
    date,
    content,
    important,
    imageUrl,
  };

  notices.unshift(newNotice); // 최신 공지를 맨 앞에 추가
  saveNotices(notices);

  console.log("\n새 공지 추가됨:");
  console.log(newNotice);
}

main().catch((err) => {
  console.error(err);
});
