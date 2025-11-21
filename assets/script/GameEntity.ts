import { Entity } from "@aixh-cc/xhgame_ec_framework";
import { RegisterComps } from "db://assets/script/RegisterComps";
/**
 * 游戏实体
 */
export class GameEntity extends Entity {
    /** 组成的组件 */
    registerComps: RegisterComps
    constructor() {
        super()
        this.registerComps = new RegisterComps()
    }
    init(): void {

    }
    /**
     * 挂载注册组件(通过组件名)
     * @param compName 
     * @returns 
     */
    attachComponentByRegisterName(compName: keyof RegisterComps) {
        let componentClass = this.registerComps[compName]
        if (!componentClass) {
            throw new Error(`compName ${compName} 未在RegisterComps中找到注册记录`)
        }
        console.log('attachComponent', compName)
        return this.attachComponent(componentClass as any) as CompInstances<RegisterComps>[keyof RegisterComps]
    }
    /**
     * 卸载注册组件(通过组件名)
     * @param compName 
     */
    detachComponentByRegisterName(compName: keyof RegisterComps) {
        let componentClass = this.registerComps[compName]
        if (!componentClass) {
            throw new Error(`compName ${compName} 未在RegisterComps中找到注册记录`)
        }
        this.detachComponent(componentClass as any)
    }
    /**
     * 获取已挂载的注册组件(通过组件名)
     * @param compName 
     * @returns 
     */
    getComponentByRegisterName<K extends keyof RegisterComps>(compName: K) {
        let component = this.getComponentByName(compName)
        if (component) {
            return component as CompInstances<RegisterComps>[K]
        }
        throw new Error(`compName ${compName} 未在RegisterComps中找到注册记录`)
    }
    /**
     * 安全获取注册组件，不存在则挂载(通过组件名)
     * @param compName 
     * @returns 
     */
    safeGetComponentByRegisterName<K extends keyof RegisterComps>(compName: K) {
        let component = this.getComponentByName(compName)
        if (component) {
            return component as CompInstances<RegisterComps>[K]
        }
        return this.attachComponentByRegisterName(compName) as CompInstances<RegisterComps>[K]
    }
    /**
     * 判断是否存在注册组件(通过组件名)
     * 有些非必须挂载的组件，需要判断是否存在
     */
    isExistComponentByRegisterName(compName: any): boolean {
        let componentClass = this.registerComps[compName]
        if (!componentClass) {
            return false
        }
        return true
    }
}
// 创建实例类型映射
type CompInstances<T> = {
    [K in keyof T]: T[K] extends new (...args: any[]) => infer R ? R : never;
}