import { argv } from 'yargs';
import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import commonWebpackConfig from './webpack.common';

const mergedConfiguration: Configuration = merge(commonWebpackConfig, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: false,
            }),
        ],
    },
});

// eslint-disable-next-line import/no-mutable-exports
let prodWebpackConfiguration = mergedConfiguration;
if (argv.analyze) {
    mergedConfiguration.plugins!.push(new BundleAnalyzerPlugin());
    const smp = new SpeedMeasurePlugin();
    prodWebpackConfiguration = smp.wrap(mergedConfiguration);
}

export default prodWebpackConfiguration;
