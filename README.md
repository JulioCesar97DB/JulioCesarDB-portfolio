# Professional Developer Portfolio

A modern, interactive professional portfolio and CV built with cutting-edge web technologies. This project showcases development skills, work experience, and projects in an elegant and functional format.

## ✨ Key Features

- **Fully responsive design** that works perfectly on all devices
- **Dark/light mode toggle** with system preference detection
- **Customizable color themes** with multiple options
- **Interactive and downloadable CV** based on [jsonresume.org](https://jsonresume.org/schema/) schema
- **Keyboard navigation** for improved accessibility
- **SEO optimized** with configurable metadata
- **High-performance** thanks to Astro's "zero JavaScript by default" approach
- **Print-friendly version** for easy CV downloading

## 🛠️ Technologies Used

### Frontend
- **[Astro](https://astro.build/)**: High-performance web framework for content-focused websites
- **TypeScript**: Static typing for improved code quality
- **HTML5 & CSS3**: Modern web standards
- **Modular components**: Reusable component architecture

### Styling
- **Custom CSS variables**: For theme management
- **Responsive design**: Mobile-first approach
- **Smooth animations**: For enhanced user experience

### Development Tools
- **[pnpm](https://pnpm.io/)**: Efficient package management
- **Git & GitHub**: Version control and repository hosting
- **Continuous deployment**: Automated build and deployment

## 🚀 Getting Started

### 1. Use this Repo as an Astro Project Template

- Uses [pnpm](https://pnpm.io/installation) as the package manager.

```bash
# Enable pnpm on MacOS, WSL & Linux:
corepack enable
corepack prepare pnpm@latest --activate
```

# Initialize the project
```bash
pnpm create astro@latest -- --template Smilesharks/dev-portfolio
```

### 2. Add Your Content:

Edit the `cv.json` file to create your own printable Portfolio/CV.

### 3. Launch the Development Server:

```bash
# Enjoy the results
pnpm dev
```
1. Open [**http://localhost:4321**](http://localhost:4321/) in your browser to view the result 🚀

### 4. Customizable Themes:
Change the data-theme of `cv.json` and choose one of the color themes defined in theme.css: red, blue, green, cyber, and default, with their dark mode variants, or create your own.

## 🧞 Commands

|     | Command         | Action                                                                       |
| :-- | :-------------- | :--------------------------------------------------------------------------- |
| ⚙️  | `dev` or `start`| Launches a local development server at `localhost:4321`.                   |
| ⚙️  | `build`         | Checks for errors and creates a production build in `./dist/`. |
| ⚙️  | `preview`       | Local preview of the production build at `localhost:4321`                 |

## 📁 Project Structure

```
.
├── public/               # Static assets and theme CSS
│   └── themes/
│       └── themes.css    # Custom color themes
├── src/
│   ├── components/       # UI components
│   │   ├── sections/     # CV sections (About, Experience, etc.)
│   │   ├── KeyboardManager.astro  # Keyboard navigation support
│   │   ├── Section.astro          # Section component template
│   │   └── ThemeSwitch.astro      # Theme toggler component
│   ├── icons/            # SVG icons for technologies and social media
│   │   ├── tech/         # Programming languages and frameworks icons
│   │   └── social/       # Social media and contact icons
│   ├── layouts/          # Page layouts and templates
│   ├── pages/            # Website pages and routes
│   ├── cv.d.ts           # TypeScript definitions for CV data
│   ├── env.d.ts          # Environment variables types
│   └── types.d.ts        # Global type definitions
└── cv.json               # Your CV/resume data
```

## 💻 Technology Expertise

This portfolio showcases proficiency in various technologies including:

- **Languages**: JavaScript, TypeScript, HTML, CSS
- **Frontend**: React, Redux, Next.js, Astro
- **Backend**: Node.js, Express, Django
- **Databases**: MongoDB, PostgreSQL, MySQL
- **DevOps**: Docker, CI/CD, Git
- **Mobile**: Flutter, React Native
- **Design**: Figma, Adobe XD
- **Testing**: Jest, Cypress
- **Cloud**: AWS, Vercel, Netlify

## ⚡ Performance Features

- **Optimized asset loading** for faster page loads
- **Static site generation** for improved performance
- **Lazy-loaded components** where appropriate
- **Minimal JavaScript** for core functionality
- **Optimized images** and assets

## 🙏 Acknowledgements

CV JSON schema from [**jsonresume.org**](https://jsonresume.org/schema/)

Based on [**Bartosz Jarocki - Print-friendly, minimalist CV page**](https://github.com/BartoszJarocki/cv) and [**Miguel Ángel Durán - minimalist-portfolio-json**](https://github.com/midudev/minimalist-portfolio-json)
