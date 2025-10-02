# {{title}}

> **Ngày tạo**: {{date:YYYY-MM-DD}}  
> **Tác giả**: {{author}}  
> **Loại**: Custom Hook  
> **Trạng thái**: [[Draft]] / [[In Progress]] / [[Review]] / [[Done]]

## 📝 Mô Tả

### Mục đích
Mô tả ngắn gọn về mục đích và chức năng của custom hook này.

### Vấn đề giải quyết
- Logic tái sử dụng cho vấn đề gì?
- Tách logic phức tạp ra khỏi component
- Chia sẻ state logic giữa các component

## 🎯 API Definition

### Hook Signature
```typescript
function {{hookName}}<T = any>(
  params: {{HookParams}}
): {{HookReturn}}<T> {
  // Implementation
}
```

### Parameters
```typescript
interface {{HookParams}} {
  param1: string;
  param2?: number;
  param3?: boolean;
  options?: {
    option1: string;
    option2: number;
  };
}
```

### Return Value
```typescript
interface {{HookReturn}}<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  // Methods
  refetch: () => void;
  reset: () => void;
  // Additional utilities
  [key: string]: any;
}
```

## 💻 Implementation

### File Structure
```
src/hooks/
├── index.ts                    # Export all hooks
├── {{hookName}}/
│   ├── index.ts               # Main export
│   ├── {{hookName}}.ts        # Hook implementation
│   ├── {{hookName}}.test.ts   # Unit tests
│   ├── types.ts               # Type definitions
│   └── utils.ts               # Helper functions
```

### Core Implementation
```typescript
import { useState, useEffect, useCallback, useRef } from 'react';

interface {{HookParams}} {
  // Parameters definition
}

interface {{HookReturn}}<T> {
  // Return type definition
}

export function {{hookName}}<T = any>(
  params: {{HookParams}}
): {{HookReturn}}<T> {
  // State management
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Refs for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Memoized functions
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Abort previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new abort controller
      abortControllerRef.current = new AbortController();
      
      // Your async logic here
      const result = await someAsyncOperation(params);
      
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err as Error);
      }
    } finally {
      setLoading(false);
    }
  }, [params]);
  
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);
  
  // Effects
  useEffect(() => {
    fetchData();
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);
  
  return {
    data,
    loading,
    error,
    refetch: fetchData,
    reset,
  };
}
```

## 🔗 Dependencies

### Internal Dependencies
- [[Hook/{{RelatedHook1}}]]
- [[Hook/{{RelatedHook2}}]]
- [[Utility/{{RelatedUtility}}]]

### External Dependencies
- React hooks: `useState`, `useEffect`, `useCallback`, `useMemo`
- External packages: Liệt kê các package bên ngoài

### Peer Dependencies
```json
{
  "react": ">=18.0.0",
  "typescript": ">=4.5.0"
}
```

## 🧪 Testing

### Test Setup
```typescript
import { renderHook, act } from '@testing-library/react';
import { {{hookName}} } from './{{hookName}}';

describe('{{hookName}}', () => {
  beforeEach(() => {
    // Setup before each test
  });
  
  afterEach(() => {
    // Cleanup after each test
  });
});
```

### Test Cases
```typescript
describe('{{hookName}}', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => {{hookName}}(defaultParams));
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  it('should handle successful data fetching', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      {{hookName}}(validParams)
    );
    
    await waitForNextUpdate();
    
    expect(result.current.data).toBeDefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  it('should handle errors gracefully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      {{hookName}}(invalidParams)
    );
    
    await waitForNextUpdate();
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
  });
  
  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => {{hookName}}(defaultParams));
    
    unmount();
    
    // Verify cleanup logic
  });
});
```

## 📚 Usage Examples

### Basic Usage
```typescript
import { {{hookName}} } from '@/hooks/{{hookName}}';

function MyComponent() {
  const { data, loading, error, refetch } = {{hookName}}({
    param1: 'value1',
    param2: 123,
  });
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={refetch}>Refetch</button>
    </div>
  );
}
```

### Advanced Usage
```typescript
function AdvancedComponent() {
  const [params, setParams] = useState({
    param1: 'initial',
    param2: 0,
    options: {
      option1: 'config',
      option2: 100,
    },
  });
  
  const { 
    data, 
    loading, 
    error, 
    refetch, 
    reset 
  } = {{hookName}}<CustomDataType>(params);
  
  const handleParamChange = (newParams: Partial<typeof params>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };
  
  return (
    <div>
      {/* Complex UI logic */}
    </div>
  );
}
```

