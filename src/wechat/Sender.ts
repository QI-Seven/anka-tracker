import * as wechat from './utils'
import * as helper from '../helper'
import { Task } from '../core/Task'
import { Sender } from '../core/Sender'
import { WeChatCommonDataVender } from './CommonDataVendor'
import { Initializer } from '../core/Initializer'
declare interface WeChatAPI {
    request (): Promise<any>
}

export class WeChatSender implements Sender {
    url: string
    globalData: Object
    config: Initializer

    constructor (url: string, config: Initializer, globalData?: Object) {
        this.url = url
        this.config = config
        this.globalData = globalData

        // const pageConstructor = Page
        // Page = function (page) {
        //     objectMethodWrapper(page, 'onLoad', (option: any) => {
        //         if (!this.globalData.source_path) {
        //             this.globalData.source_path = getCurrentPages().slice().shift().route
        //         }
        //     })
        //     return pageConstructor(page)
        // }
    }

    send (task: Task): Promise<Task> {
        const data = {
            ...this.globalData,
            ...task.data
        }
        helper.log('打点数据校验结果:', task, WeChatCommonDataVender.validate(data))

        return wechat.request({
            url: this.url,
            method: 'POST',
            data
        }).then(() => {
            // 这一步肥肠重要，只需改变状态即可
            task.isSucceed()
            return Promise.resolve(task)
        }).catch(() => {
            task.isFailed()
            return Promise.resolve(task)
        })
    }
}