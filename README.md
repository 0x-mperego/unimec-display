# Digital Signage Web App

A simple and intuitive digital signage management system built with Next.js 15, featuring real-time content updates and mobile-first design.

## ✨ Features

### 🎯 Core Functionality
- **Simple Content Management**: Upload images (JPG/PNG) and create custom text messages
- **Real-time Updates**: Changes appear instantly on all connected displays via Server-Sent Events
- **Mobile-First Design**: Optimized for smartphone management with desktop enhancements
- **Progressive Disclosure**: Advanced features hidden but accessible when needed

### 🎨 Content Creation
- **Image Upload**: Drag & drop support, auto-optimization, 10MB max
- **Text Messages**: Live preview with 3 style presets (Elegant, Vibrant, Minimal)
- **Advanced Customization**: Font families, sizes, colors, and positioning
- **Duration Control**: 5-60 seconds per content item with intuitive sliders

### 📺 Display Features
- **Fullscreen Mode**: Click anywhere to enter fullscreen
- **Smooth Transitions**: Fade effects between content
- **Auto-Reconnect**: Displays automatically reconnect if connection is lost
- **Connection Status**: Visual indicator of display connectivity

### 🔐 Security & Management
- **Simple Authentication**: Single password protection with 30-day sessions
- **Content Limits**: Maximum 50 items with auto-cleanup after 30 days
- **Storage Management**: Automatic removal of unused images
- **Rate Limiting**: Protection against brute force attacks

## 🚀 Quick Start

1. **Setup Supabase**: Create database and storage bucket (see [SETUP.md](./SETUP.md))
2. **Configure Environment**: Copy `.env.local.example` and add your keys
3. **Install & Run**:
   ```bash
   bun install
   bun run dev
   ```
4. **Access**: Login at `http://localhost:3000` and display at `/display`

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## 📱 Usage

### Admin Panel (`/admin`)
- Login with your configured password
- Add content using the "+" button
- Manage existing content with inline controls
- Copy display URL from header

### Display Screen (`/display`)
- Open on monitors/displays
- Click anywhere for fullscreen mode
- Automatically rotates through content
- Shows connection status and content indicators

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 19
- **UI Components**: shadcn/ui (New York style)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Real-time**: Server-Sent Events + Supabase Realtime
- **Forms**: React Hook Form + Zod validation
- **Code Quality**: Ultracite (Biome)

## 📁 Project Structure

```
├── app/
│   ├── admin/           # Admin dashboard
│   ├── login/           # Authentication
│   ├── display/         # Public display
│   └── api/             # API routes
├── components/
│   ├── auth/            # Login components
│   ├── dashboard/       # Admin interface
│   ├── display/         # Display components
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── auth/            # Authentication utilities
│   └── supabase/        # Database client
└── instructions/        # Project requirements
```

## 🎯 Design Principles

- **Mobile-First**: Optimized for smartphone management
- **Progressive Disclosure**: Complex features hidden but accessible
- **Immediate Feedback**: Real-time updates and Toast notifications
- **Theme-Agnostic**: Uses only shadcn/ui components without customization
- **Defensive Programming**: Graceful error handling and recovery

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Other Platforms
Compatible with any Next.js hosting platform:
- Netlify
- Railway  
- Heroku
- Self-hosted

## 📊 Limits & Specifications

- **Content Items**: 50 maximum
- **Image Files**: 10MB max, JPG/PNG only
- **Content Duration**: 5-60 seconds
- **Session Length**: 30 days
- **Auto-cleanup**: 30 days for unused images

## 🎨 Customization

### Text Presets
Modify presets in `components/dashboard/text-message-form.tsx`

### Themes
Change shadcn/ui theme by updating CSS variables in `app/globals.css`

### Branding
Update metadata in `app/layout.tsx` and add your logo

## 🔧 Development

### Commands
```bash
# Development
bun run dev

# Build
bun run build

# Production
bun run start

# Linting
bun run lint
npx ultracite check

# Code formatting
npx ultracite fix
```

### Code Quality
- **Ultracite**: Enforces strict type safety and accessibility
- **Biome**: Fast formatting and linting
- **TypeScript**: Strict mode enabled
- **Accessibility**: WCAG compliant components

## 📞 Support

1. Check [SETUP.md](./SETUP.md) for configuration help
2. Review browser console for errors
3. Verify Supabase setup and permissions
4. Ensure environment variables are correct

## 📄 License

Built for educational and commercial use. Customize as needed for your digital signage requirements.

---

**Perfect for**: Restaurants, retail stores, offices, gyms, waiting rooms, and any business needing simple digital signage management.