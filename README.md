# Todo List Application

A comprehensive, feature-rich Todo List web application built with Next.js, React, TypeScript, and Tailwind CSS. This application provides a complete task and event management solution with advanced features like calendar views, filtering, notifications, and more.

## 🚀 Features

### Core Functionality
- **Task Management**: Create, edit, delete, and mark complete tasks
- **Event Management**: Schedule and manage events with start/end dates and times
- **Priority System**: Set low, medium, or high priority for tasks and events
- **Status Tracking**: Track pending, in-progress, and completed items
- **Due Dates & Times**: Set specific due dates and times for tasks
- **Tags & Categories**: Organize items with custom tags

### Advanced Features
- **Recurring Items**: Support for daily, weekly, monthly, and custom recurring tasks/events
- **Comments System**: Add notes and comments to tasks and events
- **Starring & Liking**: Star important items and like favorites
- **Visual Indicators**: Color-coded priority and status indicators
- **Overdue Detection**: Automatic detection and highlighting of overdue items

### Calendar & Views
- **Multiple Calendar Views**: Month, week, and day views
- **Calendar Navigation**: Easy navigation between different time periods
- **Visual Calendar**: Interactive calendar with task and event display
- **List View**: Traditional list view with advanced filtering

### Filtering & Search
- **Advanced Filtering**: Filter by status, priority, tags, and date range
- **Search Functionality**: Search across titles, descriptions, and tags
- **Quick Filters**: Predefined filters for common use cases
- **Active Filter Display**: Visual representation of applied filters

### Notifications & Reminders
- **Overdue Notifications**: Automatic detection of overdue items
- **Upcoming Reminders**: Notifications for upcoming tasks and events
- **Notification Panel**: Dedicated panel for managing notifications
- **Visual Alerts**: Color-coded notification system

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Accessibility**: Built with accessibility best practices
- **Real-time Updates**: Instant updates without page refresh
- **Local Storage**: Persistent data storage using browser localStorage

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Date Handling**: date-fns
- **State Management**: React Hooks
- **Storage**: Local Storage (with potential for backend integration)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd to-do-list
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── AddItemModal.tsx   # Modal for adding/editing items
│   ├── Calendar.tsx       # Calendar view component
│   ├── EventList.tsx      # Event list component
│   ├── FilterPanel.tsx    # Filtering interface
│   ├── Header.tsx         # Application header
│   ├── NotificationPanel.tsx # Notifications panel
│   ├── Sidebar.tsx        # Navigation sidebar
│   └── TaskList.tsx       # Task list component
├── lib/                   # Utility functions
│   ├── storage.ts         # Local storage management
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript type definitions
    └── index.ts           # Application types
```

## 🎯 Usage Guide

### Creating Items
1. Click the "Add Item" button in the header
2. Choose between Task or Event
3. Fill in the required fields (title, dates, etc.)
4. Add optional details like description, tags, and priority
5. Set up recurring patterns if needed
6. Click "Create" to save

### Managing Items
- **Edit**: Click the edit icon on any item
- **Delete**: Click the delete icon to remove items
- **Complete**: Click the checkbox or status button
- **Star**: Click the star icon to mark as important
- **Like**: Click the heart icon to like items

### Calendar Navigation
- **Switch Views**: Use the sidebar to switch between list and calendar views
- **Calendar Types**: Choose between month, week, and day views
- **Navigation**: Use Previous/Next buttons or click "Today"
- **Date Selection**: Click on any date to view details

### Filtering & Search
1. Click "Filters" in the main interface
2. Use search box for text-based filtering
3. Select status, priority, or tags to filter
4. Set date ranges for time-based filtering
5. View active filters and remove as needed

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific settings:

```env
NEXT_PUBLIC_APP_NAME=TodoApp
NEXT_PUBLIC_VERSION=1.0.0
```

### Customization
- **Colors**: Modify the primary color scheme in `tailwind.config.js`
- **Storage**: Replace localStorage functions in `src/lib/storage.ts` with your backend API
- **Notifications**: Extend notification functionality in `src/components/NotificationPanel.tsx`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted servers

## 🔮 Future Enhancements

- **Backend Integration**: Add server-side storage and user authentication
- **Real-time Collaboration**: Multi-user support with real-time updates
- **Mobile App**: React Native version for mobile devices
- **Advanced Notifications**: Push notifications and email reminders
- **Data Export**: Export tasks and events to various formats
- **Integration**: Connect with calendar services (Google Calendar, Outlook)
- **Analytics**: Task completion analytics and productivity insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Built with ❤️ using Next.js, React, and TypeScript** 