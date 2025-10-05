# Bundler Configuration Guide

If you encounter issues loading timezone data in your bundler, here are configurations that help:

## Vite (Recommended)

Add to your `vite.config.js`:

```javascript
export default {
  assetsInclude: ['**/*.json'],
  build: {
    rollupOptions: {
      external: [],
      output: {
        // Ensure JSON files are properly handled
        assetFileNames: '[name].[ext]'
      }
    }
  }
}
```

## Webpack

Add to your `webpack.config.js`:

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.json$/,
        type: 'asset/resource',
      },
    ],
  },
};
```

## Next.js

Add to your `next.config.js`:

```javascript
module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'asset/resource',
    });
    return config;
  },
};
```

## Manual Copy Solution

If bundler configuration doesn't work, manually copy the data file to your public directory:

```bash
cp node_modules/timezone-search/data/timezone-data.json public/data/
```

The package will automatically find it at `/data/timezone-data.json`.