# Stage 1

## Campus Notification System Design

### Core Actions

1. Create Notification
2. Get Notifications
3. Mark Notification as Read
4. Delete Notification
5. Send Bulk Notifications

---

## API Endpoints

### 1. Create Notification

**POST** `/api/notifications`

#### Request Body

```json
{
  "studentId": "1001",
  "type": "Placement",
  "message": "TCS Hiring Drive"
}
```

#### Response

```json
{
  "notificationId": "12345",
  "status": "created"
}
```

---

### 2. Get Notifications

**GET** `/api/notifications/{studentId}`

#### Response

```json
{
  "notifications": [
    {
      "id": "12345",
      "type": "Placement",
      "message": "TCS Hiring Drive",
      "isRead": false
    }
  ]
}
```

---

### 3. Mark Notification as Read

**PUT** `/api/notifications/{notificationId}/read`

#### Response

```json
{
  "status": "success",
  "message": "Notification marked as read"
}
```

---

### 4. Delete Notification

**DELETE** `/api/notifications/{notificationId}`

#### Response

```json
{
  "status": "success",
  "message": "Notification deleted"
}
```

---

### 5. Send Bulk Notifications

**POST** `/api/notifications/bulk`

#### Request Body

```json
{
  "studentIds": [1001, 1002, 1003],
  "type": "Placement",
  "message": "Amazon Hiring Drive"
}
```

#### Response

```json
{
  "status": "queued",
  "studentsCount": 3
}
```

---

## Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

---

## JSON Schema

```json
{
  "id": "string",
  "studentId": "string",
  "type": "Placement | Result | Event",
  "message": "string",
  "isRead": "boolean",
  "createdAt": "datetime"
}
```

---

## Real-Time Notification Mechanism

- WebSocket technology will be used for real-time notification delivery.
- Notifications are instantly pushed to connected students.
- Offline users can retrieve notifications using the Get Notifications API.
- Notifications are stored in the database for future access and tracking.



# Stage 2

## Database Choice

I would use PostgreSQL as the primary database because it provides strong consistency, reliability, indexing support, ACID transactions, and efficient querying for notification systems.

## Database Schema

### Students Table

```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);
```

### Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    student_id INT,
    notification_type VARCHAR(20),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);
```

## Challenges with Large Data Volume

1. Increased query latency.
2. Large storage requirements.
3. Database bottlenecks during peak usage.
4. Slower notification retrieval.

## Solutions

- Add indexes on frequently queried columns.
- Use pagination for notification retrieval.
- Archive old notifications.
- Use caching (Redis) for frequently accessed data.
- Implement database partitioning for scalability.

## Sample Queries

### Create Notification

```sql
INSERT INTO notifications
(id, student_id, notification_type, message)
VALUES
(gen_random_uuid(), 1001, 'Placement', 'TCS Hiring Drive');
```

### Get Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = 1001
ORDER BY created_at DESC;
```

### Mark Notification as Read

```sql
UPDATE notifications
SET is_read = TRUE
WHERE id = 'notification_id';
```

### Delete Notification

```sql
DELETE FROM notifications
WHERE id = 'notification_id';
```

# Stage 3

## Analysis of Existing Query

The query:

```sql
SELECT *
FROM notifications
WHERE studentID = 1040
AND isRead = false
ORDER BY createdAt DESC;
```

### Is this query accurate?

Yes, it correctly fetches unread notifications for a student.

### Why is it slow?

- The table contains millions of notifications.
- Full table scans may occur if indexes are missing.
- Sorting large datasets using ORDER BY can be expensive.

### Recommended Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt DESC);
```

### Computation Cost

Without indexes:
- Time Complexity ≈ O(N)

With indexes:
- Time Complexity ≈ O(log N)

### Should We Add Indexes on Every Column?

No.

Reasons:
- Increased storage usage.
- Slower INSERT and UPDATE operations.
- Many indexes may never be used.
- Indexes should be created only for frequently queried columns.

### Query to Find Students Who Received Placement Notifications in Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

### Recommended Improvements

- Composite indexes
- Query pagination
- Archiving old notifications
- Database partitioning
- Redis caching for frequently accessed data


# Stage 4

## Problem

Notifications are fetched from the database on every page load, causing:

- High database load
- Increased response time
- Poor user experience
- Scalability issues

## Recommended Solutions

### 1. Redis Caching

Store frequently accessed notifications in Redis.

Benefits:
- Faster response times
- Reduced database queries
- Better scalability

Tradeoff:
- Additional infrastructure cost
- Cache invalidation complexity

---

### 2. Pagination

Instead of loading all notifications:

```http
GET /api/notifications?page=1&limit=20
```

Benefits:
- Smaller payload size
- Faster API response

Tradeoff:
- Requires multiple API calls

---

### 3. Real-Time Notifications

Use WebSockets or Server-Sent Events (SSE).

Benefits:
- Instant updates
- Better user experience

Tradeoff:
- More complex implementation

---

### 4. Background Processing

Use message queues such as RabbitMQ or Kafka.

Benefits:
- Reduced API latency
- Better reliability

Tradeoff:
- Additional maintenance

---

### 5. Database Optimization

- Add proper indexes
- Archive old notifications
- Partition large tables

Benefits:
- Faster query execution

Tradeoff:
- Increased database complexity

---

## Final Recommendation

Combine:

- Redis Cache
- Pagination
- WebSockets
- Database Indexing

This approach provides high performance, scalability, and good user experience for large-scale notification systems.

# Stage 5

## Problems in Current Implementation

The proposed implementation has several issues:

1. Sequential processing is slow for 50,000 students.
2. If email sending fails midway, some students receive notifications while others do not.
3. Database writes and email delivery are tightly coupled.
4. No retry mechanism exists for failed notifications.
5. High load on Email API can cause rate-limiting issues.

---

## What Happens If 200 Emails Fail?

If 200 emails fail:

- Notification records should remain stored in the database.
- Failed deliveries should be retried automatically.
- Failure logs should be maintained.
- Users should not lose notifications.

---

## Recommended Architecture

HR Request
↓
Save Notification Record
↓
Publish Event to Queue (RabbitMQ/Kafka)
↓
Worker Services
├── Email Service
└── In-App Notification Service

This architecture is:

- Scalable
- Fault Tolerant
- Faster
- Easy to Monitor

---

## Should DB Save and Email Send Happen Together?

No.

Reason:

- Database save is critical.
- Email delivery is asynchronous.
- If email fails, notification data should still exist.

Best practice:

1. Save notification in DB.
2. Push job to queue.
3. Workers process email and app notifications.

---

## Improved Pseudocode

```javascript
function notifyAll(studentIds, message) {

    const notificationId = saveToDB(message);

    for (const studentId of studentIds) {

        queue.publish({
            notificationId,
            studentId,
            message
        });

    }

    return "Notification queued successfully";
}
```

### Worker Service

```javascript
queue.consume((job) => {

    sendEmail(job.studentId, job.message);

    pushToApp(job.studentId, job.message);

});
```

---

## Advantages

- Handles 50,000+ students efficiently.
- Supports retries.
- Prevents data loss.
- Faster response time.
- Easy horizontal scaling.