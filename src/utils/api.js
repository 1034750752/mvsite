// utils/api.js
import axios from "../store/axios";

export const fetchBdData = async (pageIndex, pageSize, searchKey) => {
    const response1 = await axios.get(
        `/mv?pageIndex=${pageIndex}&pageSize=${pageSize}&searchKey=${searchKey}`
    );

    const bd1 = response1.data.data.list;
    const bd2Promises = bd1.map(async (item) => {
        const response2 = await axios.get(`/mv/mvdt?mvId=${item.mvId}`);
        const list = response2.data.data.list;
        return list.length ? { ...list[0], isHovered: false } : null;
    });
    const bd2 = await Promise.all(bd2Promises);
    return { bd1, bd2: bd2.filter((item) => item) };
};

export const fetchRecommendData = async (pageIndex, type) => {
    const response = await axios.get(
        `/mvrec?pageIndex=${pageIndex}&type=${type}`
    );
    return response.data.data.list;
};

// 根据id 获取 dt 和 list
export const fetchMvData = async (mvId) => {
    try {
        const response = await axios.get("/mv/mvdt", {
            params: { mvId: mvId, search: 1 },
        });
        const mvlist = response.data.data.list;
        const response2 = await axios.get("/mv/mvdt", {
            params: { mvId: mvId, search: 0 },
        });
        const mvdt = response2.data.data.list;
        const List = mvlist.map((item, index) => {
            return {
                List1: item,
                List2: mvdt[index],
            };
        });
        return { List };
    } catch (err) {
        return { List: [] };
    }
};
export const fetchListData = async (
    cate,
    pageIndex,
    pageSize,
    searchKey,
    type,
    year,
    country,
    sortBy,
    mvcate
) => {
    try {
        const response1 = await axios.get(`/mv`, {
            params: {
                cate,
                pageIndex,
                pageSize,
                searchKey,
                type,
                year,
                country,
                sortBy,
                mvcate,
            },
        });
        const List1 = response1.data.data.list;
        const totalValue = response1.data.data.total;
        const List2 = [];
        for (const item of List1) {
            const response2 = await axios.get(`/mv/mvdt`, {
                params: { mvId: item.mvId },
            });
            const data = response2.data.data.list;
            if (data.length) {
                List2.push({ ...data[0] });
            }
        }
        return { List1, List2, totalValue };
    } catch (error) {
        console.error("Error fetching list data:", error);
        return { List1: [], List2: [], totalValue: 0 };
    }
};

// export const fetchTotalData = async (cate, year, country, type) => {
//     try {
//         const response = await axios.get("/allmv", {
//             params: {
//                 cate,
//                 year,
//                 country,
//                 type,
//             },
//         });
//         return response.data.data.total;
//     } catch (error) {
//         console.error("Error fetching total data :", error);
//         return { total: 0 };
//     }
// };

// 获取搜索结果
export const fetchSearchData = async (
    pageIndex,
    pageSize,
    searchKey,
    type,
    searchType
) => {
    try {
        const response1 = await axios.get(`/mv/s`, {
            params: { pageIndex, pageSize, searchKey, type, searchType },
        });
        console.log(response1);

        const List1 = response1.data.data.list;
        const totalValue = response1.data.data.total;
        const List2 = [];
        for (const item of List1) {
            const response2 = await axios.get(`/mv/mvdt`, {
                params: { mvId: item.dtId, search: 1 },
            });
            const data = response2.data.data.list;
            if (data.length) {
                List2.push({ ...data[0] });
            }
        }
        return { List1, List2, totalValue };
    } catch (error) {
        console.error("Error fetching list data:", error);
        return { List1: [], List2: [], totalValue: 0 };
    }
};

// 获取 用户收藏 list
export const fetchCollectList = async (userid) => {
    try {
        // 获取用户收藏电影的 id
        const response = await axios.get("/collect", {
            params: { userid },
        });
        const List = response.data.data.list;
        const totalValue = response.data.data.total; // 有几条数据
        const mvIdList = List.map((item) => item.mvId); // 获取 mvId 的数组
        const CollectId = List.map((item) => ({
            selectId: item.selectId,
            mvId: item.mvId,
        })); // 获取收藏 id);
        const response2 = await axios.get("/mv/mvdt", {
            params: { mvId: mvIdList, search: 1 },
        });
        const mvList = response2.data.data.list;

        const mvListMap = new Map(mvList.map((item) => [item.mvId, item])); // 创建 Map
        // 合并
        const CollectList = CollectId.map((item) => {
            const mvData = mvListMap.get(item.mvId); // 从 Map 中获取对应数据
            return {
                ...item,
                ...(mvData || {}),
            };
        });
        return { CollectList, totalValue };
    } catch (error) {
        console.error("Error fetching total data :", error);
        return { CollectList: [], totalValue: 0 };
    }
};

