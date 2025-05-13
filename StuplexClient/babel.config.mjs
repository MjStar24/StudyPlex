export default {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'dotenv-import',
        {
          moduleName: '@env',  // This is the name you'll use to import the variables
          path: '.env',         // Path to your .env file
        },
      ],
    ],
  };
  