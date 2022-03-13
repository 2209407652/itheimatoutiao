import request from '@/utils/request'

// 登陆 API 接口
export const loginAPI = (data) => {
    return request.post('/v1_0/authorizations', data)
}