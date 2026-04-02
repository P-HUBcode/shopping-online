const MyConstants = {
  // Thay thế bằng chuỗi kết nối thực tế từ Cluster 'qlsanphamcluster' của bạn
  DB_SERVER: 'qlsanphamcluster.3ltryjd.mongodb.net', 
  DB_USER: 'phu47008', // Đảm bảo user này có quyền vào cluster mới
  DB_PASS: 'phu47008',
  // QUAN TRỌNG: Phải đổi tên này cho đúng với database có dữ liệu trong hình Compass
  DB_DATABASE: 'QLSanpham', 
  
  EMAIL_USER: 'phu47008@gmail.com',
  EMAIL_PASS: 'uqlp bisy ywkq tqdz', // App Password của Gmail
  JWT_SECRET: 'b88953d90316533457629e2792203f08df417f09ef6bec5aab976300d82392019a117e8aa973db5d21c389cae447ed8e66fc4f3fb2c90d4dfc3c90f20a',
  JWT_EXPIRES: '3600000', // 1h
};

module.exports = MyConstants;