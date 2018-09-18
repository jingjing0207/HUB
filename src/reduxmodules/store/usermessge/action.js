import actionsType from './actionType'

const InitActions={
    // 保存后端服务主机名端口号数据
    InitToken:() => {
        return {
            type: actionsType.TOKEN.token,
            token:'',
        }
    }
}


export default InitActions
