import { forwardRef } from "react"
import CustomBlurEffect from './CustomBlurEffect.jsx'

export default forwardRef(function BlurEffectComponent(props, ref) {
    // console.log(props)
    const effect = new CustomBlurEffect(props)
    return <>
    <primitive ref={ref} object={effect} />
    </>
})