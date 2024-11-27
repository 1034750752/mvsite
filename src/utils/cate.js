import { ref } from "vue";
import { parseRoute } from "./parseRoute";
import { useRouter, useRoute } from "vue-router";

// 全局变量
const gobalConst = () => {
    const route = useRoute();
    const type = ref(route.matched[1].name);
    const routeData = parseRoute(route);
    const router = useRouter();

    return {
        routeData,
        type,
        router,
    };
};

// 获取路由的值
const getRouteValue = (options = {}) => {
    const { cateArray = [], yearArray = [], countryArray = [] } = options;
    // 地区
    const selectCountry = ref(0);
    const countryValue = ref("全部");
    // 年份
    const selectYears = ref([0]);
    const yearValues = ref(["全部"]);
    // 标签类型
    const selectCates = ref([0]);
    const cateValues = ref(["全部"]);
    // 类型标签 传入路由的值
    const cateUrl = ref("");
    const strS = "S ";
    const { routeData } = gobalConst();

    // 获取路由类型标签参数
    if (routeData) {
        // 从路由中加载数据
        if (routeData.selectCates[0] === "S") {
            selectCates.value = [cateArray.length - 1];
            cateValues.value = [];
            routeData.cate.forEach((item) => {
                if (item !== "") {
                    cateValues.value.push(item);
                }
            });
            cateUrl.value = strS + cateValues.value.join(" ");
        } else {
            cateValues.value = routeData.cate;
            cateUrl.value = cateValues.value.join(" ");
            // 控制标签
            if (routeData.cate.length > 0) {
                selectCates.value = [];
            } else {
                selectCates.value = [0];
            }
        }

        // 遍历路由cate 加载样式
        routeData.cate.forEach((item) => {
            const routeIndex = cateArray.indexOf(item);
            if (routeIndex !== -1) {
                selectCates.value.push(routeIndex);
            }
        });
    }
    // 获取路由地区的值
    if (routeData) {
        if (routeData.country !== "") {
            countryValue.value = routeData.country;
            const routeIndex = countryArray.indexOf(routeData.country);
            if (routeIndex !== -1) {
                selectCountry.value = routeIndex;
            }
        }
    }
    // 获取路由年份信息
    if (routeData) {
        if (routeData.year.length > 0) {
            yearValues.value = routeData.year;
            const routeIndex = yearArray.indexOf(routeData.year[0]);
            if (routeIndex !== -1) {
                selectYears.value = [routeIndex];
            }
        }
    }

    return {
        selectCountry,
        countryValue,
        selectYears,
        yearValues,
        selectCates,
        cateValues,
        cateUrl,
        strS,
    };
};
// 路由中只有 '--' 时回到上一级的路由
const selectReset = () => {
    const { routeData, type, router } = gobalConst();
    if (routeData) {
        if (routeData.cate.length === 0) {
            if (routeData.year.length === 0) {
                if (!routeData.country)
                    router.push({
                        name: type.value,
                    });
            }
        }
    }
};

