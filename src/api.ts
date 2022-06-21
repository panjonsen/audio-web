import Network from './axios';




// export const GetAudioBatchList = () => api({
//     url: 'api/record/index/GetBatchList', // 请求地址
//     method: 'get', // 请求方式
//
// })
export const GetAudioBatchList = () => Network.get('api/record/index/GetBatchList')
export const GetAudioListByBatchId = (post) => Network.post('api/record/index/GetAudioListByBatchId',post)


// export const GetAudioBatchList = (params) => api({
//     url: '/record/index/GetBatchList', // 请求地址
//     method: 'get', // 请求方式
//     // data: params, // (一般post请求，我们习惯使用 data属性来传参)
//     params: params //(一般get请求，我们习惯使用params属性来传参）
//     // 注意：data，和 params 两个属性传参使用，并不是固定的，也可以调换使用。
// })