// 添加收藏
export const addCollection = async (userid, mvId, title) => {
    try {
        const response = await axios.post("/collect/add", {
            userid,
            mvId,
            title, // 发送必要的数据到后端
        });
        // 检查响应
        if (response.status === 200) {
            const result = response.data;
            return result; // 返回成功响应数据
        } else {
            console.warn("添加失败:", response.data);
            return null;
        }
    } catch (error) {
        console.error("请求失败:", error.message);
        return null; // 返回 null 表示失败
    }
};

// 删除收藏
export const deleteCollection = async (userid, mvId) => {
    try {
        const response = await axios.delete("/collect/delete", {
            params: { userid, mvId },
        });
        // 检查响应
        if (response.status === 200) {
            const result = response.data;
            return result; // 返回成功响应数据
        } else {
            return null;
        }
    } catch (error) {
        return null; // 返回 null 表示失败
    }
};

// 用户修改
export const updateUserData = async (updatedData) => {
    try {
        const response = await axios.put("/user/update", updatedData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        // 处理后端返回的错误信息，如果没有响应数据，提供默认错误
        const errorMessage =
            error.response?.data?.message || "请求失败，请稍后重试";

        return {
            success: false,
            code: error.response?.data?.code || 500, // 错误代码，默认500
            message: errorMessage,
        };
    }
};

// 用户查找
export const SearchUserData = async (
    pageIndex,
    pageSize,
    searchKey,
    UserId
) => {
    try {
        const response = await axios.get("/user", {
            params: { pageIndex, pageSize, searchKey, UserId },
        });
        const users = response.data.data.list;
        const total = response.data.data.total;
        return { users, total };
    } catch (err) {
        return { users: [], total: 0 };
    }
};

// 获取轮播图
export const fetchSlides = async () => {
    try {
        const response = await axios.get("/slide");
        const slides = response.data.data.list;
        const mvIds = slides.map((item) => item.mvId); // 输出 [id1,id2...]
        // 0 查 dt, 1 查 list
        // list
        const response2 = await axios.get("/mv/mvdt", {
            params: { mvId: mvIds, search: 1 },
        });
        // dt
        const response3 = await axios.get("/mv/mvdt", {
            params: { mvId: mvIds, search: 0 },
        });

        const List1 = response2.data.data.list; // 输出 [{},{}...]
        const List2 = response3.data.data.list; // 输出 [{},{}...]

        const List = List1.map((item, index) => {
            let match = slides.find((entry) => entry.mvId === item.mvId);
            return {
                List1: item,
                List2: List2[index],
                slidImg: match ? match.slidImg : {},
            };
        });
        return { mvIds, List, slides };
    } catch (err) {
        return { mvIds: [], List: [], slides: [] };
    }
};

// 替换轮播图
export const changeSlides = async (slideData) => {
    try {
        const response = await axios.post("/slide/change", {
            slideData,
        });
        return response;
    } catch (err) {
        return err.message;
    }
};

// 影片添加
export const addmv = async (
    title,
    releseTime,
    type,
    cover,
    cate,
    director,
    scriptwriter,
    actor,
    country,
    language,
    length,
    desc
) => {
    try {
        const response = await axios.post("/mv/add", {
            title,
            releseTime,
            type,
            cover,
            cate,
            director,
            scriptwriter,
            actor,
            country,
            language,
            length,
            desc,
        });
        return response;
    } catch (err) {
        return err.message;
    }
};

// 影片编辑
export const editmv = async (
    title,
    releseTime,
    type,
    cover,
    cate,
    director,
    scriptwriter,
    actor,
    country,
    language,
    length,
    desc,
    mvId
) => {
    try {
        const response = await axios.put("/mv/update", {
            title,
            releseTime,
            type,
            cover,
            cate,
            director,
            scriptwriter,
            actor,
            country,
            language,
            length,
            desc,
            mvId,
        });
        return response;
    } catch (err) {
        return err.message;
    }
};
