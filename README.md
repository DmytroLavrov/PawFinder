# 🐕 PawFinder - Dog Adoption Platform

A modern, responsive web application built with Angular 21+ that helps users find their perfect canine companion. Browse through hundreds of dog breeds, save favorites, and explore detailed information about each breed.

## ✨ Features

### Core Functionality
- 🔍 **Browse Dogs** - Explore a vast collection of dog breeds with high-quality images
- 🎯 **Advanced Filtering** - Filter by breed with real-time search functionality
- ❤️ **Favorites System** - Save your favorite dogs with localStorage persistence
- 📱 **Fully Responsive** - Seamless experience across desktop, tablet, and mobile devices

### User Experience
- ⚡ **Lazy Loading** - Optimized performance with "Load More" pagination
- 🎨 **Smooth Animations** - Polished transitions and micro-interactions
- ♿ **Accessible** - WCAG compliant with proper ARIA labels and keyboard navigation

### Technical Highlights
- 🚀 **Standalone Components** - Modern Angular architecture
- 📡 **HTTP Interceptors** - Centralized error handling, loading states, and API authentication
- 🔄 **Reactive State Management** - Built with Angular Signals for optimal performance
- 🎯 **Smart/Dumb Component Pattern** - Maintainable code structure
- 🔐 **Environment Configuration** - Secure API key management

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Angular CLI 21+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pawfinder.git
   cd pawfinder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the environment template
   cp src/environments/environment.example.ts src/environments/environment.ts
   cp src/environments/environment.example.ts src/environments/environment.prod.ts
   ```

4. **Get your API key**
   - Visit [The Dog API](https://thedogapi.com/)
   - Sign up and get your free API key
   - Update `src/environments/environment.ts`:
     ```typescript
     export const environment = {
       production: false,
       dogApiUrl: 'https://api.thedogapi.com/v1',
       dogApiKey: 'live_YOUR_API_KEY_HERE', // Replace with your key
     };
     ```

5. **Run the development server**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`

6. **Build for production**
   ```bash
   npm run build
   ```
   Build artifacts will be stored in the `dist/` directory.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                    # Singleton services, guards, interceptors
│   │   ├── models/              # TypeScript interfaces and types
│   │   ├── services/            # Business logic services
│   │   └── interceptors/        # HTTP interceptors
│   │
│   ├── features/                # Feature modules (lazy-loaded)
│   │   ├── dog-list/            # Browse dogs page
│   │   ├── dog-details/         # Dog details page
│   │   └── favorites/           # Favorites page
│   │
│   ├── shared/                  # Reusable components
│   │   └── components/          # UI components (header, loader, etc.)
│   │
│   ├── app.component.ts         # Root component
│   ├── app.config.ts            # Application configuration
│   └── app.routes.ts            # Routing configuration
│
├── environments/                # Environment configurations
├── styles/                      # Global SCSS styles
│   ├── _variables.scss          # CSS variables and theme colors
│   ├── _mixins.scss             # Reusable SCSS mixins
│   └── styles.scss              # Main stylesheet
│
└── assets/                      # Static assets
```

---

## 🛠️ Tech Stack

### Core
- **Angular 21** - Progressive web framework
- **TypeScript 5** - Typed superset of JavaScript
- **RxJS 7** - Reactive programming library
- **SCSS** - CSS preprocessor

### Architecture
- **Standalone Components** - Modern Angular architecture without NgModules
- **Signals** - Fine-grained reactivity for state management
- **Functional Interceptors** - HTTP request/response handling
- **Smart/Dumb Components** - Separation of concerns pattern

### API
- **The Dog API** - RESTful API for dog breeds data

---

## 🎯 Key Features Explained

### Breed Filtering with Search
```typescript
// Real-time filtering
searchQuery = signal('');
filteredBreeds = computed(() => {
  const query = this.searchQuery().toLowerCase();
  return this.breeds().filter(breed => 
    breed.name.toLowerCase().includes(query)
  );
});
```

### Favorites with localStorage
```typescript
// Persistent favorites across sessions
private favoritesSignal = signal<DogImage[]>([]);
constructor() {
  this.loadFromStorage();
  effect(() => {
    const favorites = this.favoritesSignal();
    this.saveToStorage(favorites);
  });
}
```

---

## 📦 Build and Deployment

### Development Build
```bash
npm run build
```

### Production Build
```bash
npm run build:prod
```

### Deploy to Vercel/Netlify

1. **Connect your repository** to Vercel or Netlify
2. **Set environment variables:**
   - `DOG_API_KEY`: Your Dog API key
3. **Build command:** `npm run build`
4. **Output directory:** `dist/pawfinder/browser`

### Deploy to GitHub Pages

```bash
# Install angular-cli-ghpages
npm install -g angular-cli-ghpages

# Build and deploy
ng build --configuration=production --base-href=/pawfinder/
npx angular-cli-ghpages --dir=dist/pawfinder/browser
```

---

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

Live Demo: [(https://paw-finder-tau.vercel.app/)](https://paw-finder-tau.vercel.app/)
