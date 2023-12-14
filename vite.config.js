import { defineConfig } from "vite";

export default defineConfig({
  server: {
    fs: {
      // Specify the directories to allow
      allow: [
        // your project's root directory is allowed by default
        "/Users/kevin/Projects/misc/owic-app-service", // Add the path to your npm linked package
      ],
    },
  },
  // other configurations...
});
