---
name: backend-patterns
description: Backend architecture patterns, API design, database optimization, and server-side best practices for Node.js, Express, and Next.js API routes.
origin: ECC
---
# Backend Development Patterns

Backend architecture patterns and best practices for scalable server-side applications.

## When to Use

- Designing REST APIs
- Implementing Controller / Service / Repository layers
- Handling transactions, caching, and async processing
- Structuring error handling and validation
- Implementing authentication and authorization

## Architecture (MANDATORY)

### Layered Structure

Controller → Service → Repository → DB

- Controller: request/response only
- Service: all business logic
- Repository: data access only
- Do NOT bypass layers

## API Design

### RESTful API Structure

```java
// PASS: Resource-based URLs
GET    /api/markets                 # List resources
GET    /api/markets/:id             # Get single resource
POST   /api/markets                 # Create resource
PUT    /api/markets/:id             # Replace resource
PATCH  /api/markets/:id             # Update resource
DELETE /api/markets/:id             # Delete resource

// PASS: Query parameters for filtering, sorting, pagination
GET /api/markets?status=active&sort=volume&limit=20&offset=0
```

* Use resource-based URLs
* Use query params for filtering, sorting, pagination
* Do NOT use verbs in URLs

### Controller Pattern

```java
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> create(
            @Valid @RequestBody CreateOrderRequest request
    ) {
        OrderResponse response = orderService.createOrder(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
```

* Validate input at the Controller boundary
* Use `@Valid` for request validation
* Do NOT use try-catch in Controller
* Do NOT put business logic in Controller

### Service Layer Pattern

```typescript
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        Order order = Order.from(request);
        return orderRepository.save(order);
    }
}
```

* All business logic belongs in Service
* Use `@Transactional` for write operations
* Use `@Transactional(readOnly = true)` for read operations when appropriate
* Keep Service methods focused

### Repository Pattern

```java
public interface OrderRepository extends JpaRepository<Order, Long> {
}
```

* Use Spring Data JPA, QueryDSL, or MyBatis consistently
* Repository handles data access only
* No business logic in Repository
* Fetch only required data
* Use projections or DTO queries where appropriate

### Transaction Pattern

* Write operations → `@Transactional`
* Read operations → `@Transactional(readOnly = true)`
* Keep transactions short
* Do NOT call external APIs inside long-running transactions
* Separate DB transaction boundaries from external side effects when necessary

## Database Patterns

### Query Optimization

```typescript
@Query("select o from Order o join fetch o.items where o.id = :id")
Optional<Order> findByIdWithItems(@Param("id") Long id);
```

* Avoid fetching unnecessary columns or relations
* Prevent N+1 problems
* Use fetch join, entity graph, batch fetch, or optimized query methods
* Add indexes for frequently filtered columns
* Use pagination for large result sets

### N+1 Query Prevention

* Do NOT loop over entities and trigger lazy loads unintentionally
* Use fetch join or batch loading for related collections
* Review ORM-generated SQL in complex list queries

## Validation

```java
public record CreateOrderRequest(
    @NotNull String name,
    @Positive int quantity
) {}
```

* Validate all external input
* Use Bean Validation annotations
* Fail fast on invalid input
* Do NOT trust request payloads, query params, or external data

## Exception Handling

### Global Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Void>> handleCustomException(CustomException e) {
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error(e.getMessage()));
    }
}
```

* Use `@RestControllerAdvice` for centralized exception handling
* Throw domain-specific exceptions from Service layer
* Do NOT expose stack traces or internal details to clients
* Return consistent error responses

## API Response Pattern

```java
public record ApiResponse<T>(
    boolean success,
    T data,
    String error,
    String code,
    LocalDateTime timestamp
) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null, "SUCCESS", LocalDateTime.now());
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message, "ERROR", LocalDateTime.now());
    }
}
```

* Use a consistent response envelope
* Include machine-readable error code
* Do NOT rely on raw error strings for frontend logic

## Authentication (Spring Security + JWT)

* Use Spring Security for authentication flow
* Validate JWT on every protected request
* Implement authentication in filter/security layer
* Do NOT trust user identity from request body or client state
* Keep token parsing and verification centralized

### Recommended Structure

* `SecurityConfig`
* `JwtAuthenticationFilter`
* `JwtProvider`
* `UserDetailsService` or equivalent auth adapter

## Authorization

```java
@PreAuthorize("hasRole('ROLE_ADMIN')")
public void deleteOrder(Long id) {
    // ...
}
```

* Enforce authorization on the backend
* Use role/permission checks consistently
* Do NOT rely on frontend visibility as security

## Caching

```java
@Cacheable(value = "orders", key = "#id")
public OrderResponse getOrder(Long id) {
    Order order = orderRepository.findById(id)
            .orElseThrow(() -> new CustomException("ORDER_NOT_FOUND"));
    return OrderResponse.from(order);
}
```

* Use Spring Cache abstraction with Redis or a suitable backend
* Invalidate cache on update/delete
* Do NOT cache sensitive or rapidly changing data blindly
* Define TTL and invalidation strategy explicitly

## Async Processing

```java
@Async
public void sendNotification(Long orderId) {
    // async work
}
```

* Use `@Async` for lightweight background processing
* Use message brokers (Kafka, RabbitMQ, etc.) for heavy or reliable async workflows
* Do NOT block request threads with long-running non-critical work

## Messaging / Queue Pattern

* Use Kafka/RabbitMQ/etc. for retryable, decoupled background work
* Design handlers to be idempotent
* Log failures with enough context
* Define retry and dead-letter strategy when needed

## Logging

```java
@Slf4j
@Service
public class OrderService {

    public void process(Long orderId) {
        log.info("Processing order. orderId={}", orderId);
    }
}
```

* Use SLF4J with Logback or equivalent
* Use structured, contextual logs where possible
* Include requestId, userId, endpoint, or key business identifiers when relevant
* Do NOT use `System.out.println`

## Monitoring

* Expose health checks and metrics
* Monitor error rates, latency, and throughput
* Use Spring Boot Actuator where appropriate
* Track key business-critical flows, not just infrastructure metrics

## Security Rules

* Validate all input
* Never hardcode secrets
* Use environment variables or secret manager
* Enforce HTTPS
* Sanitize error messages
* Protect endpoints with authentication and authorization
* Apply CSRF policy appropriately for the application architecture
* Add rate limiting where abuse risk exists

## Persistence Strategy

* Be consistent about JPA / QueryDSL / MyBatis usage per module
* Map entities carefully
* Do NOT expose entities directly through API
* Convert Entity → DTO at boundaries

## Testing Guidance

* Unit test Service logic
* Integration test Controller + persistence flow where needed
* Test security rules on protected endpoints
* Test transaction-sensitive flows
* Test cache invalidation and error handling for critical paths

## Core Rules Summary

- Maintain Controller → Service → Repository structure
- Service layer handles all business logic
- Validate input at system boundaries
- Handle exceptions centrally via global handler
- Manage transactions in the Service layer
- Standardize authentication/authorization using Spring Security
- Design caching, async processing, and logging with production concerns in mind
- Do NOT mix patterns from other stacks
