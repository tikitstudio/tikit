const fs = require('fs');

const title = process.argv[2];
const content = process.argv[3];

if (!title || !content) {
  console.log("Usage: node create_notice.js \"제목\" \"내용\"");
  process.exit(1);
}

const filePath = "./notices.json";
let notices = [];

if (fs.existsSync(filePath)) {
  notices = JSON.parse(fs.readFileSync(filePath));
}

const now = new Date();
const id = now.getTime().toString();

const formatted = now.getFullYear() +
  "." +
  String(now.getMonth() + 1).padStart(2, "0") +
  "." +
  String(now.getDate()).padStart(2, "0") +
  " " +
  String(now.getHours()).padStart(2, "0") +
  ":" +
  String(now.getMinutes()).padStart(2, "0");

notices.unshift({
  id,
  title,
  date: formatted,
  content,
  unread: true
});

fs.writeFileSync(filePath, JSON.stringify(notices, null, 2), "utf-8");

console.log("Notice added!");
