# Reseter TTS Converter - Tài liệu kỹ thuật

## 1. Kiến trúc tổng quan

Reseter TTS Converter là một tiện ích mở rộng Chrome cho phép chuyển đổi văn bản thành giọng nói, được xây dựng dựa trên:
- APIs TTS từ nhiều nhà cung cấp (FreeTTS và OpenAITTS)
- Chrome Extension API để tương tác với trình duyệt
- Hỗ trợ tối ưu hóa văn bản với AI

### Kiến trúc hệ thống

```
┌─────────────────┐      ┌────────────────┐      ┌───────────────────┐
│ Chrome Extension│ ──▶ │ Content Script │ ──▶ │ API Services       │
│ (Popup UI)      │ ◀── │ (Context Menu) │ ◀── │ (FreeTTS/OpenAITTS)│
└─────────────────┘      └────────────────┘      └───────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐      ┌────────────────┐      ┌───────────────────┐
│ Chrome Storage  │      │ Audio Player   │      │ AI Optimization   │
│ (User Settings) │      │ (UI Component) │      │ (Text Processing) │
└─────────────────┘      └────────────────┘      └───────────────────┘
```

![Demo 1](./demo/1.png)

Reseter TTS Converter là một tiện ích mở rộng cho Chrome cho phép chuyển đổi văn bản thành giọng nói dễ dàng. Dự án sử dụng các nhà cung cấp như FreeTTS và OpenAITTS để thực hiện chuyển đổi, kèm theo giao diện người dùng đơn giản và hiện đại.

## Lưu ý quan trọng

- **Lần đầu sử dụng**: Bạn phải mở popup cài đặt ít nhất một lần bằng cách nhấn vào biểu tượng tiện ích trên thanh công cụ Chrome trước khi thực hiện bất kỳ chuyển đổi nào. Điều này giúp khởi tạo các cấu hình cần thiết và đảm bảo tiện ích hoạt động ổn định.

## Tính năng

- Chuyển đổi văn bản thành giọng nói trực tiếp trên trình duyệt.
- Hỗ trợ nhiều nhà cung cấp với cấu hình mặc định được thiết lập sẵn.
- Giao diện cài đặt dễ sử dụng với các tùy chọn thay đổi ngôn ngữ, tốc độ nói và giọng đọc.
- Hiển thị audio-player hiện đại với hiệu ứng animation và khả năng đóng nhanh gọn.
- Tự động lưu và tải cấu hình người dùng thông qua Chrome Storage.
- Tối ưu hóa văn bản với AI để chuẩn hóa nội dung, loại bỏ thông tin thừa và sửa lỗi chính tả trước khi chuyển đổi.

## Cài đặt

