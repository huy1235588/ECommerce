---
title: "{{title}}"
type: api-documentation
service: "{{service}}"
version: "{{version}}"
maintainer: "{{maintainer}}"
created: "{{date}}"
updated: "{{date}}"
tags:
    - api
    - documentation
    - "{{service}}"
    - backend
aliases:
    - "{{service}} API"
    - "{{service}} Documentation"
status: "{{status}}"
related:
    - "[[Service Documentation Template]]"
    - "[[Troubleshooting Template]]"
---

# {{title}} - API Documentation

> [!info] Template Variables
>
> -   `{{title}}`: Tên API (ví dụ: User Service API)
> -   `{{service}}`: Tên service (ví dụ: user-service)
> -   `{{version}}`: Phiên bản API (ví dụ: v1.0)
> -   `{{maintainer}}`: Người duy trì (ví dụ: @username)
> -   `{{status}}`: Trạng thái (draft/active/deprecated)

## 📋 Mục Lục

-   [[#Tổng Quan]]
-   [[#Xác Thực]]
-   [[#Base URL]]
-   [[#Endpoints]]
-   [[#Data Models]]
-   [[#Xử Lý Lỗi]]
-   [[#Ví Dụ]]
-   [[#Giới Hạn Tốc Độ]]

## 🎯 Tổng Quan

> [!abstract] API Information
> **Phiên Bản**: {{version}}  
> **Mô Tả**: {{description}}  
> **Maintainer**: {{maintainer}}  
> **Base URL**: {{base_url}} > **Documentation**: [[{{service}} Service Documentation]]

### Chức Năng Chính

-   [x] {{feature_1}}
-   [x] {{feature_2}}
-   [ ] {{feature_in_progress}} (🚧 Đang phát triển)
-   [ ] {{feature_planned}} (📝 Trong kế hoạch)

> [!tip] Liên Kết Nhanh
>
> -   [[#Xác Thực]] - Hướng dẫn xác thực
> -   [[#Endpoints]] - Danh sách API endpoints
> -   [[#Ví Dụ]] - Ví dụ sử dụng
> -   [[{{service}} Troubleshooting]] - Khắc phục sự cố

## 🔐 Xác Thực

> [!warning] Yêu Cầu Bảo Mật
> API này yêu cầu xác thực cho tất cả endpoints trừ health check.

### JWT Token

```http
Authorization: Bearer <your-jwt-token>
```

### API Key (Optional)

```http
X-API-Key: <your-api-key>
```

### Ví Dụ Xác Thực

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     {{base_url}}/v1/endpoint
```

> [!note] Quản Lý Token
> Tokens hết hạn sau 24 giờ. Refresh tokens có sẵn tại `POST /auth/refresh`.
>
> Liên quan: [[Authentication Service Documentation]]

## 🌐 Base URL

> [!info] URL Môi Trường
> Chọn URL phù hợp với môi trường bạn đang sử dụng.

| Environment | URL                                         | Status       |
| ----------- | ------------------------------------------- | ------------ |
| Development | `http://localhost:{{port}}/api/{{version}}` | 🟢 Hoạt động |
| Staging     | `{{staging_url}}/{{version}}`               | 🟢 Hoạt động |
| Production  | `{{production_url}}/{{version}}`            | 🟢 Hoạt động |

> [!tip] Biến Môi Trường
>
> ```bash
> # Development
> export API_BASE_URL="http://localhost:{{port}}/api/{{version}}"
>
> # Production
> export API_BASE_URL="{{production_url}}/{{version}}"
> ```

## 📡 Endpoints

> [!abstract] Tổng Quan API Endpoints
> Tất cả endpoints được nhóm theo chức năng. Click vào từng section để xem chi tiết.

### Thao Tác {{entity_name}}

#### GET /{{entity_plural}}

Lấy danh sách {{entity_name}}

**Tham Số:**

| Parameter | Type    | Required | Description                      |
| --------- | ------- | -------- | -------------------------------- |
| `page`    | integer | No       | Số trang (default: 0)            |
| `size`    | integer | No       | Kích thước trang (default: 20)   |
| `sort`    | string  | No       | Sắp xếp theo field (default: id) |
| `filter`  | string  | No       | Bộ lọc tìm kiếm                  |

**Phản Hồi:**

```json
{
    "status": "success",
    "data": {
        "items": [
            {
                "id": 1,
                "{{entity_name_lower}}": "Example {{entity_name}}",
                "created_at": "{{date:YYYY-MM-DDTHH:mm:ssZ}}"
            }
        ]
    },
    "message": "{{entity_plural}} retrieved successfully",
    "metadata": {
        "timestamp": "{{date:YYYY-MM-DDTHH:mm:ssZ}}",
        "version": "{{version}}",
        "pagination": {
            "page": 0,
            "size": 20,
            "total": 100,
            "total_pages": 5
        }
    }
}
```

#### POST /{{entity_plural}}

Tạo mới {{entity_name}}

**Nội Dung Yêu Cầu:**

```json
{
    "{{field_1}}": "{{field_1_type}}",
    "{{field_2}}": "{{field_2_type}}",
    "{{field_3}}": ["{{field_3_type}}"]
}
```

**Phản Hồi:**

```json
{
    "status": "success",
    "data": {
        "id": 123,
        "{{field_1}}": "{{field_1_value}}",
        "created_at": "{{date:YYYY-MM-DDTHH:mm:ssZ}}"
    },
    "message": "{{entity_name}} created successfully",
    "metadata": {
        "timestamp": "{{date:YYYY-MM-DDTHH:mm:ssZ}}",
        "version": "{{version}}"
    }
}
```

#### GET /{{entity_plural}}/{id}

Lấy chi tiết {{entity_name}} theo ID

**Tham Số Path:**

| Parameter | Type    | Required | Description            |
| --------- | ------- | -------- | ---------------------- |
| `id`      | integer | Yes      | ID của {{entity_name}} |

**Phản Hồi:**

```json
{
    "status": "success",
    "data": {
        "id": 123,
        "{{field_1}}": "{{field_1_value}}",
        "{{field_2}}": "{{field_2_value}}",
        "created_at": "{{date:YYYY-MM-DDTHH:mm:ssZ}}",
        "updated_at": "{{date:YYYY-MM-DDTHH:mm:ssZ}}"
    },
    "message": "{{entity_name}} retrieved successfully",
    "metadata": {
        "timestamp": "{{date:YYYY-MM-DDTHH:mm:ssZ}}",
        "version": "{{version}}"
    }
}
```

**Phản Hồi:**

```json
{
    "status": "success",
    "data": {
        "id": 123,
        "{{field_1}}": "Updated {{field_1}}",
        "{{field_2}}": "Updated {{field_2}}",
        "updated_at": "{{date:YYYY-MM-DDTHH:mm:ssZ}}"
    },
    "message": "{{entity_name}} updated successfully",
    "metadata": {
        "timestamp": "{{date:YYYY-MM-DDTHH:mm:ssZ}}",
        "version": "{{version}}"
    }
}
```

#### DELETE /{{entity_plural}}/{id}

Xóa {{entity_name}}

**Phản Hồi:**

```json
{
    "status": "success",
    "data": null,
    "message": "{{entity_name}} deleted successfully",
    "metadata": {
        "timestamp": "{{date:YYYY-MM-DDTHH:mm:ssZ}}",
        "version": "{{version}}"
    }
}
```

> [!example] Kiểm Tra Nhanh
>
> ```bash
> # Test the endpoints
> curl {{base_url}}/{{entity_plural}}
> curl -X POST {{base_url}}/{{entity_plural}} -d '{"{{field_1}}": "test"}'
> ```

## 📊 Data Models

### {{entity_name}} Model

```json
{
    "id": "integer - Unique identifier",
    "{{field_1}}": "string - {{field_1_description}}",
    "{{field_2}}": "string - {{field_2_description}}",
    "status": "enum['active', 'inactive'] - {{entity_name}} status",
    "metadata": {
        "key": "value"
    },
    "created_at": "datetime - Creation timestamp",
    "updated_at": "datetime - Last update timestamp"
}
```

### Quy Tắc Validation

> [!note] Ràng Buộc Validation
> Tất cả input sẽ được validate theo rules dưới đây.

| Field         | Type   | Constraints                      |
| ------------- | ------ | -------------------------------- |
| `{{field_1}}` | string | Bắt buộc, 1-100 ký tự            |
| `{{field_2}}` | string | Tùy chọn, tối đa 500 ký tự       |
| `status`      | enum   | Bắt buộc, ['active', 'inactive'] |

## ❌ Xử Lý Lỗi

> [!failure] Định Dạng Phản Hồi Lỗi
> Tất cả lỗi trả về theo format chuẩn dưới đây.

```json
{
    "status": "error",
    "data": null,
    "message": "Human readable error message",
    "error": {
        "code": "ERROR_CODE",
        "details": [
            {
                "field": "field_name",
                "message": "Field specific error message",
                "rejected_value": "invalid_value"
            }
        ],
        "trace_id": "req_123456789"
    },
    "metadata": {
        "timestamp": "{{date:YYYY-MM-DDTHH:mm:ssZ}}",
        "version": "{{version}}"
    }
}
```

### Mã Lỗi Thường Gặp

| HTTP Code | Error Code            | Description                   | Solution                        |
| --------- | --------------------- | ----------------------------- | ------------------------------- |
| 400       | `VALIDATION_ERROR`    | Dữ liệu đầu vào không hợp lệ  | Kiểm tra lại request body       |
| 401       | `UNAUTHORIZED`        | Thiếu hoặc sai token xác thực | [[Authentication Guide]]        |
| 403       | `FORBIDDEN`           | Không có quyền truy cập       | Liên hệ admin                   |
| 404       | `NOT_FOUND`           | Resource không tìm thấy       | Kiểm tra ID                     |
| 409       | `CONFLICT`            | Conflict với dữ liệu hiện tại | Kiểm tra data                   |
| 429       | `RATE_LIMIT_EXCEEDED` | Vượt quá giới hạn request     | Đợi và thử lại                  |
| 500       | `INTERNAL_ERROR`      | Lỗi server nội bộ             | [[{{service}} Troubleshooting]] |

## 💡 Ví Dụ

> [!example] Ví Dụ Code
> Ví dụ sử dụng API với các ngôn ngữ phổ biến.

### JavaScript/Fetch

```javascript
// GET request with authentication
const fetchData = async () => {
    try {
        const response = await fetch("{{base_url}}/{{entity_plural}}", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (result.status === "error") {
            console.error("API Error:", result.error);
            throw new Error(result.message);
        }

        return result.data;
    } catch (error) {
        console.error("Network error:", error);
        throw error;
    }
};

// POST request with comprehensive error handling
const createResource = async (resourceData) => {
    try {
        const response = await fetch("{{base_url}}/{{entity_plural}}", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resourceData),
        });

        const result = await response.json();

        if (result.status === "error") {
            // Handle validation errors
            if (result.error?.details) {
                const fieldErrors = result.error.details
                    .map((detail) => `${detail.field}: ${detail.message}`)
                    .join(", ");
                throw new Error(`Validation failed: ${fieldErrors}`);
            }
            throw new Error(result.message);
        }

        console.log(result.message); // Success message
        return result.data;
    } catch (error) {
        console.error("Error creating resource:", error);
        throw error;
    }
};

// Generic API wrapper with response handling
class APIClient {
    constructor(baseUrl, token) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    async request(endpoint, options = {}) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        const result = await response.json();

        if (result.status === "error") {
            throw new APIError(result.message, result.error);
        }

        return result;
    }
}

class APIError extends Error {
    constructor(message, errorDetails) {
        super(message);
        this.name = "APIError";
        this.details = errorDetails;
    }
}
```

### cURL

```bash
# GET request with pagination
curl -X GET \
  "{{base_url}}/{{entity_plural}}?page=0&size=10&sort=id,desc" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"

# POST request with data
curl -X POST \
  "{{base_url}}/{{entity_plural}}" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "{{field_1}}": "Example Value",
    "{{field_2}}": "Another Value"
  }'

# PUT request to update
curl -X PUT \
  "{{base_url}}/{{entity_plural}}/123" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "{{field_1}}": "Updated Value"
  }'
```

### Python/Requests

```python
import requests
import json
from typing import Dict, Any, Optional

class APIResponse:
    """Wrapper for standardized API responses"""
    def __init__(self, response_data: Dict[str, Any]):
        self.status = response_data.get('status')
        self.data = response_data.get('data')
        self.message = response_data.get('message')
        self.error = response_data.get('error')
        self.metadata = response_data.get('metadata')

    @property
    def is_success(self) -> bool:
        return self.status == 'success'

    @property
    def is_error(self) -> bool:
        return self.status == 'error'

class APIException(Exception):
    """Custom exception for API errors"""
    def __init__(self, message: str, error_details: Dict[str, Any] = None):
        super().__init__(message)
        self.error_details = error_details

class {{entity_name}}API:
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

    def _make_request(self, method: str, endpoint: str, **kwargs) -> APIResponse:
        """Make HTTP request and return standardized response"""
        try:
            response = requests.request(
                method=method,
                url=f'{self.base_url}{endpoint}',
                headers=self.headers,
                **kwargs
            )

            result = response.json()
            api_response = APIResponse(result)

            if api_response.is_error:
                raise APIException(api_response.message, api_response.error)

            return api_response

        except requests.RequestException as e:
            raise APIException(f"Network error: {str(e)}")

    def get_{{entity_plural}}(self, page: int = 0, size: int = 20) -> APIResponse:
        """Get list of {{entity_plural}}"""
        params = {'page': page, 'size': size}
        return self._make_request('GET', '/{{entity_plural}}', params=params)

    def create_{{entity_name_lower}}(self, data: Dict[str, Any]) -> APIResponse:
        """Create new {{entity_name_lower}}"""
        return self._make_request('POST', '/{{entity_plural}}', json=data)

    def get_{{entity_name_lower}}(self, {{entity_name_lower}}_id: int) -> APIResponse:
        """Get {{entity_name_lower}} by ID"""
        return self._make_request('GET', f'/{{entity_plural}}/{{{entity_name_lower}}_id}')

    def update_{{entity_name_lower}}(self, {{entity_name_lower}}_id: int, data: Dict[str, Any]) -> APIResponse:
        """Update {{entity_name_lower}}"""
        return self._make_request('PUT', f'/{{entity_plural}}/{{{entity_name_lower}}_id}', json=data)

    def delete_{{entity_name_lower}}(self, {{entity_name_lower}}_id: int) -> APIResponse:
        """Delete {{entity_name_lower}}"""
        return self._make_request('DELETE', f'/{{entity_plural}}/{{{entity_name_lower}}_id}')

# Usage example with error handling
def main():
    api = {{entity_name}}API('{{base_url}}', 'your_token_here')

    try:
        # Get list with pagination
        response = api.get_{{entity_plural}}(page=0, size=10)
        print(f"Success: {response.message}")
        print(f"Total items: {response.metadata.get('pagination', {}).get('total', 0)}")

        for item in response.data.get('items', []):
            print(f"- {item.get('{{field_1}}')}")

        # Create new item
        new_item = {
            "{{field_1}}": "Example Value",
            "{{field_2}}": "Another Value"
        }

        create_response = api.create_{{entity_name_lower}}(new_item)
        print(f"Created: {create_response.message}")
        print(f"New ID: {create_response.data.get('id')}")

    except APIException as e:
        print(f"API Error: {e}")
        if e.error_details:
            print(f"Error Code: {e.error_details.get('code')}")
            print(f"Trace ID: {e.error_details.get('trace_id')}")

            # Handle validation errors
            if e.error_details.get('details'):
                print("Validation errors:")
                for detail in e.error_details['details']:
                    print(f"  - {detail.get('field')}: {detail.get('message')}")

if __name__ == "__main__":
    main()
```

## ⚡ Giới Hạn Tốc Độ

> [!warning] Giới Hạn Rate
> API có giới hạn số lượng request để đảm bảo hiệu suất.

| Loại Người Dùng | Giới Hạn       | Cửa Sổ  | Burst    |
| --------------- | -------------- | ------- | -------- |
| Free            | 100 requests   | mỗi giờ | 10/phút  |
| Premium         | 1000 requests  | mỗi giờ | 50/phút  |
| Enterprise      | 10000 requests | mỗi giờ | 200/phút |

**Headers Giới Hạn Rate:**

-   `X-RateLimit-Limit`: Giới hạn total
-   `X-RateLimit-Remaining`: Số request còn lại
-   `X-RateLimit-Reset`: Thời gian reset (Unix timestamp)
-   `Retry-After`: Số giây cần đợi khi hit limit

## 🔗 Tài Liệu Liên Quan

> [!info] Related Documentation
> Các tài liệu liên quan để hiểu rõ hơn về hệ thống.

### Tài Liệu Nội Bộ

-   [[{{service}} Service Documentation]] - Service overview và architecture
-   [[{{service}} Troubleshooting]] - Khắc phục sự cố thường gặp
-   [[Authentication Service Documentation]] - Hướng dẫn authentication
-   [[{{service}} Deployment Guide]] - Hướng dẫn deployment

### Tài Nguyên Bên Ngoài

-   [OpenAPI Specification](./swagger/{{service}}-api-spec.yaml)
-   [Postman Collection](./postman/{{service}}-collection.json)
-   [API Health Dashboard]({{monitoring_url}}/{{service}})

## 📋 Danh Sách Kiểm Tra Testing

> [!todo] Danh Sách Kiểm Tra API Testing
>
> -   [ ] Health endpoint responding
> -   [ ] Authentication working
> -   [ ] All CRUD operations functional
> -   [ ] Error handling working correctly
> -   [ ] Rate limiting enforced
> -   [ ] Response times acceptable
> -   [ ] Documentation up to date

## 📅 Lịch Sử Thay Đổi

> [!note] Lịch Sử Phiên Bản
> Track changes và updates của API.

| Version     | Date     | Changes     | Breaking             |
| ----------- | -------- | ----------- | -------------------- |
| {{version}} | {{date}} | {{changes}} | {{breaking_changes}} |

---

> [!info] Metadata
> **Tạo**: {{date}}  
> **Cập Nhật Cuối**: {{date}}  
> **Duy Trì Bởi**: {{maintainer}}  
> **Trạng Thái**: {{status}}  
> **Phiên Bản**: {{version}}
