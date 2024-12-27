/* eslint-disable */

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module "*.jpg" {
    const src: string;
    export default src;
}
declare module "@/utils/public" {
    /**
     * 根据传入的电子邮箱 验证邮箱格式是否正确
     * @param email 电子邮件
     * @returns 返回 true 或 false
     */
    export function validateEmail(email: string): true | false;
}
declare module "@/utils/MvPublic" {
    /**
     * 根据影片类型的中文名称获取对应的类型标识符
     * @param type 影片类型的名称（如 "电影"、"剧集"、"动漫" 等）
     * @returns 返回 "mv"、"tv" 或 "ct"
     */
    export function getType(type: string): "mv" | "tv" | "ct";

    /**
     * 根据路由对象获取影片类型的中文名称
     * @param route Vue 路由对象，包含 matched 信息
     * @returns 返回 "电影"、"剧集" 或 "动漫"
     */
    export function getTypeStr(route: {
        matched: Array<{ name: string }>;
    }): "电影" | "剧集" | "动漫";

    /**
     * 启动一个监听刷新指令的函数，使用 BroadcastChannel
     * @param callback 当收到“刷新所有标签页”命令时，调用的回调函数
     */
    export function listenForRefresh(callback: () => void): void;

    /**
     * 触发全局的刷新事件，通知所有标签页刷新
     */
    export function triggerRefresh(): void;

    /**
     * 从 localStorage 中获取用户信息
     * @returns 返回一个用户对象，或者如果 localStorage 中没有 `token`，则返回 null
     */
    export function getUser(): Record<string, any> | null;

    /**
     * 跳转到详细页面
     * @param list 包含类型和 mvId 的对象
     * @param router Vue 路由实例
     */
    export function linkToDt(
        list: { type: string; mvId: string | number },
        router: {
            resolve: (routeData: { name: string; params: { id: number } }) => {
                href: string;
            };
        }
    ): void;
    export declare function updateUser(pic: string): Record<string, any> | null;
}
declare module "*.jpeg" {
    const src: string;
    export default src;
}

declare module "*.png" {
    const src: string;
    export default src;
}

declare module "*.gif" {
    const src: string;
    export default src;
}

declare module "*.svg" {
    const src: string;
    export default src;
}

declare module "*.webp" {
    const src: string;
    export default src;
}
