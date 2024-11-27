const path = require("path");
const webpack = require("webpack");

const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                __VUE_OPTIONS_API__: true,
                __VUE_PROD_DEVTOOLS__: false, //禁用vue devtools
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // 设为 true 以获得更详细的 mismatch 信息
            }),
        ],
    },
});
