module.exports = {
    plugins: {
        'postcss-pxtorem': {
            rootValue: 37.5, // 结合lib-flexible的默认设置，你可能需要根据设计稿来调整这个值
            propList: ['*'], // 可以从px更改为rem的属性
            selectorBlackList: [], // 忽略的选择器，保持为空数组即可，除非有特定需求
        },
    },
};
  