// 电影项目公共函数
// 获取 影片类型  type:String
export const getType = (type) => {
    if (type === "电影") {
        return "mv";
    } else if (type === "剧集") {
        return "tv";
    } else {
        return "ct";
    }
};
// 处理 imgurl
export const handleImgUlr = (url) => {
    if (typeof url === "object") {
        return "";
    }
    return url;
};
// 获取 影片类型 type 字符串
export const getTypeStr = (route) => {
    const type = route.matched[1].name;
    if (type === "mv") {
        return "电影";
    } else if (type === "tv") {
        return "剧集";
    } else {
        return "动漫";
    }
};
// 创建一个全局 BroadcastChannel
const channel = new BroadcastChannel("refresh-channel");
// 触发刷新通知
export const listenForRefresh = (callback) => {
    channel.onmessage = (event) => {
        // 收到刷新指令
        if (event.data === "refreshAllTabs") {
            console.log("");
            if (typeof callback === "function") {
                callback();
            }
        }
    };
};
// 方法：触发刷新事件（在需要的地方调用）
export const triggerRefresh = () => {
    channel.postMessage("refreshAllTabs"); // 发送刷新指令
};

// 从本地存储获取用户信息
export const getUser = () => {
    if (localStorage.getItem("token")) {
        const user = JSON.parse(localStorage.getItem("token"));
        return user;
    } else return null;
};
// 跳转到 详细页面
export const linkToDt = (list, router) => {
    const name = getType(list.type) + "dt";
    const routeData = router.resolve({
        name: name,
        params: { id: Number(list.mvId) },
    });
    window.open(routeData.href, "_blank");
};

// 从本地存储修改用户信息
export const updateUser = (pic) => {
    // 1. 从 localStorage 中取出 userInfo
    let userInfo = JSON.parse(localStorage.getItem("token"));
    // 2. 修改 pic 的值
    userInfo.pic = pic;
    // 3. 重新存储更新后的对象
    localStorage.setItem("token", JSON.stringify(userInfo));
};
export const storeData = (data, storeName) => {
    const localData = localStorage.getItem(storeName);
    if (localData) localStorage.removeItem(storeName);
    localStorage.setItem(storeName, JSON.stringify(data));
};
