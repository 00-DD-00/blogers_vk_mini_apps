import fetch from "node-fetch";
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';

export default class API{
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.view_url = undefined;
        this.fullData = undefined;
        this.myProfile = undefined;
    }

    async init(){
        await this.getApiURL();
        await this.getMyProfile();
        if(this.myProfile.status != `ok`){console.warn(`Что-то пошло не по плану!`);throw `Error`;};
    }

    async getApiURL(){
        const url = 'https://api.vk.com/method/apps.getEmbeddedUrl?v=5.131';
        const appId = 51431171;

        try {
            const response = await fetch(`${url}&app_id=${appId}&access_token=${this.accessToken}`);
            const res = await response.json();
            this.view_url = res.response.view_url;
            const urlS = new URL(res.response.view_url);

            const sign = urlS.searchParams.get("sign");
            const vkTs = urlS.searchParams.get("vk_ts");
            const TokenSettings = urlS.searchParams.get("vk_access_token_settings");
            const vk_are_notifications_enabled = urlS.searchParams.get("vk_are_notifications_enabled");
            const vk_is_app_user = urlS.searchParams.get("vk_is_app_user");
            const vk_is_favorite = urlS.searchParams.get("vk_is_favorite");
            const vk_language = urlS.searchParams.get("vk_language");
            const vk_platform = urlS.searchParams.get("vk_platform");
            const vk_ref = urlS.searchParams.get("vk_ref");
            const vk_user_id = urlS.searchParams.get("vk_user_id");

            this.fullData = {
                "sign": sign,
                "vk_access_token_settings": TokenSettings,
                "vk_app_id": "51431171",
                "vk_are_notifications_enabled": vk_are_notifications_enabled,
                "vk_is_app_user": vk_is_app_user,
                "vk_is_favorite": vk_is_favorite,
                "vk_language": vk_language,
                "vk_platform": vk_platform,
                "vk_ref": vk_ref,
                "vk_ts": vkTs,
                "vk_user_id": vk_user_id
            };

        } catch (error) {
            console.error(`Скорее всего вы ввели не правильный accessToken`);
            throw error;
        }

    }

    async getMyProfile(){

        const body = `{"params":{"params":"${JSON.stringify(this.fullData).replace(new RegExp(`\"`, "g"), `\\\"`)}"}}`

        const request = await fetch("https://bloggers.apps-cdn.ru/user/get", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "content-language": "ru-RU",
                "content-type": "application/json",
                "content-types": "json,text",
                "need-referer": "no",
                "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "Referer": "https://prod-app51431171-95cbdb074795.pages-ac.vk-apps.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": body,
            "method": "POST"
        });
        const result = await request.json();
        this.myProfile = result;
    }

    async CreateVideo(){
        const body = `{"params":{"name": "vk.com/crawler1990", "params":"${JSON.stringify(this.fullData).replace(new RegExp(`\"`, "g"), `\\\"`)}"}}`

        const res = await fetch("https://bloggers.apps-cdn.ru/video/create", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-language": "ru-RU",
                "content-type": "application/json",
                "content-types": "json,text",
                "need-referer": "no",
                "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "Referer": "https://prod-app51431171-95cbdb074795.pages-ac.vk-apps.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": body,
            "method": "POST"
        });
        const result = await res.json();

        if(result[`status`] != 'ok'){
            if(result[`payload`] == 'error: not enough energy'){
                const energy = await this.buyEnergy();
                if(!energy)
                    await this.sleep(60*1000)}else{return result}
        }else if(result[`payload`] == 'the last video is not finished yet'){
            await this.sleep(60 * 1000);
        };
        await this.sleep(result[`payload`]['speed'] * 1000);
        const bodyStat = `{"params":{"id": ${result[`payload`]['id']}, "params":"${JSON.stringify(this.fullData).replace(new RegExp(`\"`, "g"), `\\\"`)}"}}`


        const res_video = await fetch("https://bloggers.apps-cdn.ru/video/getResult", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-language": "ru-RU",
                "content-type": "application/json",
                "content-types": "json,text",
                "need-referer": "no",
                "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "Referer": "https://prod-app51431171-95cbdb074795.pages-ac.vk-apps.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": bodyStat,
            "method": "POST"
        });
        const result_video = await res_video.json();
        console.log(result_video);

    }

    async buyEnergy(){
        await this.getMyProfile();
        const money = this.myProfile[`payload`][`balance`];

        const getSell = `{"params":{"params":"${JSON.stringify(this.fullData).replace(new RegExp(`\"`, "g"), `\\\"`)}"}}`

        const price = await fetch("https://bloggers.apps-cdn.ru/shop/food/get", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-language": "ru-RU",
                "content-type": "application/json",
                "content-types": "json,text",
                "need-referer": "no",
                "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "Referer": "https://prod-app51431171-95cbdb074795.pages-ac.vk-apps.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": getSell,
            "method": "POST"
        });
        const json_price = await price.json();
        var GlobalPrice = null;
        var GlobalPriceID = null;
        for (var i = 0; i < 4; i++){
            const sell_price = json_price[`payload`][i][`cost`] / json_price[`payload`][i][`id`]
            if(GlobalPrice == null || sell_price <= GlobalPrice) {
                GlobalPrice = sell_price;
                GlobalPriceID = json_price[`payload`][i][`id`];
            }

        }

        const buySell = `{"params":{"id":${GlobalPriceID}, "subSection":"null","params":"${JSON.stringify(this.fullData).replace(new RegExp(`\"`, "g"), `\\\"`)}"}}`

        if(money >= (GlobalPrice * GlobalPriceID)) {
            const buyProducte = await fetch("https://bloggers.apps-cdn.ru/shop/food/buy", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "content-language": "ru-RU",
                    "content-type": "application/json",
                    "content-types": "json,text",
                    "need-referer": "no",
                    "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site",
                    "Referer": "https://prod-app51431171-95cbdb074795.pages-ac.vk-apps.com/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": buySell,
                "method": "POST"
            });
            const buyProducteJSON = await buyProducte.json();

            if (buyProducteJSON[`status`] == `ok`) {
                console.log(`Куплено еда, за: ${GlobalPrice * GlobalPriceID}[${GlobalPriceID}]`);
                return true;
            }
        }

    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}