const path = require(`path`);
const publicPath = path.join(__dirname, `public`);

module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: publicPath
  },
  devtool: `source-maps`,
  devServer: {
    contentBase: publicPath
  }
};
