# Digital Signage Setup Guide

This guide will help you set up and deploy your digital signage application.

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd unimec-display

# Install dependencies
bun install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is ready, go to **Settings > API** to get your keys
3. Go to **SQL Editor** and run the following queries:

#### Create the contents table:
```sql
CREATE TABLE contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(10) NOT NULL CHECK (type IN ('image', 'text')),
  data JSONB NOT NULL,
  duration INTEGER NOT NULL CHECK (duration >= 5 AND duration <= 60),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster ordering
CREATE INDEX idx_contents_order ON contents(order_index);

-- Enable real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE contents;
```

#### Create storage bucket for images:
```sql
-- Create bucket for content images
INSERT INTO storage.buckets (id, name, public) VALUES ('content-images', 'content-images', true);

-- Set up storage policies
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'content-images');
CREATE POLICY "Authenticated insert access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'content-images');
CREATE POLICY "Authenticated delete access" ON storage.objects FOR DELETE USING (bucket_id = 'content-images');
```

### 3. Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
ADMIN_PASSWORD=your-secure-password

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Application

```bash
# Development
bun run dev

# Production build
bun run build
bun run start
```

## 📱 Usage

1. **Access Admin Panel**: Go to `http://localhost:3000` (redirects to `/admin`)
2. **Login**: Use the password you set in `ADMIN_PASSWORD`
3. **Add Content**: Click "Add Content" to upload images or create text messages
4. **Display Content**: Open `http://localhost:3000/display` on your monitors
5. **Fullscreen**: Click anywhere on the display page to enter fullscreen mode

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial digital signage setup"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add your environment variables in the Vercel dashboard
   - Deploy!

3. **Update Environment Variables**:
   After deployment, update your `NEXT_PUBLIC_APP_URL` to your Vercel domain:
   ```env
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

### Other Deployment Options

The app can be deployed on any platform that supports Next.js:
- **Netlify**: Add build command `bun run build` and publish directory `.next`
- **Railway**: Connect GitHub repo and add environment variables
- **Heroku**: Use Node.js buildpack with start script

## 🔧 Configuration

### Content Limits
- **Maximum content items**: 50
- **Image file size**: 10MB max
- **Image formats**: JPG, PNG
- **Duration range**: 5-60 seconds

### Storage Auto-cleanup
Images are automatically cleaned up after 30 days if not referenced by any content.

### Security
- Single password authentication
- 30-day session persistence
- HTTPS required in production
- Rate limiting on login attempts

## 🎨 Customization

### Themes
The app uses shadcn/ui components which are theme-agnostic. You can easily change themes by:
1. Installing a different shadcn theme
2. Updating CSS variables in `app/globals.css`

### Text Presets
Modify text presets in `components/dashboard/text-message-form.tsx`:

```typescript
const presets = {
  elegant: {
    name: 'Elegant',
    fontFamily: 'Georgia, serif',
    fontSize: 48,
    textColor: '#1f2937',
    backgroundColor: '#f9fafb',
    textAlign: 'center' as const,
  },
  // Add your custom presets here
}
```

### Content Duration Limits
Modify duration limits in the slider components and API validation.

## 🔍 Troubleshooting

### Common Issues

1. **"Failed to load contents"**
   - Check Supabase URL and keys in `.env.local`
   - Verify the `contents` table exists
   - Check browser console for errors

2. **Images not uploading**
   - Verify storage bucket `content-images` exists
   - Check storage policies are set correctly
   - Ensure file size is under 10MB

3. **Display not updating in real-time**
   - Check if real-time is enabled on the `contents` table
   - Verify Server-Sent Events are working (check browser network tab)

4. **Authentication issues**
   - Verify `ADMIN_PASSWORD` is set correctly
   - Clear browser cookies and try again

### Browser Support

- **Chrome/Edge**: Full support including fullscreen API
- **Firefox**: Full support
- **Safari**: Limited fullscreen support on mobile
- **Mobile browsers**: Good support, fullscreen may require user interaction

### Performance Tips

1. **Optimize images**: Compress images before uploading for better performance
2. **Monitor content count**: Keep under 50 items for optimal performance
3. **Stable internet**: Ensure reliable internet for real-time updates

## 📞 Support

If you encounter issues:
1. Check this documentation
2. Review browser console for errors
3. Verify Supabase setup and permissions
4. Check environment variables are correctly set

## 🔄 Updates

To update the application:
1. Pull latest changes from repository
2. Run `bun install` to update dependencies
3. Check for any new environment variables needed
4. Test in development before deploying

---

🎉 **You're all set!** Your digital signage system should now be running smoothly.