### With TypeScript Generics
```typescript
interface UserData {
  id: string;
  name: string;
  email: string;
}

function UserComponent() {
  const { data: users } = {{hookName}}<UserData[]>({
    endpoint: '/api/users',
  });
  
  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## ⚡ Performance Considerations

### Optimization Techniques
- [ ] `useCallback` cho event handlers
- [ ] `useMemo` cho expensive calculations
- [ ] Debouncing cho frequent updates
- [ ] Cleanup để tránh memory leaks

### Memory Management
```typescript
export function {{hookName}}(params: {{HookParams}}) {
  // Use refs for values that don't trigger re-renders
  const timeoutRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Only update state if component is still mounted
  const safeSetState = useCallback((newState: any) => {
    if (mountedRef.current) {
      setState(newState);
    }
  }, []);
}
```

### Debouncing Example
```typescript
import { useDebounce } from '@/hooks/useDebounce';

export function {{hookName}}(params: {{HookParams}}) {
  const debouncedParams = useDebounce(params, 300);
  
  useEffect(() => {
    // API call with debounced params
  }, [debouncedParams]);
}
```

## 🔄 State Management Integration

### Redux Integration
```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks';

export function {{hookName}}(params: {{HookParams}}) {
  const dispatch = useAppDispatch();
  const storeData = useAppSelector(state => state.{{slice}}.data);
  
  const fetchData = useCallback(async () => {
    dispatch({{actionName}}(params));
  }, [dispatch, params]);
  
  return {
    data: storeData,
    loading,
    error,
    refetch: fetchData,
  };
}
```

### Context Integration
```typescript
import { useContext } from 'react';
import { {{ContextName}} } from '@/contexts/{{ContextName}}';

export function {{hookName}}(params: {{HookParams}}) {
  const context = useContext({{ContextName}});
  
  if (!context) {
    throw new Error('{{hookName}} must be used within {{ContextName}}Provider');
  }
  
  // Use context values
}
```

## 🐛 Error Handling

### Error Types
```typescript
enum {{HookName}}ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

class {{HookName}}Error extends Error {
  type: {{HookName}}ErrorType;
  details?: any;
  
  constructor(type: {{HookName}}ErrorType, message: string, details?: any) {
    super(message);
    this.type = type;
    this.details = details;
    this.name = '{{HookName}}Error';
  }
}
```

### Error Recovery
```typescript
export function {{hookName}}(params: {{HookParams}}) {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  const handleError = useCallback((error: Error) => {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        refetch();
      }, 1000 * Math.pow(2, retryCount)); // Exponential backoff
    } else {
      setError(error);
    }
  }, [retryCount, maxRetries]);
}
```

## 📊 Best Practices

### Hook Design Principles
- **Single Responsibility**: Mỗi hook chỉ có một mục đích rõ ràng
- **Reusability**: Có thể tái sử dụng trong nhiều component
- **Type Safety**: Sử dụng TypeScript để đảm bảo type safety
- **Error Handling**: Xử lý lỗi một cách graceful

### Naming Conventions
- Hook name bắt đầu với `use`
- Sử dụng camelCase
- Tên phải mô tả rõ chức năng

### Documentation Standards
- JSDoc comments cho public API
- Examples trong documentation
- Type definitions rõ ràng

## 📖 Related Documentation

### Internal Links
- [[Hook/{{RelatedHook1}}]]
- [[Hook/{{RelatedHook2}}]]
- [[Component/{{RelatedComponent}}]]
- [[Utility/{{RelatedUtility}}]]

### External Resources
- [React Hooks Documentation](https://react.dev/reference/react)
- [Custom Hooks Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Testing Custom Hooks](https://react-hooks-testing-library.com/)

## 📅 Changelog

### Version 1.0.0 - {{date:YYYY-MM-DD}}
- Initial hook implementation
- Basic functionality

### Version 1.1.0 - {{date:YYYY-MM-DD}}
- Added error handling
- Performance optimizations
- TypeScript improvements

---

**Tags**: #frontend #hook #react #typescript #utility
**Category**: [[Frontend/Hooks]]
**Priority**: High/Medium/Low
