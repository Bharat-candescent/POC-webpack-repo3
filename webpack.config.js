const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

// Convert to a function to access command-line environment variables (argv)
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  console.log(`[HOST APP CONFIG] Building in ${argv.mode} mode.`);

  // Define dynamic URLs for the Micro Frontends (MFEs)
  const remoteUrls = {
    // 🟢 Development (Localhost) URLs
    development: {
      CreditCardMFE: 'CreditCardMFE@http://localhost:3001/remoteEntry.js', // (3001)
      OnlineBankingMFE: 'OnlineBankingMFE@http://localhost:3002/remoteEntry.js', // (3002)
      creditCardMFE1: 'creditCardMFE1@http://localhost:8081/remoteEntry.js', // (8081)
      onlineBankingMFE1: 'onlineBankingMFE1@http://localhost:8082/remoteEntry.js', // (8082)
    },
    
    // 🚀 Production (Live) URLs - Mapped to your Vercel domains
    // In the Host App's webpack.config.js (poc-webpack-repo3)
    production: {
      // Must use the full Vercel URL to fetch the initial remoteEntry.js file
      CreditCardMFE: 'CreditCardMFE@https://poc-webpack-repo2.vercel.app/remoteEntry.js',
      OnlineBankingMFE: 'OnlineBankingMFE@https://poc-webpack-repo1.vercel.app/remoteEntry.js',
      creditCardMFE1: 'creditCardMFE1@https://poc-webpack-repo4.vercel.app/remoteEntry.js',
      onlineBankingMFE1: 'onlineBankingMFE1@https://poc-webpack-repo5.vercel.app/remoteEntry.js',
    },
  };

  // Select the appropriate set of remote URLs
  const remotesToUse = isProduction ? remoteUrls.production : remoteUrls.development;
  
  // Set dynamic publicPath: '/' for production, full URL for local dev
  const publicPath = isProduction ? '/' : 'http://localhost:3000/';

  return {
    entry: './src/index.js',
    
    devServer: {
      port: 3000,
      historyApiFallback: true,
    },
    
    output: {
      publicPath: publicPath, 
    },
    
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
      ],
    },
    
    plugins: [
      new ModuleFederationPlugin({
        name: 'HostApp',
        remotes: isProduction ? remoteUrls.production : remoteUrls.development, // 🟢 Now uses Vercel URLs in production mode
        shared: {
          ...deps,
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: deps['react-dom'],
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
    
    resolve: {
      extensions: ['.js', '.jsx'],
    },
  };
};