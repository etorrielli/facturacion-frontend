import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'
import Facturas from '@/views/factura/Facturas'
import AltaFactura from '@/views/factura/AltaFactura'
import Clientes from '@/views/cliente/Clientes'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: Full,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        }
      ]
    },
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Facturas',
      component: Full,
      children: [
        {
          path: 'facturas',
          name: 'Facturas',
          component: Facturas
        }
      ]
    },
    {
      path: '/',
      redirect: '/dashboard',
      name: 'AltaFactura',
      component: Full,
      children: [
        {
          path: 'alta-factura',
          name: 'Factura',
          component: AltaFactura
        }
      ]
    },
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Clientes',
      component: Full,
      children: [
        {
          path: 'clientes',
          name: 'Clientes',
          component: Clientes
        }
      ]
    }
  ]
})
