<template>
  <div class="animated fadeIn">
    <b-card header="Facturas" header-tag="header" footer-tag="footer">
      <router-link to="/alta-factura">
        <b-button variant="blue">Nueva Factura</b-button>
      </router-link>
      <br />
      <br />
      <div v-if="items != null">
        <b-table responsive striped hover :items="items" :fields="fields"></b-table>
      </div>
	  <span v-else>Cargando Facturas...</span>
    </b-card>
  </div>
</template>

<script>
import axios from 'axios';
export default {
	name: 'facturas',
	mounted() {
		this.getFacturas();
	},
	data() {
		return {
			items: null,
			fields: {
				id: {
					label: '#',
					sortable: true
				},
				folio: {
					label: 'Folio',
					sortable: false
				},
				descripcion: {
					label: 'Descripción',
					sortable: false
				},
				fechaFormat: {
					label: 'Fecha',
					sortable: true
				},
				cliente: {
					label: 'Cliente',
					sortable: true
				}
			}
		};
	},
	methods: {
		getFacturas() {
			axios.get('http://localhost:8686/facturas').then(respuesta => {
				this.items = respuesta.data.data;
				this.items.forEach(element => {
					element.cliente =
						element.clienteId.nombre + ' ' + element.clienteId.apellido;
				});
			});
		}
	}
};
</script>
