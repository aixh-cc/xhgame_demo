import { IHttp } from "@aixh-cc/xhgame_ec_framework"

/**
 * 设计模式8:适配器模式
 * 意图:希望游戏框架里面请求方式是类似xhgame.net.post('/api/userInfo')，无论我们如何换后端开发框架(有些是返回code=200表示成功，有些是success表示成功)，前端都是不用改。
 */
export class MockHttp implements IHttp {


    async get(url: string, reqData: any) {
        return new Promise(async (resolve, reject) => {

        })
    }

    async post(url: string, reqData: any) {
        let api: any = url
        if (api.indexOf('atAccount') > -1) {
            return this.accountPost(api, reqData)
        }
        return this.hallPost(api, reqData)
    }

    async accountPost(url: string, reqData: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (url.indexOf('atAccount/GetServerInfo') > -1) {
                resolve({
                    isSucc: true,
                    res: {
                        "version": "1.3.0",
                        "hallDomain": "http://127.0.0.1:8011",
                        "account": "h5_3",
                        "account_token": "d87f832d0c02fc439afa82c67d626c56"
                    }
                })
            }
        })
    }
    /** 
     * 有提示的接口请求方法
     * 前提是需知道是hall接口
     * 使用示例：xhgame.net.http.hallPost('api') )
     */
    async hallPost(url: string, reqData: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (url.indexOf('atHall/PlayerEnter') > -1) {
                resolve({
                    isSucc: true,
                    res: {
                        "token": "d89d4bff69c99e334cdf658fa6fc6152",
                        "playerInfo": {
                            "playerId": 6,
                            "account": "h5_4",
                            "serverNo": "test",
                            "name": "h5_4",
                            "gold": 0,
                            "ps": 0,
                            "diamond": 0,
                            "createtime": "2024-06-18T05:26:38.555Z"
                        }
                    }
                })
            }
            if (url.indexOf('atHall/EnterRoom') > -1) {
                resolve({
                    "roomId": 18,
                    "wsUrl": "ws://127.0.0.1:8012",
                    "sign": "8f14e45fceea167a5a36dedd4bea2543",
                    "seats": [
                        {
                            "roomId": 18,
                            "playerId": 6,
                            "seatIndex": 0
                        }
                    ]
                })
            }
        })
    }

}