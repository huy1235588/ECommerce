---
title: "Obsidian Setup Guide for My Digital Collection"
type: setup-guide
category: documentation
created: "2024-09-06"
updated: "2024-09-06"
tags:
    - obsidian
    - setup
    - documentation
    - workflow
aliases:
    - "Obsidian Configuration"
    - "Documentation Workflow"
status: active
maintainer: "Documentation Team"
---

# Obsidian Setup Guide for My Digital Collection

> [!abstract] Guide Overview
> Hướng dẫn chi tiết setup Obsidian vault cho dự án My Digital Collection với focus vào documentation workflow hiệu quả.

## 📋 Mục Lục

-   [[#Cài Đặt & Thiết Lập Cơ Bản]]
-   [[#Cấu Hình Vault]]
-   [[#Plugins Cần Thiết]]
-   [[#Thiết Lập Template]]
-   [[#Cấu Hình Quy Trình Làm Việc]]
-   [[#Thực Hành Tốt Nhất]]

## 🚀 Cài Đặt & Thiết Lập Cơ Bản

### Bước 1: Cài Đặt Obsidian

1. Tải về từ [obsidian.md](https://obsidian.md)
2. Cài đặt theo hệ điều hành của bạn
3. Khởi chạy ứng dụng

### Bước 2: Tạo/Mở Vault

> [!tip] Vault Location
> Sử dụng folder `docs/` của project làm vault root.

```bash
# Navigate to project docs folder
cd e:\Project\SpringBoot\MyDigitalCollection\docs

# Open this folder as Obsidian vault
# File → Open Folder as Vault → Chọn thư mục docs
```

## ⚙️ Cấu Hình Vault

### Thiết Lập Cốt Lõi

> [!note] Thiết Lập Được Khuyến Nghị
> Settings → Options → Cấu hình những thiết lập cần thiết.

#### Files & Links

-   **New link format**: `[[Wikilink]]`
-   **Use `[[Wikilink]]`**: Bật
-   **Automatically update internal links**: Bật
-   **Default location for new attachments**: `assets/images/`

#### Editor

-   **Default editing mode**: Live Preview
-   **Line numbers**: Bật
-   **Word wrap**: Bật
-   **Spell check**: Bật (ngôn ngữ của bạn)

#### Appearance

-   **Theme**: Dark mode (khuyến nghị)
-   **Base color scheme**: Adaptive to system

## 🔌 Plugins Cần Thiết

> [!warning] Plugins Bắt Buộc
> Cài đặt những plugins này từ Settings → Community Plugins.

### Core Plugins (Bật Tất Cả)

-   [x] **Backlinks** - Xem kết nối giữa các ghi chú
-   [x] **Command palette** - Lệnh nhanh (Ctrl/Cmd+P)
-   [x] **File explorer** - Thanh điều hướng bên
-   [x] **Graph view** - Hiển thị kết nối giữa các ghi chú
-   [x] **Quick switcher** - Điều hướng ghi chú nhanh (Ctrl/Cmd+O)
-   [x] **Search** - Tìm kiếm toàn văn
-   [x] **Tag pane** - Tổ chức tag

### Community Plugins (Phải Cài Đặt)

| Plugin              | Mục Đích                     | Cấu Hình                            |
| ------------------- | ---------------------------- | ----------------------------------- |
| **Templater**       | Công cụ template với biến    | Template folder: `assets/templates` |
| **Dataview**        | Truy vấn nội dung động       | Bật JavaScript                      |
| **Advanced Tables** | Chỉnh sửa bảng nâng cao      | Tự động định dạng bảng              |
| **Obsidian Git**    | Tích hợp kiểm soát phiên bản | Tự động commit mỗi 10 phút          |
| **Calendar**        | Điều hướng theo ngày         | Hiển thị trên thanh bên             |

### Plugins Tùy Chọn (Khuyến Nghị)

| Plugin           | Mục Đích                        | Trường Hợp Sử Dụng          |
| ---------------- | ------------------------------- | --------------------------- |
| **Mind Map**     | Lập kế hoạch trực quan          | Lập kế hoạch kiến trúc      |
| **Excalidraw**   | Sơ đồ vẽ tay                    | Wireframes, phác thảo       |
| **Kanban**       | Bảng dự án                      | Quản lý tác vụ              |
| **Recent Files** | Truy cập nhanh các file gần đây | Hiệu quả quy trình làm việc |

## 📝 Thiết Lập Template

### Cấu Hình Plugin Templater

> [!example] Cấu Hình Templater
> Settings → Templater → Cấu hình như sau:

#### Thiết Lập Cơ Bản

-   **Template folder location**: `assets/templates`
-   **Trigger Templater on new file creation**: Bật
-   **Enable Folder Templates**: Bật
-   **Startup templates**: Tắt

#### Phím Tắt Template

| Template              | Phím Tắt       | Lệnh                                               |
| --------------------- | -------------- | -------------------------------------------------- |
| API Documentation     | `Ctrl+Shift+A` | `Templater: Insert api-documentation-template`     |
| Service Documentation | `Ctrl+Shift+S` | `Templater: Insert service-documentation-template` |
| Guide/Tutorial        | `Ctrl+Shift+G` | `Templater: Insert guide-tutorial-template`        |

### Thiết Lập Biến Template

> [!info] Biến Chung
> Tạo file `assets/templates/_template-variables.md` với các giá trị chung:

```markdown
<!-- Biến dự án chung -->

{{project_name}} = My Digital Collection
{{project_repo}} = MyDigitalCollection
{{base_url}} = https://api.mydigitalcollection.com
{{staging_url}} = https://staging-api.mydigitalcollection.com
{{documentation_url}} = https://docs.mydigitalcollection.com

<!-- Thông tin nhóm -->

{{team_name}} = Development Team
{{team_email}} = dev@mydigitalcollection.com
{{documentation_maintainer}} = @docs-team
```

## 🔄 Cấu Hình Quy Trình Làm Việc

### Quy Trình Tài Liệu Hàng Ngày

> [!tip] Quy Trình Hiệu Quả
> Thiết lập để tối đa hóa năng suất.

#### Thiết Lập Buổi Sáng

1. **Mở Obsidian** → Xem lại các file gần đây
2. **Kiểm tra Calendar** → Cập nhật tài liệu đã lên lịch
3. **Xem lại Kanban** → Tác vụ tài liệu
4. **Cập nhật ghi chú dự án** → Theo dõi tiến độ

#### Tạo Tài Liệu Mới

1. **Quick Switcher** (`Ctrl/Cmd+O`) → Nhập tên ghi chú
2. **Chèn Template** (`Ctrl/Cmd+T`) → Chọn template phù hợp
3. **Điền biến** → Thay thế tất cả `{{variables}}`
4. **Liên kết tài liệu liên quan** → Sử dụng cú pháp `[[]]`
5. **Thêm tags** → Để phân loại
6. **Lưu & xem lại** → Kiểm tra chất lượng

#### Cuối Ngày

1. **Đồng bộ Git** → Tự động commit thay đổi
2. **Cập nhật index files** → Giữ TOC cập nhật
3. **Xem lại kết nối** → Kiểm tra graph view
4. **Lập kế hoạch ngày mai** → Ghi chú TODO items

### Phím Tắt

> [!example] Phím Tắt Cần Thiết
> Làm chủ những phím tắt này để điều hướng hiệu quả.

| Hành Động           | Phím Tắt           | Mục Đích                          |
| ------------------- | ------------------ | --------------------------------- |
| Quick Switcher      | `Ctrl/Cmd+O`       | Điều hướng đến bất kỳ ghi chú nào |
| Command Palette     | `Ctrl/Cmd+P`       | Truy cập tất cả lệnh              |
| Search in All Files | `Ctrl/Cmd+Shift+F` | Tìm kiếm toàn cục                 |
| Insert Template     | `Ctrl/Cmd+T`       | Thêm template                     |
| Toggle Edit/Preview | `Ctrl/Cmd+E`       | Chuyển đổi chế độ                 |
| Open Graph View     | `Ctrl/Cmd+G`       | Hiển thị kết nối                  |
| Create New Note     | `Ctrl/Cmd+N`       | Tài liệu mới                      |
| Follow Link         | `Ctrl/Cmd+Click`   | Điều hướng links                  |

## 📊 Cấu Trúc Thư Mục

> [!note] Cấu Trúc Được Khuyến Nghị
> Tổ chức vault để tối đa hóa tính năng Obsidian.

```
docs/
├── 📁 assets/
│   ├── 📁 images/          # Tất cả hình ảnh
│   ├── 📁 diagrams/        # File Mermaid, Excalidraw
│   └── 📁 templates/       # Template tài liệu
├── 📁 01-getting-started/  # Đánh số để sắp xếp thứ tự
├── 📁 02-architecture/
├── 📁 03-backend/
├── 📁 04-frontend/
├── 📁 05-deployment/
├── 📁 MOCs/               # Maps of Content
│   ├── Architecture MOC.md
│   ├── Backend Services MOC.md
│   └── API Documentation MOC.md
├── 📁 Daily Notes/        # Ghi chú cuộc họp, cập nhật
└── 📄 index.md           # Trang chủ vault
```

## 🎯 Thực Hành Tốt Nhất

### Chiến Lược Liên Kết

> [!tip] Liên Kết Thông Minh
> Tạo kết nối có ý nghĩa giữa các tài liệu.

#### Khi Nào Liên Kết

-   **Khái niệm liên quan**: `[[Database Design]]` ↔ `[[User Service]]`
-   **Phụ thuộc**: `[[API Gateway]]` → `[[User Service API]]`
-   **Khắc phục sự cố**: `[[Service Issues]]` → `[[Service Documentation]]`
-   **Quy trình làm việc**: `[[Development Guide]]` → `[[Deployment Guide]]`

#### Loại Liên Kết

```markdown
# Liên kết cơ bản

[[Document Name]]

# Liên kết với text hiển thị

[[Long Document Name|Short Name]]

# Liên kết đến sections

[[Document Name#Section Header]]

# Nhúng nội dung

![[Document Name]]
![[Document Name#Section]]
```

### Chiến Lược Tag

> [!info] Phân Cấp Tag
> Sử dụng tag nhất quán để lọc mạnh mẽ.

#### Danh Mục Tag

```yaml
# Loại tài liệu
-  #api-docs
-  #service-docs
-  #guides
-  #troubleshooting

# Công nghệ stack
-  #java
-  #spring-boot
-  #kubernetes
-  #postgresql

# Trạng thái
-  #draft
-  #review
-  #approved
-  #deprecated

# Độ ưu tiên
-  #critical
-  #important
-  #normal
-  #low
```

### MOCs (Maps of Content)

> [!example] Chiến Lược MOC
> Tạo tài liệu tổng quan liên kết nội dung liên quan.

#### Ví Dụ Cấu Trúc MOC

```markdown
# Backend Services MOC

## Dịch Vụ Cốt Lõi

-   [[User Service Documentation]]
-   [[Authentication Service Documentation]]
-   [[Notification Service Documentation]]

## Tài Liệu API

-   [[User Service API]]
-   [[Auth Service API]]
-   [[Notification Service API]]

## Khắc Phục Sự Cố

-   [[Common Backend Issues]]
-   [[Database Connection Problems]]
-   [[Service Communication Issues]]
```

## 🔍 Tính Năng Nâng Cao

### Truy Vấn Dataview

> [!example] Nội Dung Động
> Sử dụng Dataview để tự động tạo danh sách nội dung.

#### Liệt Kê Tất Cả Tài Liệu API

```dataview
TABLE version, maintainer, updated
FROM "03-backend/api-reference"
WHERE type = "api-documentation"
SORT updated DESC
```

#### Bảng Điều Khiển Trạng Thái Dịch Vụ

```dataview
TABLE status, version, port
FROM #service-docs
WHERE type = "service-documentation"
SORT file.name ASC
```

### Sử Dụng Graph View

> [!tip] Điều Hướng Trực Quan
> Sử dụng Graph View để hiểu cấu trúc tài liệu.

#### Bộ Lọc Graph Hữu Ích

-   **Lọc theo tags**: `tag:#api-docs` → Chỉ hiển thị tài liệu API
-   **Lọc theo path**: `path:backend` → Hiển thị tài liệu liên quan backend
-   **Loại trừ templates**: `-path:templates` → Ẩn file template

## 🚨 Khắc Phục Sự Cố

### Vấn Đề Thường Gặp

> [!warning] Vấn Đề Đã Biết
> Giải pháp cho các vấn đề thường gặp.

#### Templates Không Hoạt Động

```markdown
Vấn đề: Biến template không được thay thế
Giải pháp:

1. Kiểm tra plugin Templater đã bật
2. Xác nhận đường dẫn thư mục template: assets/templates
3. Đảm bảo template có đuôi .md
```

#### Links Không Hoạt Động

```markdown
Vấn đề: [[Links]] hiển thị như text thường
Giải pháp:

1. Settings → Files & Links → Use [[Wikilink]] đã bật
2. Kiểm tra file tồn tại trong vault
3. Xác nhận chính tả và phân biệt chữ hoa thường
```

#### Vấn Đề Hiệu Suất

```markdown
Vấn đề: Obsidian chạy chậm
Giải pháp:

1. Tắt các plugin không cần thiết
2. Giảm độ phức tạp graph view
3. Đóng các tab không sử dụng
4. Khởi động lại ứng dụng
```

---

> [!success] Thiết Lập Hoàn Tất!
> Bạn đã thiết lập thành công Obsidian vault cho dự án My Digital Collection. Bắt đầu tạo tài liệu với templates và tận hưởng quy trình quản lý kiến thức mạnh mẽ!

> [!info] Hỗ Trợ
> **Có câu hỏi?** Ping @docs-team trong Slack  
> **Có vấn đề?** Tạo ticket trong công cụ quản lý dự án  
> **Góp ý?** Đóng góp vào repository tài liệu
