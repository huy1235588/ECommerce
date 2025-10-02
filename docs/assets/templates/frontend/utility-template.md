# {{title}}

> **Ngày tạo**: {{date:YYYY-MM-DD}}  
> **Tác giả**: {{author}}  
> **Loại**: Utility Function  
> **Trạng thái**: [[Draft]] / [[In Progress]] / [[Review]] / [[Done]]

## 📝 Mô Tả

### Mục đích
Mô tả ngắn gọn về chức năng và mục đích của utility function này.

### Vấn đề giải quyết
- Giải quyết vấn đề gì?
- Tại sao cần tạo utility này?
- Cải thiện code như thế nào?

## 🎯 Function Signature

### Type Definition
```typescript
function {{functionName}}<T = any>(
  param1: ParamType1,
  param2?: ParamType2,
  options?: OptionsType
): ReturnType<T> {
  // Implementation
}
```

### Parameters
```typescript
interface {{FunctionName}}Options {
  option1?: string;
  option2?: number;
  option3?: boolean;
  // Additional options
}

// Parameter types
type ParamType1 = string | number;
type ParamType2 = object | null;
type ReturnType<T> = T | Promise<T> | void;
```

### Usage Examples
```typescript
// Basic usage
const result = {{functionName}}('input', optionalParam);

// With options
const result = {{functionName}}('input', param2, {
  option1: 'value',
  option2: 100,
});

// With TypeScript generics
const result = {{functionName}}<CustomType>('input');
```

## 💻 Implementation

### File Structure
```
src/utils/
├── index.ts                    # Export all utilities
├── {{category}}/
│   ├── index.ts               # Export category utilities
│   ├── {{functionName}}.ts    # Main implementation
│   ├── {{functionName}}.test.ts # Unit tests
│   ├── types.ts               # Type definitions
│   └── helpers.ts             # Helper functions
```

### Core Implementation
```typescript
import { {{dependency1}}, {{dependency2}} } from './dependencies';

/**
 * {{Function description}}
 * 
 * @param param1 - Description of parameter 1
 * @param param2 - Description of parameter 2
 * @param options - Configuration options
 * @returns Description of return value
 * 
 * @example
 * ```typescript
 * const result = {{functionName}}('input', { option: 'value' });
 * console.log(result); // Expected output
 * ```
 */
export function {{functionName}}<T = any>(
  param1: ParamType1,
  param2?: ParamType2,
  options: {{FunctionName}}Options = {}
): ReturnType<T> {
  // Input validation
  if (!param1) {
    throw new Error('param1 is required');
  }
  
  // Default options
  const config = {
    option1: 'default',
    option2: 100,
    option3: false,
    ...options,
  };
  
  try {
    // Main logic implementation
    const result = processInput(param1, param2, config);
    
    // Post-processing
    return formatResult(result, config);
  } catch (error) {
    // Error handling
    console.error(`Error in {{functionName}}:`, error);
    throw error;
  }
}

// Helper functions
function processInput(
  input: ParamType1, 
  param: ParamType2, 
  config: {{FunctionName}}Options
): any {
  // Processing logic
}

function formatResult(data: any, config: {{FunctionName}}Options): any {
  // Result formatting logic
}

// Export type definitions
export type { {{FunctionName}}Options, ParamType1, ParamType2, ReturnType };
```

### Advanced Implementation
```typescript
// With caching
const cache = new Map<string, any>();

export function {{functionName}}WithCache<T>(
  param: string,
  options: {{FunctionName}}Options & { useCache?: boolean } = {}
): T {
  const { useCache = true, ...restOptions } = options;
  const cacheKey = `${param}-${JSON.stringify(restOptions)}`;
  
  if (useCache && cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const result = {{functionName}}<T>(param, restOptions);
  
  if (useCache) {
    cache.set(cacheKey, result);
  }
  
  return result;
}

// Async version
export async function {{functionName}}Async<T>(
  param: ParamType1,
  options: {{FunctionName}}Options = {}
): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      const result = {{functionName}}<T>(param, options);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

// Curried version
export function {{functionName}}Curried(options: {{FunctionName}}Options = {}) {
  return function<T>(param: ParamType1): ReturnType<T> {
    return {{functionName}}<T>(param, options);
  };
}
```
## 📚 Usage Examples

