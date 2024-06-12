// Import các module cần thiết
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); // Import cors

// Khởi tạo ứng dụng express
const app = express();

app.use(cors());

// Sử dụng body-parser middleware để parse dữ liệu JSON
app.use(bodyParser.json());

// Cấu hình kết nối MySQL
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '05102003',
    database: 'cjec'
});

// Kết nối MySQL
db.connect(err => {
    if (err) {
        console.error('Không thể kết nối tới MySQL:', err);
        process.exit(1);
    }
    console.log('Đã kết nối tới MySQL');
});

// Thiết lập một endpoint để nhận dữ liệu từ ESP32
app.post('/data', (req, res) => {
    // Lấy dữ liệu từ request body
    const { taicheduoc, giay, racruoi, huuco } = req.body;

    // Kiểm tra dữ liệu
    if (taicheduoc == null || giay == null || racruoi == null || huuco == null) {
        return res.status(400).send('Dữ liệu không hợp lệ');
    }

    // Chèn dữ liệu vào bảng MySQL
    const query = 'INSERT INTO rac3 (taicheduoc, giay, racruoi, huuco) VALUES (?, ?, ?, ?)';
    db.query(query, [taicheduoc, giay, racruoi, huuco], (err, result) => {
        if (err) {
            console.error('Lỗi khi chèn dữ liệu vào MySQL:', err);
            return res.status(500).send('Lỗi server');
        }
        res.status(200).send('Dữ liệu đã được nhận và lưu trữ');
    });
});

// Thiết lập một endpoint để lấy dữ liệu từ MySQL
app.get('/data', (req, res) => {
  // Truy vấn dữ liệu từ cơ sở dữ liệu
  const query = 'select * FROM rac3 order by id DESC LIMIT 1;';

  db.query(query, (err, results) => {
      if (err) {
          console.error('Lỗi khi truy vấn dữ liệu từ MySQL:', err);
          return res.status(500).send('Lỗi server');
      }
      // Trả về kết quả dưới dạng JSON
      res.status(200).json(results);
  });
});


// Khởi động server tại cổng 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang lắng nghe tại cổng ${PORT}`);
});