// 类型标签筛选
const useCateSelection = (cateArray) => {
    const { type, router, routeData } = gobalConst();
    const { selectCates, cateValues, yearValues, countryValue, cateUrl, strS } =
        getRouteValue({
            cateArray: cateArray,
        });
    // 路由中只有 '--' 时回到上一级的路由
    selectReset();
    const cates = (value) => {
        // 未选择'多选'时 (单选)
        if (!selectCates.value.includes(cateArray.length - 1)) {
            // 如果点击的标签是'多选'
            if (value === cateArray.length - 1) {
                // 判断先前的标签是否是'全部'，是就替换，否就追加
                if (selectCates.value[0] === 0) {
                    selectCates.value = [cateArray.length - 1];
                    cateValues.value = [];
                    // 直接选择单选时的路由
                    cateUrl.value = strS;
                } else {
                    cateValues.value = [];
                    selectCates.value.push(value);
                    cateValues.value.push(cateArray[value]);
                    cateUrl.value = strS + routeData.cate;
                }
            } else {
                // 点击的标签不是多选
                selectCates.value = [value];
                cateValues.value = [cateArray[value]];
                if (value !== 0) {
                    cateUrl.value = cateValues.value[0];
                } else {
                    cateUrl.value = "";
                }
            }
        } else {
            //标签中包含'多选'时 (多选)
            if (selectCates.value.includes(cateArray.length - 1)) {
                //再次点击多选
                if (value === cateArray.length - 1) {
                    selectCates.value = [0];
                    cateValues.value = ["全部"];
                    cateUrl.value = "";
                } else {
                    // 点击重复的标签时将其删除
                    if (selectCates.value.includes(value)) {
                        selectCates.value.splice(
                            selectCates.value.indexOf(value),
                            1
                        );
                        cateValues.value.splice(
                            cateValues.value.indexOf(cateArray[value]),
                            1
                        );
                        const cateUrlArr = cateUrl.value
                            .replace(/^S /g, "")
                            .split(" ");
                        console.log(cateUrl.value);
                        cateUrl.value =
                            strS +
                            cateUrlArr
                                .filter((item) => item !== cateArray[value])
                                .join(" ");
                        console.log(cateUrl.value);
                    } else {
                        // 多选时的数组变化
                        if (value !== 0) {
                            selectCates.value.push(value);
                            cateValues.value.push(cateArray[value]);

                            if (cateValues.value.length > 0) {
                                cateUrl.value =
                                    strS + cateValues.value.join(" ");
                            }
                        } else {
                            selectCates.value = [0];
                            cateValues.value = ["全部"];
                            cateUrl.value = "";
                        }
                    }
                }
            }
        }

        // 年份是'全部' 写入路由的值为空
        if (yearValues.value[0] === "全部") {
            yearValues.value = [];
        }
        // 地区是'全部' 写入路由的值为空
        if (countryValue.value === "全部") {
            countryValue.value = "";
        }
        router.push({
            name: type.value + "Cate",
            params: {
                cate: cateUrl.value,
                year: yearValues.value.join(" "),
                local: countryValue.value,
            },
        });
    };

    return {
        selectCates,
        cateValues,
        cates,
    };
};

// 年份筛选
const useYearSelection = (yearArray) => {
    const { type, router } = gobalConst();
    const { countryValue, selectYears, yearValues, cateUrl } = getRouteValue({
        yearArray: yearArray,
    });

    // 点击标签改变路由
    const years = (value) => {
        selectYears.value = [value];

        // 地区是'全部' 写入路由的值为空
        if (countryValue.value === "全部") {
            countryValue.value = "";
        }
        // 年份是'全部' 写入路由的值为空
        if (value === 0) {
            yearValues.value = [""];
        } else {
            yearValues.value = [yearArray[value]];
        }

        router.push({
            name: type.value + "Cate",
            params: {
                cate: cateUrl.value,
                year: yearValues.value.join(" "),
                local: countryValue.value,
            },
        });
    };

    return {
        selectYears,
        yearValues,
        years,
    };
};

// 地区筛选
const useCountrySelection = (countryArray) => {
    const { type, router } = gobalConst();
    const { selectCountry, countryValue, yearValues, cateUrl } = getRouteValue({
        countryArray: countryArray,
    });

    // 点击标签改变路由
    const country = (value) => {
        selectCountry.value = value;
        // 地区是'全部' 写入路由的值为空
        if (value === 0) {
            countryValue.value = "";
        } else {
            countryValue.value = countryArray[value];
        }
        // 年份是'全部' 写入路由的值为空
        if (yearValues.value[0] === "全部") {
            yearValues.value = [];
        }

        router.push({
            name: type.value + "Cate",
            params: {
                cate: cateUrl.value,
                year: yearValues.value.join(" "),
                local: countryValue.value,
            },
        });
    };
    return {
        selectCountry,
        countryValue,
        country,
    };
};

export { useCateSelection, useYearSelection, useCountrySelection };