### Basic Usage
```typescript
import { {{functionName}} } from '@/utils/{{category}}';

// Simple usage
const result = {{functionName}}('input data');
console.log(result);

// With options
const customResult = {{functionName}}('input data', {
  option1: 'custom value',
  option2: 150,
});
```

### Advanced Usage
```typescript
// With TypeScript generics
interface UserData {
  id: string;
  name: string;
  email: string;
}

const userData = {{functionName}}<UserData>('user input');

// Chaining with other utilities
const processed = pipe(
  rawData,
  {{functionName}},
  anotherUtility,
  finalTransform
);

// Error handling
try {
  const result = {{functionName}}(userInput);
  handleSuccess(result);
} catch (error) {
  handleError(error);
}
```

### React Integration
```typescript
// In React components
function MyComponent() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    if (input) {
      try {
        const processed = {{functionName}}(input, {
          option1: 'react',
        });
        setResult(processed);
      } catch (error) {
        console.error('Processing error:', error);
      }
    }
  }, [input]);
  
  return (
    <div>
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
      />
      {result && <div>{JSON.stringify(result)}</div>}
    </div>
  );
}

// Custom hook integration
function useProcessedData(input: string) {
  return useMemo(() => {
    if (!input) return null;
    return {{functionName}}(input);
  }, [input]);
}
```

## ⚡ Performance Optimization

### Memoization
```typescript
import { memoize } from 'lodash';

// Memoized version for expensive operations
export const {{functionName}}Memoized = memoize(
  {{functionName}},
  (param, options) => `${param}-${JSON.stringify(options)}`
);

// Custom memoization with size limit
const createMemoizedFunction = (maxSize = 100) => {
  const cache = new Map();
  
  return function<T>(param: string, options = {}): T {
    const key = `${param}-${JSON.stringify(options)}`;
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    const result = {{functionName}}<T>(param, options);
    cache.set(key, result);
    return result;
  };
};
```

### Debouncing & Throttling
```typescript
import { debounce, throttle } from 'lodash';

// Debounced version for frequent calls
export const {{functionName}}Debounced = debounce(
  {{functionName}},
  300,
  { leading: false, trailing: true }
);

// Throttled version for rate limiting
export const {{functionName}}Throttled = throttle(
  {{functionName}},
  1000,
  { leading: true, trailing: false }
);
```

### Batch Processing
```typescript
// Batch processing for multiple inputs
export function {{functionName}}Batch<T>(
  inputs: ParamType1[],
  options: {{FunctionName}}Options = {}
): T[] {
  return inputs.map(input => {{functionName}}<T>(input, options));
}

// Async batch with concurrency control
export async function {{functionName}}BatchAsync<T>(
  inputs: ParamType1[],
  options: {{FunctionName}}Options & { concurrency?: number } = {}
): Promise<T[]> {
  const { concurrency = 5, ...restOptions } = options;
  const results: T[] = [];
  
  for (let i = 0; i < inputs.length; i += concurrency) {
    const batch = inputs.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(input => {{functionName}}Async<T>(input, restOptions))
    );
    results.push(...batchResults);
  }
  
  return results;
}
```

## 🔧 Error Handling

### Error Types
```typescript
export enum {{FunctionName}}ErrorType {
  INVALID_INPUT = 'INVALID_INPUT',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
}

export class {{FunctionName}}Error extends Error {
  public readonly type: {{FunctionName}}ErrorType;
  public readonly details?: any;
  
  constructor(
    type: {{FunctionName}}ErrorType,
    message: string,
    details?: any
  ) {
    super(message);
    this.name = '{{FunctionName}}Error';
    this.type = type;
    this.details = details;
  }
}
```

