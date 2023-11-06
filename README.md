# Getting Started

วิธีการรันโปรเจค
1. เปลี่ยน Connection ในไฟล์ app/config/config.json ให้แก้ไขส่วน development ฟิลด์ username, password, database, dialect
โดย database คือชื่อฐานข้อมูล และ dialect เป็น postgres หรือ mysql, mariadb ตามที่มีในเครื่อง
หากยังไม่ติดตั้งฐานข้อมูลให้ใช้คำสั่ง `docker-compose up -d` ใน directory หลัก โดยปรับฟิลด์ username เป็น user_name@domain_name.com ส่วน password เป็น P@ssw0rd และ database เป็นชื่อที่สร้างใหม่

2. ติดตั้ง Package โดยใช้คำสั่ง `npm install`

3. รัน Project โดยใช้คำสั่ง `node server.js`

4. seed ข้อมูล โดย cd เข้าไปยังโฟลเดอร์ app และรันคำสั่ง `npx sequelize db:seed:all`

5. เปิด browser เข้า url http://localhost:8090