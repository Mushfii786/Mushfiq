# Security Specification & Threat Model

## 1. Data Invariants
- **Inquiries / Messages (`/messages/{messageId}`)**:
  - Unauthenticated visitors can create messages if valid schema is met (name, valid email format, message within size limits).
  - Messages cannot be modified or updated by public visitors once created (`allow update: if false`).
  - Messages cannot be deleted or listed/read by unauthenticated visitors (`allow read, delete: if isAdmin()`).
- **Videos (`/videos/{videoId}`)**:
  - Anyone can read/list videos (`allow read: if true`).
  - Creation and deletion of videos requires verified admin authentication (`isAdmin()`).
  - Community engagement updates (views and likes increments) can be executed safely with strict field diff guards (`affectedKeys().hasOnly(['views', 'likes'])`) without allowing mutation of title, videoUrl, or script payloads.
- **Admins (`/admins/{userId}`)**:
  - Only existing admins can read or manage admin documents.
  - Self-elevation or role promotion from unauthorized clients is strictly prohibited.
  - Bootstrapped admin email `muhammedmushfiq178@gmail.com` with `email_verified == true`.

---

## 2. The "Dirty Dozen" Payloads
1. **Payload 1 (Ghost Field Injection)**:
   - Target: `/messages/{messageId}` create
   - Attack: `{ name: "Hacker", email: "hacker@test.com", message: "Hi", role: "admin", verified: true }`
   - Expected Result: `PERMISSION_DENIED` (Rejected by strict `hasOnly` key constraint).

2. **Payload 2 (Unverified Email Spoofing)**:
   - Target: `/videos/{videoId}` create
   - Attack: Token claim `email: "muhammedmushfiq178@gmail.com"` but `email_verified: false`
   - Expected Result: `PERMISSION_DENIED` (Rejected by `email_verified == true` mandate).

3. **Payload 3 (Denial of Wallet Oversized String)**:
   - Target: `/messages/{messageId}` create
   - Attack: `{ name: "Spam", email: "spam@test.com", message: "A".repeat(50000) }`
   - Expected Result: `PERMISSION_DENIED` (Rejected by message size check `<= 3000`).

4. **Payload 4 (Malformed Email Format)**:
   - Target: `/messages/{messageId}` create
   - Attack: `{ name: "Bob", email: "not-an-email", message: "Hello" }`
   - Expected Result: `PERMISSION_DENIED` (Rejected by email pattern regex).

5. **Payload 5 (Public Message Snoop/List)**:
   - Target: `/messages/{messageId}` read/list
   - Attack: Unauthenticated or non-admin user querying collection `/messages`
   - Expected Result: `PERMISSION_DENIED` (PII protection, only admin can read).

6. **Payload 6 (Shadow Mutation of Video Details)**:
   - Target: `/videos/{videoId}` update
   - Attack: Non-admin trying to update `videoUrl: "https://malicious-site.com/exploit.mp4"`
   - Expected Result: `PERMISSION_DENIED` (Only `views`/`likes` allowed for non-admin).

7. **Payload 7 (Path Variable Poisoning / ID Injection)**:
   - Target: `/videos/{videoId}` create
   - Attack: Video ID with path traversal or script tags: `videoId = "../../root/etc"`
   - Expected Result: `PERMISSION_DENIED` (Rejected by `isValidId()` regex `^[a-zA-Z0-9_\\-]+$`).

8. **Payload 8 (Arbitrary State Overwrite on Messages)**:
   - Target: `/messages/{messageId}` update
   - Attack: Client attempting to mark `read: false` or change message text
   - Expected Result: `PERMISSION_DENIED` (Non-admin update denied).

9. **Payload 9 (Self-Promotion to Admin)**:
   - Target: `/admins/{uid}` create
   - Attack: Non-admin user writing their own uid to `/admins/{uid}`
   - Expected Result: `PERMISSION_DENIED`.

10. **Payload 10 (Null Pointer on Delete)**:
    - Target: `/messages/{messageId}` delete
    - Attack: Non-admin trying to trigger delete bypass
    - Expected Result: `PERMISSION_DENIED`.

11. **Payload 11 (Video Creation by Unauthenticated Client)**:
    - Target: `/videos/{videoId}` create
    - Attack: Unauthenticated client sending valid video shape
    - Expected Result: `PERMISSION_DENIED`.

12. **Payload 12 (Blanket Collection Query Scraping)**:
    - Target: `/admins` list
    - Attack: Querying all admin documents
    - Expected Result: `PERMISSION_DENIED`.
