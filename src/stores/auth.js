import { defineStore } from 'pinia'
import api from '@/services/api'
export const useAuthStore = defineStore('auth', {
  state:()=>({ token: localStorage.getItem('token')||'', user:null }),
  actions:{
    async login(username,password){
      try{
        const { data } = await api.post('/auth/login',{ username,password })
        this.token = data.token; this.user = data; localStorage.setItem('token',this.token)
        return true
      }catch{ return false }
    },
    logout(){ this.token=''; this.user=null; localStorage.removeItem('token') }
  }
})
