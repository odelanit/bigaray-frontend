const env = process.env.NODE_ENV || 'development';
const config = {
  development: require('./development.js').default,
  production: require('./production.js').default,
  // staging: require('./staging.config')
};

const general = {

};

// export default Object.assing(config[env], general);
// export default general;
export default { ...general, ...config[env] };
