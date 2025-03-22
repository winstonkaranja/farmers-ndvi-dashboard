# Farmers NDVI Dashboard

A comprehensive dashboard for farmers to monitor and analyze their fields using NDVI (Normalized Difference Vegetation Index) visualization.

## Deployment Guide

This guide will walk you through the process of deploying the Farmers NDVI Dashboard using Visual Studio Code, starting from a GitHub repository.

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)
- A [GitHub](https://github.com/) account

### Step 1: Clone the GitHub Repository

1. Open your terminal or command prompt
2. Navigate to the directory where you want to store the project
3. Clone the repository using the following command:

   \`\`\`bash
   git clone https://github.com/your-username/farmers-ndvi-dashboard.git
   \`\`\`

   Replace `your-username` with the actual GitHub username and `farmers-ndvi-dashboard` with the actual repository name.

4. Navigate into the project directory:

   \`\`\`bash
   cd farmers-ndvi-dashboard
   \`\`\`

### Step 2: Open the Project in VS Code

1. Open Visual Studio Code
2. Go to File > Open Folder (or press Ctrl+K Ctrl+O on Windows/Linux, Cmd+O on Mac)
3. Navigate to the cloned repository folder and select it
4. Click "Select Folder" to open the project

Alternatively, if you're already in the terminal in the project directory, you can run:

\`\`\`bash
code .
\`\`\`

### Step 3: Install Dependencies

1. Open the integrated terminal in VS Code by going to Terminal > New Terminal (or press Ctrl+` on Windows/Linux, Cmd+` on Mac)
2. Run one of the following commands to install the project dependencies:

   \`\`\`bash
   # Using npm
   npm install

   # Using yarn
   yarn install
   \`\`\`

3. Wait for the installation to complete (this may take a few minutes)

### Step 4: Run the Development Server

To test the application locally before deployment:

1. In the VS Code terminal, run one of the following commands:

   \`\`\`bash
   # Using npm
   npm run dev

   # Using yarn
   yarn dev
   \`\`\`

2. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)
3. Verify that the application is running correctly

### Step 5: Build for Production

Before deploying, you need to create a production build:

1. In the VS Code terminal, run one of the following commands:

   \`\`\`bash
   # Using npm
   npm run build

   # Using yarn
   yarn build
   \`\`\`

2. After the build completes, you can test the production build locally with:

   \`\`\`bash
   # Using npm
   npm run start

   # Using yarn
   yarn start
   \`\`\`

### Step 6: Deploy to Vercel (Recommended)

The easiest way to deploy this Next.js application is using Vercel, which integrates seamlessly with GitHub:

1. Push any changes you've made to your GitHub repository:

   \`\`\`bash
   git add .
   git commit -m "Ready for deployment"
   git push
   \`\`\`

2. Go to [Vercel](https://vercel.com/) and sign in with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Configure your project settings (the defaults usually work well for Next.js projects)
6. Click "Deploy"
7. Vercel will automatically build and deploy your application
8. Once deployed, Vercel will provide you with a URL to access your application

#### Using Vercel CLI (Alternative)

If you prefer using the command line:

1. Install the Vercel CLI:

   \`\`\`bash
   # Using npm
   npm install -g vercel

   # Using yarn
   yarn global add vercel
   \`\`\`

2. In the VS Code terminal, navigate to your project directory and run:

   \`\`\`bash
   vercel
   \`\`\`

3. Follow the prompts to link to your GitHub repository and deploy your application

### Alternative Deployment Options

#### Deploy to Netlify from GitHub

1. Push your code to GitHub as described above
2. Go to [Netlify](https://www.netlify.com/) and sign in with your GitHub account
3. Click "New site from Git"
4. Select GitHub and authorize Netlify
5. Select your repository
6. Configure build settings:
   - Build command: `npm run build` or `yarn build`
   - Publish directory: `.next`
7. Click "Deploy site"

#### Deploy to a Traditional Web Server

1. Build your application as described in Step 5
2. Copy the contents of the `.next` folder, `public` folder, `package.json`, and `next.config.js` to your web server
3. Install dependencies on the server with `npm install --production`
4. Start the application with `npm start`

### Setting Up a New GitHub Repository (If Needed)

If you need to create a new GitHub repository for an existing project:

1. Go to [GitHub](https://github.com/) and sign in
2. Click the "+" icon in the top-right corner and select "New repository"
3. Name your repository (e.g., "farmers-ndvi-dashboard")
4. Choose public or private visibility
5. Click "Create repository"
6. Follow the instructions on GitHub to push an existing repository from the command line

### Troubleshooting

If you encounter any issues during deployment:

1. **Dependency Errors**: Try deleting the `node_modules` folder and `package-lock.json` (or `yarn.lock`), then run `npm install` or `yarn install` again
2. **Build Errors**: Check the error messages in the terminal for specific issues
3. **Runtime Errors**: Check the browser console and server logs for error messages
4. **Git Issues**: Ensure your GitHub repository is properly configured and you have the correct permissions

### Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Documentation](https://vercel.com/docs)
- [Netlify Deployment Documentation](https://docs.netlify.com/)
- [GitHub Documentation](https://docs.github.com/)

## Features

- Upload and process TIFF files for NDVI analysis
- Visualize NDVI data with customizable color maps
- Track changes in vegetation health over time
- Add new images to existing projects for continuous monitoring
- Compare NDVI values across different time periods
- Stitch multiple images together for large fields
- AI-powered insights and recommendations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