### Error Recovery
```typescript
// With retry logic
export function {{functionName}}WithRetry<T>(
  param: ParamType1,
  options: {{FunctionName}}Options & { 
    maxRetries?: number;
    retryDelay?: number;
  } = {}
): T {
  const { maxRetries = 3, retryDelay = 1000, ...restOptions } = options;
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return {{functionName}}<T>(param, restOptions);
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        // Wait before retry
        if (retryDelay > 0) {
          // In real implementation, use setTimeout for async
          console.log(`Retry attempt ${attempt + 1} in ${retryDelay}ms`);
        }
        continue;
      }
    }
  }
  
  throw new {{FunctionName}}Error(
    {{FunctionName}}ErrorType.PROCESSING_ERROR,
    `Failed after ${maxRetries} retries`,
    { originalError: lastError }
  );
}
```

## 🛡️ Validation

### Input Validation
```typescript
import { z } from 'zod';

// Zod schema for validation
const inputSchema = z.object({
  param1: z.string().min(1, 'param1 cannot be empty'),
  param2: z.number().optional(),
  options: z.object({
    option1: z.string().optional(),
    option2: z.number().min(0).optional(),
  }).optional(),
});

export function {{functionName}}Validated<T>(
  input: unknown
): T {
  // Validate input
  const validatedInput = inputSchema.parse(input);
  
  return {{functionName}}<T>(
    validatedInput.param1,
    validatedInput.param2,
    validatedInput.options
  );
}

// Runtime type checking
function isValidInput(input: any): input is ParamType1 {
  return typeof input === 'string' && input.length > 0;
}

export function {{functionName}}Safe<T>(
  input: unknown,
  options: {{FunctionName}}Options = {}
): { success: true; data: T } | { success: false; error: string } {
  try {
    if (!isValidInput(input)) {
      return {
        success: false,
        error: 'Invalid input type',
      };
    }
    
    const result = {{functionName}}<T>(input, options);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
```

## 📊 Monitoring & Analytics

### Logging
```typescript
import { logger } from '@/utils/logger';

export function {{functionName}}WithLogging<T>(
  param: ParamType1,
  options: {{FunctionName}}Options = {}
): T {
  const startTime = performance.now();
  
  logger.debug('{{functionName}} started', {
    param: typeof param === 'string' ? param.substring(0, 100) : param,
    options,
  });
  
  try {
    const result = {{functionName}}<T>(param, options);
    const endTime = performance.now();
    
    logger.info('{{functionName}} completed', {
      duration: endTime - startTime,
      resultType: typeof result,
    });
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    
    logger.error('{{functionName}} failed', {
      duration: endTime - startTime,
      error: error.message,
      stack: error.stack,
    });
    
    throw error;
  }
}
```

### Metrics Collection
```typescript
// Simple metrics collector
class MetricsCollector {
  private static metrics = new Map<string, number[]>();
  
  static record(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }
  
  static getStats(name: string) {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return null;
    
    return {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
    };
  }
}

export function {{functionName}}WithMetrics<T>(
  param: ParamType1,
  options: {{FunctionName}}Options = {}
): T {
  const startTime = performance.now();
  
  try {
    const result = {{functionName}}<T>(param, options);
    const duration = performance.now() - startTime;
    
    MetricsCollector.record('{{functionName}}.duration', duration);
    MetricsCollector.record('{{functionName}}.success', 1);
    
    return result;
  } catch (error) {
    MetricsCollector.record('{{functionName}}.error', 1);
    throw error;
  }
}
```

## 📖 Related Documentation

### Internal Links
- [[Utility/{{RelatedUtility1}}]]
- [[Utility/{{RelatedUtility2}}]]
- [[Component/{{RelatedComponent}}]]
- [[Hook/{{RelatedHook}}]]

### External Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Lodash Documentation](https://lodash.com/docs/)
- [Zod Documentation](https://zod.dev/)

## 📅 Changelog

### Version 1.0.0 - {{date:YYYY-MM-DD}}
- Initial implementation
- Basic functionality
- TypeScript support

### Version 1.1.0 - {{date:YYYY-MM-DD}}
- Added error handling
- Performance optimizations
- Additional options

### Version 1.2.0 - {{date:YYYY-MM-DD}}
- Validation support
- Monitoring integration
- Breaking changes (if any)

---

**Tags**: #frontend #utility #typescript #helper-function
**Category**: [[Frontend/Utils]]
**Priority**: High/Medium/Low
