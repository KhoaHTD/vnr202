# Âm thanh tư liệu

| File | Nội dung | Nguồn | Trạng thái |
|---|---|---|---|
| `assets/audio/bac-ho-tuyen-ngon-doc-lap.mp3` (5,5 MB, ~7 phút 24 giây) | Giọng đọc Tuyên ngôn Độc lập | Video YouTube `HoQGmxclst8` ("bạn có thể nghe hết 7 phút khi Bác Hồ đọc bản tuyên ngôn độc lập không?", kênh Chuối Roblox), https://www.youtube.com/watch?v=HoQGmxclst8 | **Nhóm phải xác minh**: đây là bản đăng lại của một kênh cá nhân, chưa rõ nguồn gốc bản ghi và quyền sử dụng. Nên thay bằng bản gốc từ kho lưu trữ chính thức (Đài Tiếng nói Việt Nam, Trung tâm Lưu trữ quốc gia) và ghi nguồn trước khi phát hành. |

Game chưa phát file giọng đọc này; chỉ mới lưu sẵn.

## Nhạc nền theo cảnh

Phát bằng `src/js/bgm.js`, chỉ khi người chơi bật loa. Đặt file vào `assets/audio/bgm/` đúng tên dưới đây; thiếu file thì game bỏ qua, không lỗi.

| File | Cảnh | Bài | Nguồn | Giấy phép |
|---|---|---|---|---|
| `landing.mp3` | Trang đầu | "Eternal Hope" – Kevin MacLeod | https://incompetech.com (ISRC USUAN1100238) | CC BY 4.0 |
| `chuong-1.mp3` | Chương I · 1930–1935 | "Long Road Ahead" – Kevin MacLeod | https://incompetech.com (ISRC USUAN1100588) | CC BY 4.0 |
| `chuong-2.mp3` | Chương II · 1936–1939 | "Lasting Hope" – Kevin MacLeod | https://incompetech.com (ISRC USUAN1100178) | CC BY 4.0 |
| `chuong-3.mp3` | Chương III · chặng 5–8 | "Ascending the Vale" – Kevin MacLeod | https://incompetech.com (ISRC USUAN1600064) | CC BY 4.0 |
| `tran-dau-cuoi.mp3` | Chặng 9 · màn trùm | "Mười chín tháng Tám" (Xuân Oanh), bản hòa tấu; **hoặc** "Heroic Age" – Kevin MacLeod (ISRC USUAN1100848) | Nhóm ghi rõ bản thu đã dùng | xem lưu ý |

Ghi công bắt buộc cho nhạc Kevin MacLeod: `"<Tên bài>" Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0`. Màn kết quả cuối game đã có dòng ghi công.

**Lưu ý "Mười chín tháng Tám":** quyền tác giả còn hiệu lực (nhạc sĩ Xuân Oanh mất năm 2003), bản thu còn có quyền liên quan của đơn vị sản xuất. Dùng trong lớp, không thương mại có thể thuộc ngoại lệ dùng cho giảng dạy (Luật SHTT, Điều 25), nhưng **không phát hành công khai** khi chưa xin phép. Không chắc thì dùng "Heroic Age". Nếu đổi bài, sửa dòng ghi công trong `src/js/ui.js` (`end-credit`).
