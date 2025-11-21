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
                    "isSucc": true,
                    "res": {
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGRiOTFmMWIzMjIyNWY0ZmNmYzQ3OTYiLCJwbGF5ZXJJZCI6MjAsImFjY291bnQiOiJoNV8xIiwiZ2FtZUNvZGUiOiJqaWFuY2h1cWlhbyIsInNlcnZlck5vIjoiZGV2XzAwMSIsIm5hbWUiOiJoNV8xIiwicHMiOjEwLCJnb2xkIjo2MDAsImRpYW1vbmQiOjEwMCwibWF4QmF0dGxlSWQiOjgsImNyZWF0ZXRpbWUiOiIyMDI1LTA5LTMwVDA4OjE2OjQ5LjYyMVoiLCJudW1zT25lIjoxMDAwMDAwMDAwMCwiaWF0IjoxNzYzNzM0MDM4fQ.Xq4FdM83o3xb0Z6EHDhK6t8FHF7DcbIXJQSzoUaUaSQ",
                        "playerInfo": {
                            "playerId": 20,
                            "account": "h5_1",
                            "gameCode": "jianchuqiao",
                            "serverNo": "dev_001",
                            "name": "h5_1",
                            "gold": 600,
                            "ps": 10,
                            "diamond": 100,
                            "maxBattleId": 8,
                            "createtime": "2025-09-30T08:16:49.621Z",
                            "numsOne": 10000000000
                        }
                    }
                })
            }
            if (url.indexOf('atHall/PlayerMission') > -1) {
                resolve({
                    "isSucc": true,
                    "res": {
                        "playerId": 20,
                        "missionInfo": {
                            "playerId": 20,
                            "groupId": 0,
                            "missionItems": [
                                {
                                    "battleId": 1,
                                    "index": 0,
                                    "maxScore": 2407,
                                    "maxStar": 3
                                },
                                {
                                    "battleId": 2,
                                    "index": 1,
                                    "maxScore": 678,
                                    "maxStar": 3
                                },
                                {
                                    "battleId": 3,
                                    "index": 2,
                                    "maxScore": 948,
                                    "maxStar": 3
                                },
                                {
                                    "battleId": 4,
                                    "index": 3,
                                    "maxScore": 592,
                                    "maxStar": 3
                                },
                                {
                                    "battleId": 5,
                                    "index": 4,
                                    "maxScore": 1284,
                                    "maxStar": 3
                                },
                                {
                                    "battleId": 6,
                                    "index": 5,
                                    "maxScore": 1090,
                                    "maxStar": 3
                                },
                                {
                                    "battleId": 7,
                                    "index": 6,
                                    "maxScore": 386,
                                    "maxStar": 3
                                },
                                {
                                    "battleId": 8,
                                    "index": 7,
                                    "maxScore": 0,
                                    "maxStar": 0
                                },
                                {
                                    "battleId": 9,
                                    "index": 8,
                                    "maxScore": 0,
                                    "maxStar": 0
                                },
                                {
                                    "battleId": 10,
                                    "index": 9,
                                    "maxScore": 0,
                                    "maxStar": 0
                                }
                            ]
                        }
                    }
                })
            }
        })
    }

}