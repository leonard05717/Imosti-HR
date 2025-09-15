# Imosti Survey Application

A comprehensive survey and analytics platform built with React and Vite. This application allows users to complete training evaluation surveys and provides administrators with powerful analytics and management tools.

## 🚀 Features

### User Survey Interface

- **Multi-step Survey Form**: Interactive stepper component with 4 main steps
  - User Information Collection (Name, Course, Date, Instructor, Training Date)
  - Survey Questions with Rating System (1-5 scale)
  - Additional Feedback Collection
  - Confirmation/Verification Step for review before submission
- **Rating System**: 5-point scale with descriptive labels (Superior, Exceeds Expectation, Meets Expectation, etc.)
- **Responsive Design**: Modern UI with Mantine components
- **Data Validation**: Form validation and error handling

### Admin Dashboard

- **Analytics Dashboard**: Comprehensive data visualization and reporting
- **Filter Options**:
  - Last Week, Last Month, Last Year
  - By Specific Day with DatePicker
  - Custom date range filtering
- **Course Management**: Add, edit, and manage training courses
- **Staff Management**: User and instructor management
- **Settings & Maintenance**: System configuration and maintenance tools
- **Data Export**: Print and export functionality for reports

### Technical Features

- **Real-time Data**: Powered by Supabase for real-time database operations
- **Modern UI**: Built with Mantine UI library and TailwindCSS
- **Responsive Charts**: Data visualization with Recharts
- **Authentication**: Secure login system
- **Date Handling**: Advanced date picking and filtering with date-fns and dayjs

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite
- **UI Library**: Mantine 8.1.2 (Complete UI components suite)
- **Styling**: TailwindCSS 4.1.11
- **Database**: Supabase
- **Charts**: Recharts 2.15.4
- **Date Handling**: date-fns, dayjs, @mui/x-date-pickers
- **Icons**: Tabler Icons
- **Routing**: React Router DOM 7.7.0
- **Rich Text**: Tiptap editor
- **Utilities**: Lodash, Embla Carousel

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd survey
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add your Supabase configuration:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── AdminSide/           # Admin dashboard components
│   ├── AdminMainPage.jsx
│   ├── CourseInfo.jsx
│   ├── Courses.jsx
│   ├── Maintenance.jsx
│   ├── Settings.jsx
│   ├── Staff.jsx
│   └── components/
├── components/          # Reusable UI components
├── context/            # React context providers
├── helpers/            # Utility functions
├── pages/              # Page components
├── assets/             # Static assets
├── App.jsx             # Main survey application
├── Admin.jsx           # Admin dashboard
├── LoginPage.jsx       # Authentication
└── supabase.ts         # Supabase configuration
```

## 🎯 Usage

### For Survey Respondents

1. Access the survey application
2. Fill in personal information (Name, Course, etc.)
3. Complete the rating questions (1-5 scale)
4. Provide additional feedback
5. Review and submit the survey

### For Administrators

1. Login to the admin dashboard
2. View analytics and reports with various filters
3. Manage courses and staff
4. Export data and generate reports
5. Configure system settings

## 📊 Analytics Features

- **Time-based Filtering**: View data by specific periods
- **Custom Date Selection**: Pick specific days for detailed analysis
- **Visual Charts**: Interactive charts and graphs
- **Export Options**: Print and download reports
- **Real-time Updates**: Live data synchronization

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Dependencies

- **@mantine/core**: Complete UI components library
- **@mantine/dates**: Date picker components
- **@mantine/charts**: Chart components
- **@mantine/form**: Form handling
- **@supabase/supabase-js**: Database integration
- **react-router-dom**: Client-side routing
- **recharts**: Data visualization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is private and proprietary.

## 🆘 Support

For support and questions, please contact the development team.

---

**Version**: 2.0.0  
**Last Updated**: July 2025
