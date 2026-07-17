# Bài tập về nhà — Kỹ sư Full Stack (Take-Home Exercise — Full Stack Engineer)

## Lát cắt Danh sách/Chi tiết Công việc (Job List/Detail Slice)

### Giới hạn thời gian (Timebox)
Vui lòng dành không quá 90 phút. Chúng tôi đánh giá việc triển khai rõ ràng, phạm vi an toàn, giao tiếp và chất lượng cơ bản. Nếu bạn hết thời gian, hãy dừng lại và viết những gì bạn sẽ làm tiếp theo.

### Tình huống (Scenario)
Một ứng dụng web hiển thị các công việc xử lý dữ liệu nền (background data processing jobs). Người dùng cần một trang đơn giản để xem các công việc gần đây và hiểu liệu mỗi công việc đang chờ (queued), đang chạy (running), đã thành công (succeeded), hay đã thất bại (failed).

Giả sử API phác thảo này tồn tại:

```http
GET /jobs
GET /jobs/{job_id}
```

Một công việc (job) có các trường sau:

```json
{
 "id": "job_123",
 "status": "queued | running | succeeded | failed",
 "created_at": "2026-07-03T09:00:00Z",
 "finished_at": null,
 "last_error": null
}
```

Lưu ý: API không hoàn toàn đáng tin cậy. Giả sử đôi khi nó có thể trả về một giá trị `status` (trạng thái) nằm ngoài bốn giá trị được liệt kê, hoặc một công việc có `finished_at` (thời gian hoàn thành) được thiết lập trong khi `status` vẫn đang là "running" (đang chạy). Việc triển khai của bạn không được gặp lỗi (crash) vì điều này và nên đưa ra một lựa chọn có chủ ý, rõ ràng về những gì sẽ hiển thị.

### Ngăn xếp công nghệ ưu tiên (Preferred stack)
Sử dụng React hoặc Vue cho frontend. Sử dụng FastAPI hoặc một API giả (mocked API) nếu việc thiết lập backend vượt quá giới hạn thời gian. Không yêu cầu PostgreSQL cho bài tập này.

### Sử dụng công cụ AI (AI tool use)
Bạn có thể sử dụng các công cụ AI (Copilot, ChatGPT, hoặc tương tự) trong khi hoàn thành bài tập này, giống như cách bạn làm trong công việc. Trong buổi phỏng vấn đánh giá, bạn sẽ được yêu cầu giải thích và sửa đổi bất kỳ phần nào trong bài nộp của bạn — bao gồm cả những phần mà công cụ AI đã hỗ trợ tạo ra — bằng lời của chính bạn. Điều quan trọng là bạn hiểu và kiểm soát được kết quả, chứ không phải ai đã gõ nó.

### Yêu cầu bàn giao (Deliverables)
Nộp một repository, gist, tệp zip, hoặc tài liệu nhỏ chứa:
1. Một triển khai tối thiểu cho lát cắt danh sách/chi tiết công việc (phải chạy được — không gửi các bài nộp chỉ có mã giả (pseudocode)).
2. Các hành vi hiển thị cơ bản khi tải (loading), trống (empty), lỗi (error), và công việc thất bại (failed-job).
3. Ít nhất một bài kiểm thử tự động (kiểm thử đơn vị - unit test hoặc kiểm thử thành phần - component test), cộng với một ghi chú ngắn giải thích các giả định và bất kỳ kiểm thử thủ công bổ sung nào.
4. Một hoặc hai cải tiến tiếp theo mà bạn sẽ thực hiện nếu có thêm thời gian.

### Hướng dẫn phạm vi (Scope guidance)

**Phạm vi tốt (Nên làm):**
- Trang danh sách công việc (job list page);
- Hiển thị chi tiết công việc (job detail display);
- Huy hiệu trạng thái hoặc văn bản trạng thái (status badge or status text);
- Thông báo lỗi của công việc thất bại (failed-job error message);
- Các trạng thái đang tải/lỗi/trống (loading/error/empty states);
- Xác thực đơn giản về hình dạng của phản hồi API (simple validation of API response shape);
- Xử lý giá trị trạng thái không xác định hoặc mốc thời gian không nhất quán mà không bị lỗi (unrecognized status value or inconsistent timestamps handled without crashing).

**Ngoài phạm vi (Không cần làm):**
- Xác thực người dùng (authentication);
- Logic thử lại (retry logic);
- Triển khai (deployment);
- Phân quyền vai trò (role permissions);
- Thiết kế hàng đợi phức tạp (complex queue design);
- Lược đồ cơ sở dữ liệu đầy đủ (full database schema);
- Hệ thống thiết kế UI lớn (large UI design system).