1. Tải về hoặc clone repository này về máy.
2. Mở Chrome và truy cập trang [chrome://extensions](chrome://extensions).
3. Bật chế độ "Developer mode" (Chế độ dành cho nhà phát triển).
4. Chọn "Load unpacked" và chọn thư mục project chứa file manifest.json.
5. Sau khi cài đặt, biểu tượng tiện ích sẽ xuất hiện trên trình duyệt.

![Demo 2](./demo/2.png)

## Cấu hình

Khi mở cửa sổ popup cài đặt:
- Người dùng có thể lựa chọn giữa các nhà cung cấp chuyển đổi (FreeTTS và OpenAITTS).
- Thay đổi tốc độ nói bằng thanh trượt điều chỉnh.
- Chọn ngôn ngữ (VI cho tiếng Việt, EN cho tiếng Anh) thông qua dropdown.
- Bật/tắt tính năng tối ưu hóa văn bản bằng AI, giúp chuẩn hóa nội dung trước khi chuyển đổi thành giọng nói.
- Các cấu hình mặc định được lưu trữ trên Chrome Storage để giữ nguyên khi đóng mở tiện ích.

## Cách sử dụng

1. **Lần đầu cài đặt**: Sau khi cài đặt tiện ích, bạn cần mở popup cài đặt bằng cách nhấn vào biểu tượng tiện ích trên thanh công cụ Chrome. Việc này giúp khởi tạo các cấu hình ban đầu và đảm bảo tiện ích hoạt động ổn định.

2. Khi tiện ích được kích hoạt, người dùng có thể bôi đen văn bản cần chuyển đổi, sau đó click chuột phải để mở context menu và chọn "Speak with Reseter TTS Converter".
3. Nếu quá trình chuyển đổi đang diễn ra, audio-player sẽ hiển thị trạng thái loading.
4. Người dùng có thể nhấn nút "Save Settings" trên popup để lưu cấu hình đã thay đổi.
5. Nếu cần hủy chuyển đổi, có thể nhấn nút "Close" trên audio-player để dừng và đóng cửa sổ phát.
6. Khi bật tính năng "Optimize Text With AI", văn bản sẽ được tự động làm sạch và chuẩn hóa trước khi chuyển đổi, giúp cải thiện chất lượng đầu ra của giọng nói.

## Nhà cung cấp

- **FreeTTS**  
  - URL: `https://genai-reseter.servernux.com/api/v2/ttsv2-gen`  
  - Mặc định: tốc độ nói 1.0, giọng đọc là "1", ngôn ngữ là "vi"
  - Hỗ trợ tối ưu hóa văn bản với AI

- **OpenAITTS**  
  - URL: `https://genai-reseter.servernux.com/api/v2/ttsv1-gen`  
  - Mặc định: tốc độ nói 1.0, giọng đọc là "OA001"
  - Hỗ trợ tối ưu hóa văn bản với AI

## Hướng dẫn phát triển

- Các file chính trong dự án:
  - **manifest.json:** Định nghĩa cấu hình tiện ích.
  - **popup.html:** Giao diện cài đặt của tiện ích.
  - **assets/main.js:** Xử lý các thao tác liên quan đến cấu hình và giao diện.
  - **assets/content.js:** Tích hợp audio-player vào trang web.
- Mọi thay đổi cần được kiểm tra trên Chrome ở chế độ "developer mode".

## Đóng góp

Nếu bạn có ý kiến đóng góp hoặc muốn báo lỗi, hãy mở issue hoặc gửi pull request trên GitHub. Mọi ý kiến phản hồi sẽ được đón nhận nhiệt tình để cải thiện dự án.

## Tài liệu tham khảo

- [Make A README](https://www.makeareadme.com/)
- [banesullivan/README](https://github.com/banesullivan/README)
- [Awesome README](https://github.com/pottekkat/awesome-readme)

## Giấy phép

Dự án này được cấp giấy phép theo [MIT License](https://opensource.org/licenses/MIT).

## FAQ - Các câu hỏi thường gặp

### Vấn đề cài đặt

#### 1. Extension không hoạt động sau khi cài đặt
**Nguyên nhân**: Extension chưa được khởi tạo cấu hình ban đầu.

**Giải pháp**: Sau khi cài đặt, bạn cần mở popup cài đặt bằng cách nhấn vào biểu tượng tiện ích trên thanh công cụ Chrome ít nhất một lần. Thao tác này giúp khởi tạo các cấu hình cần thiết.

#### 2. Không tìm thấy extension trong trình duyệt
**Nguyên nhân**: Cài đặt không thành công hoặc extension bị ẩn.

**Giải pháp**: 
- Kiểm tra lại quá trình cài đặt theo các bước trong README
- Nhấn vào biểu tượng "puzzle" trên thanh công cụ Chrome để xem các extension đã cài đặt
- Nhấn vào biểu tượng ghim để ghim extension lên thanh công cụ

### Vấn đề chuyển đổi văn bản thành giọng nói

#### 3. Không thể chuyển đổi văn bản thành giọng nói
**Nguyên nhân**: Có thể do nhiều yếu tố bao gồm vấn đề kết nối mạng, lỗi API, hoặc vấn đề với cấu hình.

**Giải pháp**:
- Kiểm tra kết nối internet
- Kiểm tra xem bạn đã mở popup cài đặt ít nhất một lần chưa
- Thử chuyển đổi nhà cung cấp dịch vụ (từ FreeTTS sang OpenAITTS hoặc ngược lại)
- Đảm bảo văn bản được chọn không quá dài (thử với đoạn văn ngắn hơn)

#### 4. Tính năng tối ưu hóa văn bản với AI không hoạt động
**Nguyên nhân**: Lỗi kết nối đến API AI hoặc server bị quá tải.

**Giải pháp**:
- Tắt tính năng tối ưu hóa văn bản với AI và thử lại
- Kiểm tra kết nối internet
- Thử lại sau một thời gian khi server ít tải hơn

### Vấn đề âm thanh

#### 5. Âm thanh không phát sau khi chuyển đổi
**Nguyên nhân**: Vấn đề với AudioContext hoặc định dạng âm thanh không tương thích.

**Giải pháp**:
- Tải lại trang web hiện tại
- Đảm bảo trình duyệt không bị tắt tiếng
- Kiểm tra xem trang web có chặn autoplay không
- Thử sử dụng nhà cung cấp TTS khác

#### 6. Âm thanh bị ngắt quãng hoặc không rõ ràng
**Nguyên nhân**: Tốc độ nói quá nhanh hoặc vấn đề về tài nguyên hệ thống.

**Giải pháp**:
- Điều chỉnh giảm tốc độ nói trong cài đặt
- Đóng bớt các tab và ứng dụng không cần thiết
- Thử làm mới trang và chuyển đổi lại

#### 7. Trình phát âm thanh không xuất hiện hoặc biến mất đột ngột
**Nguyên nhân**: Xung đột với các script khác trên trang hoặc lỗi khi hiển thị UI.

**Giải pháp**:
- Tải lại trang web
- Thử trên một trang web khác
- Kiểm tra xem có extension khác can thiệp vào DOM không

### Vấn đề cấu hình

#### 8. Cài đặt không được lưu giữa các phiên
**Nguyên nhân**: Vấn đề với Chrome Storage hoặc xung đột cấu hình.

**Giải pháp**:
- Đảm bảo bạn đã nhấn nút "Save Settings" sau khi thay đổi
- Xóa dữ liệu của extension và thiết lập lại từ đầu:
  - Truy cập chrome://extensions
  - Tìm Reseter TTS Converter
  - Nhấp vào "Chi tiết" rồi "Xóa dữ liệu"
  - Khởi động lại extension

#### 9. Không thể thay đổi giọng đọc hoặc ngôn ngữ
**Nguyên nhân**: Cấu hình không phù hợp với nhà cung cấp được chọn.

**Giải pháp**:
- Lưu ý rằng tùy chọn ngôn ngữ chỉ khả dụng với FreeTTS
- Đảm bảo bạn đã chọn nhà cung cấp phù hợp với tùy chọn muốn thay đổi
- Khởi động lại extension và thử lại

### Vấn đề tương thích

#### 10. Extension không hoạt động trên một số trang web
**Nguyên nhân**: Chính sách bảo mật của trang hoặc xung đột với JavaScript.

**Giải pháp**:
- Kiểm tra quyền truy cập của extension (cần "activeTab" và "contextMenus")
- Thử trên các trang web khác để xem vấn đề có phổ biến không
- Một số trang có thể có chính sách CSP (Content Security Policy) nghiêm ngặt hạn chế các script bên ngoài

#### 11. Extension hoạt động chập chờn trên các phiên bản Chrome cũ
**Nguyên nhân**: Các tính năng mới không tương thích với phiên bản Chrome cũ.

**Giải pháp**:
- Cập nhật Chrome lên phiên bản mới nhất
- Nếu không thể cập nhật, hãy thử sử dụng các tính năng cơ bản (tắt tối ưu hóa AI)

## Liên hệ

Nếu có bất kỳ thắc mắc hay góp ý nào, vui lòng liên hệ theo địa chỉ email của dự án.
