# เข้าใจโลก เข้าใจคน — Global Understanding & Peace Learning Hub

เว็บไซต์ศูนย์กลางแหล่งเรียนรู้และพื้นที่เผยแพร่แนวคิด **Education for International Understanding (EIU)** และ **Global Citizenship Education (GCED)** เพื่อสร้าง "วัฒนธรรมแห่งสันติภาพ" ในบริบทสังคมไทย สำหรับ 4 กลุ่มเป้าหมายหลัก ได้แก่ ครูผู้สอน ผู้เรียน ผู้นำ/ผู้บริหารการศึกษา และประชาชนผู้สนใจทั่วไป

สร้างด้วย [Hugo](https://gohugo.io/) (Static Site Generator) ไม่ต้องใช้ backend หรือฐานข้อมูล และพร้อม deploy ขึ้น GitHub Pages ด้วย GitHub Actions

---

## สารบัญ

1. [โครงสร้างไฟล์](#โครงสร้างไฟล์)
2. [วิธีติดตั้ง Hugo](#วิธีติดตั้ง-hugo)
3. [วิธีรันในเครื่อง](#วิธีรันในเครื่อง)
4. [วิธี build](#วิธี-build)
5. [วิธีนำขึ้น GitHub](#วิธีนำขึ้น-github)
6. [วิธี deploy ด้วย GitHub Pages](#วิธี-deploy-ด้วย-github-pages)
7. [วิธีเพิ่มบทความใหม่](#วิธีเพิ่มบทความใหม่)
8. [วิธีเพิ่มทรัพยากรใหม่](#วิธีเพิ่มทรัพยากรใหม่)
9. [แนวทางแก้ไขสี ฟอนต์ เมนู และหน้าเว็บ](#แนวทางแก้ไขสี-ฟอนต์-เมนู-และหน้าเว็บ)
10. [วิธีแก้ไขข้อมูลผู้จัดทำ อีเมล และ Google Form](#วิธีแก้ไขข้อมูลผู้จัดทำ-อีเมล-และ-google-form)

---

## โครงสร้างไฟล์

```
gced-peace-hub/
├── hugo.toml                  # การตั้งค่าหลักของเว็บไซต์ (ชื่อ, tagline, อีเมล ฯลฯ)
├── README.md
├── .gitignore
├── .github/workflows/hugo.yml # Workflow สำหรับ deploy ขึ้น GitHub Pages
├── archetypes/
│   └── default.md             # แม่แบบ front matter เวลาสร้างเนื้อหาใหม่ด้วย hugo new
├── assets/
│   ├── css/main.css           # สไตล์ทั้งหมด (ใช้ CSS variables)
│   └── js/main.js             # JavaScript ทั้งหมด (Vanilla JS)
├── data/
│   ├── navigation.yaml        # เมนูหลักและเมนู footer
│   ├── resources.yaml         # รายการทรัพยากรในหน้า /resources/
│   └── featured.yaml          # เนื้อหาแนะนำบนหน้าแรก
├── layouts/
│   ├── baseof.html            # โครง HTML หลักของทุกหน้า
│   ├── home.html              # หน้าแรก
│   ├── list.html              # หน้ารายการ (ค่าเริ่มต้น)
│   ├── single.html            # หน้าเนื้อหาเดี่ยว (ค่าเริ่มต้น)
│   ├── _partials/             # ส่วนประกอบที่ใช้ซ้ำ (header, footer, การ์ด ฯลฯ)
│   ├── _shortcodes/           # shortcode: callout, button
│   ├── classroom/             # layout เฉพาะห้องเรียนสันติภาพ (มีตัวกรอง)
│   ├── learn/                 # layout เรียนรู้ด้วยตนเอง (มี scenario/quiz)
│   ├── resources/             # layout คลังทรัพยากร (มีค้นหา/กรอง)
│   ├── policy/                # layout นโยบายและงานวิจัย
│   ├── stories/               # layout เรื่องเล่า (Peace Story Cards)
│   └── creator/               # layout หน้าผู้จัดทำเว็บไซต์
├── content/                   # เนื้อหาทั้งหมด (Markdown)
│   ├── _index.md              # หน้าแรก
│   ├── about-gced/            # เข้าใจ EIU/GCED
│   ├── classroom/             # แผนการสอน 3 เรื่อง
│   ├── learn/                 # บทเรียนสั้น 3 เรื่อง
│   ├── resources/             # คลังทรัพยากร
│   ├── policy/                # Policy Brief 3 เรื่อง + โมเดล/แบบประเมิน/Roadmap
│   ├── stories/               # เรื่องเล่า 4 เรื่อง
│   ├── community/             # ชุมชนการเรียนรู้
│   ├── news/                  # ข่าว/กิจกรรม 4 รายการ
│   ├── about/                 # เกี่ยวกับโครงการ
│   └── creator/               # เกี่ยวกับผู้จัดทำเว็บไซต์
└── static/
    ├── favicon.svg
    ├── robots.txt
    └── images/                # ภาพ placeholder (SVG)
```

## วิธีติดตั้ง Hugo

เว็บไซต์นี้ทดสอบกับ **Hugo Extended v0.163.3** (ต้องใช้ v0.158 ขึ้นไป — แนะนำเวอร์ชันล่าสุด)

- **Windows:** `winget install Hugo.Hugo.Extended` หรือดาวน์โหลดจาก https://github.com/gohugoio/hugo/releases
- **macOS:** `brew install hugo`
- **Linux (Debian/Ubuntu):** `sudo apt install hugo` (หากเวอร์ชันเก่า ให้ดาวน์โหลด .deb จาก GitHub Releases)

ตรวจสอบการติดตั้ง:

```bash
hugo version
```

## วิธีรันในเครื่อง

```bash
cd gced-peace-hub
hugo server
```

จากนั้นเปิดเบราว์เซอร์ที่ `http://localhost:1313` — Hugo จะรีโหลดหน้าอัตโนมัติเมื่อแก้ไฟล์

## วิธี build

```bash
hugo
```

ไฟล์เว็บไซต์ทั้งหมดจะถูกสร้างไว้ในโฟลเดอร์ `public/` พร้อมนำไปวางบนเว็บเซิร์ฟเวอร์ใดก็ได้ (build แบบย่อไฟล์: `hugo --minify`)

## วิธีนำขึ้น GitHub

1. สร้าง repository ใหม่บน GitHub (เช่นชื่อ `gced-peace-hub`)
2. ในโฟลเดอร์โปรเจกต์ รันคำสั่ง:

```bash
git init
git add .
git commit -m "เริ่มต้นเว็บไซต์ เข้าใจโลก เข้าใจคน"
git branch -M main
git remote add origin https://github.com/<ชื่อผู้ใช้>/gced-peace-hub.git
git push -u origin main
```

## วิธี deploy ด้วย GitHub Pages

โปรเจกต์นี้มี workflow เตรียมไว้แล้วที่ `.github/workflows/hugo.yml`

1. push โค้ดขึ้น branch `main` ตามขั้นตอนด้านบน
2. ไปที่ repository บน GitHub → **Settings → Pages**
3. ที่หัวข้อ **Build and deployment → Source** เลือก **GitHub Actions**
4. กลับไปที่แท็บ **Actions** — workflow "Deploy Hugo site to GitHub Pages" จะรันอัตโนมัติ (หรือกด Run workflow เองได้)
5. เมื่อรันสำเร็จ เว็บไซต์จะเปิดได้ที่ `https://<ชื่อผู้ใช้>.github.io/gced-peace-hub/`

> หมายเหตุ: workflow จะตั้งค่า `baseURL` ให้ตรงกับ URL ของ GitHub Pages โดยอัตโนมัติ ไม่ต้องแก้ `hugo.toml` เอง

## วิธีเพิ่มบทความใหม่

ตัวอย่าง: เพิ่มข่าวใหม่

```bash
hugo new content news/ชื่อไฟล์ภาษาอังกฤษ.md
```

จากนั้นแก้ไข front matter และเนื้อหา แล้วเปลี่ยน `draft: true` เป็น `draft: false` (หรือลบบรรทัดนี้ออก) เมื่อพร้อมเผยแพร่

- **บทเรียนใหม่** → สร้างไฟล์ใน `content/learn/`
- **เรื่องเล่าใหม่** → สร้างไฟล์ใน `content/stories/` (ใส่ `params: source:` เพื่อระบุแหล่งเรื่องเล่า เช่น "เรื่องเล่าจากโรงเรียน")
- **Policy Brief ใหม่** → สร้างไฟล์ใน `content/policy/`
- **แผนการสอนใหม่** → สร้างไฟล์ใน `content/classroom/` โดยใช้ front matter ตามตัวอย่างไฟล์เดิม (title, description, grade, duration, subjects, themes, resource_type, download_label, difficulty, date)

## วิธีเพิ่มทรัพยากรใหม่

รายการในหน้า **คลังทรัพยากร** (`/resources/`) มาจากไฟล์ `data/resources.yaml` เพิ่มรายการใหม่ต่อท้าย `items:` ตามรูปแบบ:

```yaml
  - title: "ชื่อทรัพยากร"
    description: "คำอธิบายสั้น ๆ"
    type: "worksheet"            # lesson-plan | worksheet | infographic | teacher-guide | rubric | policy-brief
    type_label: "ใบงาน"          # ป้ายที่แสดงบนการ์ด
    audience: "teacher"          # teacher | learner | leader | public
    level: "secondary"           # primary | secondary | all
    theme: "ความหลากหลาย"
    url: "/resources/"           # ลิงก์ปลายทาง
```

หากต้องการให้ทรัพยากรขึ้นหน้าแรก ให้เพิ่มใน `data/featured.yaml` ด้วย

## แนวทางแก้ไขสี ฟอนต์ เมนู และหน้าเว็บ

- **สี** — แก้ที่ CSS variables ด้านบนสุดของ `assets/css/main.css` (บล็อก `:root`) เช่น `--color-blue`, `--color-gold` การแก้ที่เดียวจะมีผลทั้งเว็บไซต์
- **ฟอนต์** — แก้ตัวแปร `--font-body` ใน `assets/css/main.css` และแก้ลิงก์ Google Fonts ใน `layouts/_partials/head.html`
- **ขนาดตัวอักษรพื้นฐาน** — แก้ `--font-size-base` (ค่าเริ่มต้น 18px)
- **เมนูหลักและเมนู footer** — แก้ไฟล์ `data/navigation.yaml` (เพิ่ม/ลบ/เรียงลำดับได้ทันที ไม่ต้องแก้ HTML)
- **ชื่อเว็บไซต์ / tagline / อีเมลติดต่อ** — แก้ในไฟล์ `hugo.toml` ส่วน `[params]`
- **หน้าแรก** — โครงหน้าอยู่ที่ `layouts/home.html` ส่วนเนื้อหาแนะนำอยู่ที่ `data/featured.yaml`
- **ส่วนประกอบที่ใช้ซ้ำ** (header, footer, การ์ด, จดหมายข่าว ฯลฯ) — อยู่ใน `layouts/_partials/`

## วิธีแก้ไขข้อมูลผู้จัดทำ อีเมล และ Google Form

หน้า **เกี่ยวกับผู้จัดทำเว็บไซต์** อยู่ที่ URL `/creator/`

- **เนื้อหาหน้า** — แก้ไฟล์ `content/creator/_index.md`
- **การ์ดโปรไฟล์และปุ่มติดต่อ** — แก้ไฟล์ `layouts/creator/list.html`
- **อีเมลติดต่อ** — แก้ค่า `contactEmail` ใน `hugo.toml` (มีผลทั้ง footer, หน้า about และหน้า creator พร้อมกัน)
- **ลิงก์ Google Form** — เปิดไฟล์ `layouts/creator/list.html` หาบรรทัดที่มี comment:

  ```html
  <!-- TODO: Replace # with the actual Google Form URL when available. -->
  <a class="btn btn-secondary" href="#" ...>แจ้งข้อเสนอแนะผ่าน Google Form</a>
  ```

  แล้วแทนที่ `href="#"` ด้วย URL ของ Google Form จริง และแก้ข้อความ "ลิงก์แบบฟอร์มเสนอแนะ (Google Form): [จะเพิ่มเติมภายหลัง]" ตามต้องการ

---

## หมายเหตุด้านเนื้อหา

เนื้อหาบนเว็บไซต์เรียบเรียงเพื่อการศึกษา จุดที่เกี่ยวข้องกับข้อมูลทางวิชาการควรเชื่อมโยงแหล่งอ้างอิงจริงจาก UNESCO, APCEIU หรือหน่วยงานการศึกษาที่เกี่ยวข้องในขั้นตอน Editorial Review ก่อนนำไปใช้อ้างอิงต่อ
