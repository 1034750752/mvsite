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
    // console.log(response.data.data.list)
    return response.data.data.list;
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

export const fetchTotalData = async (cate, year, country, type) => {
    try {
        const response = await axios.get("/allmv", {
            params: {
                cate,
                year,
                country,
                type,
            },
        });
        return response.data.data.total;
    } catch (error) {
        console.error("Error fetching total data :", error);
        return { total: 0 };
    }
};
