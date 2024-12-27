// 公共函数

// 格式化数字
export const FormatNum = (num) => {
    return (num = parseInt(num, 10) < 10 ? "0" + num : num);
};
// 输入数字变成数组
export const range = (end, start = 1) => {
    const arr = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    return arr;
};
// 输入邮箱 进行验证
export const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};
