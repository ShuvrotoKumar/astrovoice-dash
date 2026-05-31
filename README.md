# Astrovoice Dashboard

A modern, responsive web dashboard built with React 18, Vite, and Tailwind CSS for managing service provider operations, user management, and administrative tasks.

## Features

### Core Functionality
- **Authentication System**: Secure login, password reset, and email verification
- **Dashboard Analytics**: Comprehensive overview with charts and metrics
- **User Management**: Create, edit, and manage user accounts
- **Admin Management**: Multi-level admin access control
- **Content Management**: Blog management and categories
- **Financial Tracking**: Earnings and subscription management
- **Communication**: Built-in chat and notification system
- **Profile Management**: User profiles with customizable settings

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Ant Design components for consistent interface
- **Rich Text Editing**: React Quill for content creation
- **PDF Generation**: HTML to PDF export functionality
- **Data Visualization**: Recharts for analytics and reporting
- **Route Protection**: Secure navigation with React Router

## Tech Stack

### Frontend
- **React 18.3.1** - UI library with hooks and concurrent features
- **Vite 6.0.5** - Fast build tool and development server
- **React Router DOM 7.1.5** - Client-side routing
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **Ant Design 5.23.4** - UI component library
- **React Icons 5.5.0** - Icon library

### Additional Libraries
- **Day.js 1.11.13** - Date manipulation
- **React Quill 2.0.0** - Rich text editor
- **Recharts 2.15.4** - Chart library
- **SweetAlert2 11.26.17** - Beautiful alert modals
- **HTML2PDF.js 0.12.1** - PDF generation
- **Prop Types 15.8.1** - Runtime type checking

### Development Tools
- **ESLint 9.17.0** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Project Structure

```
society8807/
├── public/                 # Static assets
│   ├── logo.png
│   └── mar.jpg
├── src/
│   ├── assets/            # Image assets and icons
│   ├── components/        # Reusable React components
│   ├── layout/           # Layout components
│   │   └── MainLayout.jsx
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # Dashboard pages
│   │   ├── profile/      # User profile pages
│   │   ├── Blogs/        # Blog management
│   │   ├── Categories/   # Category management
│   │   ├── Earnings/     # Financial tracking
│   │   ├── Chat/         # Communication
│   │   └── ...
│   ├── shared/           # Shared components
│   │   ├── Sidebar/
│   │   └── MainHeader/
│   ├── routes/           # Route configuration
│   │   └── Routes.jsx
│   ├── App.jsx           # Main App component
│   ├── main.jsx          # Application entry point
│   ├── App.css           # Global styles
│   └── index.css         # Base styles
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
└── vercel.json          # Vercel deployment config
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd society8807
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## Pages & Routes

### Authentication
- `/sign-in` - User login
- `/forget-password` - Password reset request
- `/verification-code` - Email verification
- `/new-password` - Set new password

### Main Application (Protected Routes)
- `/` - Dashboard overview
- `/user-details` - User management
- `/create-user` - Add new user
- `/profile` - User profile
- `/edit-profile` - Edit profile information
- `/change-password` - Change password
- `/settings` - Application settings

### Admin Features
- `/create-admin` - Create admin account
- `/add-admin` - Add new admin
- `/categories` - Manage categories
- `/blogs` - Blog management
- `/earnings` - Financial dashboard
- `/subscriptions` - Subscription management
- `/chat` - Communication center
- `/notifications` - Notification center

### Information Pages
- `/privacy-policy` - Privacy policy
- `/terms-and-condition` - Terms and conditions
- `/about-us` - About page

## UI Components

### Layout Structure
- **MainLayout**: Main application layout with sidebar and header
- **Sidebar**: Navigation sidebar with responsive design
- **MainHeader**: Top navigation bar with user menu

### Key Features
- **Responsive Design**: Mobile-friendly with collapsible sidebar
- **Dark Mode Support**: Ready for dark mode implementation
- **Accessibility**: ARIA labels and keyboard navigation
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages

## Configuration

### Vite Configuration
- React plugin for fast refresh
- Build optimization for production
- Development server with HMR

### Tailwind CSS
- Custom color palette
- Responsive breakpoints
- Utility classes for rapid development

### ESLint
- React best practices
- Modern JavaScript standards
- Consistent code formatting

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting provider

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common issues

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
