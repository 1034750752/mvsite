// 公共函数：解析路由并提取相关值
export function parseRoute(route) {
    if (!route.matched[2]) return null; // 如果匹配不到直接返回 null

    const cateUrl = decodeURIComponent(route.fullPath).split("/")[2].split("-");
    // 提取分类、年份和国家的值
    const selectCates = cateUrl[0] ? cateUrl[0].split(" ") : []; // 防止空值
    const cate = cateUrl[0] ? cateUrl[0].replace(/^S /g, "").split(" ") : []; // 防止空值
    const year = cateUrl[1] ? cateUrl[1].split(" ") : []; // 防止空值
    const country = cateUrl[2] ? cateUrl[2] : ""; // 防止空值

    // 返回解析结果
    return {
        cate,
        year,
        country,
        selectCates,
    };
}
