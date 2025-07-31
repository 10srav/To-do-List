# Gmail-like Messages Feature

## Overview
Your TaskSaver application now includes a complete Gmail-like messaging system that allows you to compose, send, and manage messages. All messages are stored in MongoDB.

## Features

### ✅ Complete Gmail-like Interface
- **Inbox, Sent, Drafts, Starred, Important, Archived, Trash folders**
- **Message composition with rich features**
- **Message threading and organization**
- **Search functionality**
- **Star and priority management**

### ✅ Message Composition
- **To, CC, BCC fields**
- **Subject and body**
- **Priority levels (Low, Normal, High)**
- **Attachment support**
- **Draft saving**
- **Send functionality**

### ✅ Message Management
- **Read/Unread status**
- **Star messages**
- **Delete messages (moves to trash)**
- **Archive messages**
- **Label management**

## How to Use

### 1. Access Messages
- Click on **"Messages"** in the sidebar navigation
- The interface will switch to the Gmail-like view

### 2. Compose a New Message
- Click the **"Compose"** button in the messages sidebar
- Fill in the recipient(s) in the "To" field (comma-separated for multiple)
- Add CC/BCC recipients if needed
- Enter a subject
- Write your message in the body
- Set priority if needed
- Attach files if required
- Click **"Send"** to send or **"Save Draft"** to save for later

### 3. Manage Messages
- **View messages**: Click on any message in the list to read it
- **Star messages**: Click the star icon next to any message
- **Delete messages**: Click the trash icon (moves to trash folder)
- **Reply**: Click "Reply" when viewing a message
- **Forward**: Click "Forward" when viewing a message
- **Search**: Use the search bar to find specific messages

### 4. Folder Navigation
- **Inbox**: All received and sent messages
- **Sent**: Messages you've sent
- **Drafts**: Unsent draft messages
- **Starred**: Messages you've starred
- **Important**: Messages marked as important
- **Archived**: Archived messages
- **Trash**: Deleted messages

## Database Storage

All messages are stored in MongoDB with the following structure:

```javascript
{
  from: "sender@example.com",
  to: ["recipient1@example.com", "recipient2@example.com"],
  cc: ["cc@example.com"],
  bcc: ["bcc@example.com"],
  subject: "Message Subject",
  body: "Message content",
  priority: "normal", // low, normal, high
  status: "sent", // draft, sent, archived, deleted
  isRead: false,
  isStarred: false,
  isImportant: false,
  labels: ["work", "personal"],
  attachments: [
    {
      filename: "document.pdf",
      size: 1024,
      type: "application/pdf"
    }
  ],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  sentAt: "2024-01-01T00:00:00.000Z"
}
```

## API Endpoints

The following API endpoints are available:

- `GET /api/messages` - Get all messages with filtering
- `POST /api/messages` - Create a new message/draft
- `GET /api/messages/[id]` - Get a specific message
- `PUT /api/messages/[id]` - Update a message
- `DELETE /api/messages/[id]` - Delete a message (move to trash)
- `POST /api/messages/send` - Send a message

## Configuration

The system is configured to use MongoDB. Make sure your `.env.local` file has:

```
MONGODB_URI=mongodb://localhost:27017/todoapp
NEXT_PUBLIC_USE_API=true
```

## Features Included

✅ **Gmail-like UI/UX**
✅ **Message composition and sending**
✅ **Folder organization**
✅ **Search functionality**
✅ **Star and priority management**
✅ **Draft saving**
✅ **Reply and forward**
✅ **Attachment support**
✅ **MongoDB storage**
✅ **Responsive design**
✅ **Real-time updates**

## Next Steps

1. **Start the application**: `npm run dev`
2. **Navigate to Messages**: Click "Messages" in the sidebar
3. **Compose your first message**: Click "Compose" and start writing!

The Gmail-like messaging system is now fully integrated into your TaskSaver application and ready to use!