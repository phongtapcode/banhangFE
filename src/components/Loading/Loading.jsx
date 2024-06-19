import { Spin } from 'antd';

function Loading ({children,isLoading}) {

    return (
    <Spin spinning={isLoading}>
        {children}
    </Spin>
    )
}

export default Loading;