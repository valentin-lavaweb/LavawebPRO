import { proxy } from 'valtio'
import { useProxy } from 'valtio/utils'

const store = proxy({ 
    activeHeader: false,
})
export const useStore = () => useProxy(store)