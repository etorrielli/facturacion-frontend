<template>
  <div class="animated fadeIn">
    <b-card header="Nueva Factura" header-tag="header" footer-tag="footer">
      <div>
        <b-form>
          <div>
            <b-card bg-variant="light">
              <b-form-group>
                <b-row>
                  <b-col class="pad-x">
                    <b-form-group>
                      <b-row>Cliente:</b-row>
                      <b-row>
                        <b-form-select
                          id="comboCliente"
                          v-model="clienteSelected"
                          @change="getSelectedItem"
                          :options="clienteOptions"
                        >
                          <template slot="first">
                            <option :value="null" disabled>-- Seleccionar una opcion --</option>
                          </template>
                        </b-form-select>
                      </b-row>
                    </b-form-group>
                  </b-col>
                  <b-col class="pad-x">
                    <b-form-group>
                      <b-row>Folio:</b-row>
                      <b-row>
                        <b-form-input
                          type="number"
                          id="folio"
                          min="10000"
                          v-model="facturaDTO.folio"
                        ></b-form-input>
                      </b-row>
                    </b-form-group>
                  </b-col>
                  <b-col class="pad-x">
                    <b-form-group>
                      <b-row>Descripción:</b-row>
                      <b-row>
                        <b-form-input id="descripcion" v-model="facturaDTO.descripcion"></b-form-input>
                      </b-row>
                    </b-form-group>
                  </b-col>
                  <b-col class="pad-x">
                    <b-form-group>
                      <b-row>Observación:</b-row>
                      <b-row>
                        <b-form-input id="observacion" v-model="facturaDTO.observacion"></b-form-input>
                      </b-row>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-card>
          </div>
        </b-form>
      </div>
      <br />
      <div>
        <b-button
          v-b-toggle.collapse-2
          class="m-1"
          variant="blue"
          @click="showCollapse = !showCollapse"
        >
          Agregar Productos
          <icon name="angle-right" class="icon-button" v-if="!showCollapse"></icon>
          <icon name="angle-down" class="icon-button" v-if="showCollapse"></icon>
        </b-button>

        <!-- Element to collapse -->
        <b-collapse id="collapse-2">
          <b-card>
            <div>
              <b-table
                responsive
                striped
                hover
                :items="itemsProducto"
                :fields="fields"
                :small="true"
              >
                <template slot="actions" slot-scope="row">
                  <b-button
                    size="sm"
                    @click="addProducto(row.item, row.index)"
                    class="mr-2"
                    variant="blue"
                  >Agregar</b-button>
                </template>
              </b-table>
            </div>
          </b-card>
        </b-collapse>
      </div>
      <br />
      <br />
      <div v-if="facturaDTO.detalles.length !== null && facturaDTO.detalles.length > 0">
        <b-card header="Detalle Factura" header-tag="header" footer-tag="footer">
          <div>
            <b-table
              :small="true"
              responsive
              striped
              hover
              :items="facturaDTO.detalles"
              :fields="fieldsDetalleFactura"
            >
              <template slot="changeCantidad" slot-scope="row">
                <b-button size="sm" @click="restarProducto(row.item, row.index)" class="mr-2">
                  <icon name="minus" class="icon-button-alone"></icon>
                </b-button>
                <b-button size="sm" @click="sumarProducto(row.item, row.index)" class="mr-2">
                  <icon name="plus" class="icon-button-alone"></icon>
                </b-button>
              </template>
              <template slot="actions" slot-scope="row">
                <b-button
                  size="sm"
                  @click="deleteProducto(row.item, row.index)"
                  class="mr-2"
                >Eliminar</b-button>
              </template>
            </b-table>
          </div>
          <em slot="footer">Total: $ {{total}}</em>
        </b-card>
      </div>
      <hr />
      <div>
        <router-link to="/facturas">
          <b-button class="m-1">Cancelar</b-button>
        </router-link>
        <b-button class="m-1" variant="blue" @click="saveFactura()">Guardar</b-button>
      </div>
    </b-card>
  </div>
</template>

<script>
import axios from 'axios';
export default {
	name: 'alta-factura',
	mounted() {
		console.log(this.facturaDTO.detalles);

		this.getClientes();
		this.getProductos();
	},
	data() {
		return {
			showCollapse: false,
			clienteSelected: null,
			clienteOptions: {},
			itemsProducto: null,
			fields: {
				id: {
					label: '#',
					sortable: true
				},
				nombre: {
					label: 'Descripción',
					sortable: false
				},
				precio: {
					label: 'Precio',
					sortable: false
				},
				actions: {
					label: 'Agregar',
					sortable: false
				}
			},
			facturaDTO: {
				clienteId: null,
				folio: null,
				descripcion: null,
				observacion: null,
				detalles: []
			},
			fieldsDetalleFactura: {
				nombre: {
					label: 'Descripción',
					sortable: false
				},
				precio: {
					label: 'Precio',
					sortable: false
				},
				cantidad: {
					label: 'Cantidad',
					sortable: false
				},
				changeCantidad: {
					label: ' ',
					sortable: false
				},
				subtotal: {
					label: 'Subtotal',
					sortable: false
				},
				actions: {
					label: 'Eliminar',
					sortable: false
				}
			},
			total: null
		};
	},
	methods: {
		getClientes() {
			axios.get('http://localhost:8686/clientes').then(respuesta => {
				this.clienteOptions = respuesta.data.data;
				this.clienteOptions.forEach(element => {
					element.value = element.id;
					element.text = element.nombre + ' ' + element.apellido;
				});
			});
		},
		getSelectedItem(clienteSelected) {
			this.facturaDTO.clienteId = clienteSelected;
		},
		getProductos() {
			axios.get('http://localhost:8686/productos').then(respuesta => {
				this.itemsProducto = respuesta.data.data;
			});
		},
		addProducto(item, index) {
			const indexProd = this.existeProducto(item);
			console.log(indexProd);
			if (indexProd !== -1) {
				this.facturaDTO.detalles[indexProd].cantidad =
					this.facturaDTO.detalles[indexProd].cantidad + 1;
				this.updateSubTotal(indexProd);
			} else {
				const product = {
					productoId: item.id,
					nombre: item.nombre,
					precio: item.precio,
					cantidad: 1,
					subtotal: item.precio * 1
				};
				this.facturaDTO.detalles.push(product);
				this.updateTotal();
			}
		},
		deleteProducto(item, index) {
			this.facturaDTO.detalles.splice(index, 1);
			this.updateTotal();
		},
		restarProducto(item, index) {
			if (item.cantidad === 1) {
				this.facturaDTO.detalles.splice(index, 1);
				this.updateTotal();
			} else {
				item.cantidad = item.cantidad - 1;
				this.updateSubTotal(index);
			}
		},
		sumarProducto(item, index) {
			item.cantidad = item.cantidad + 1;
			this.updateSubTotal(index);
		},
		updateSubTotal(indexProd) {
			this.facturaDTO.detalles[indexProd].subtotal =
				this.facturaDTO.detalles[indexProd].precio *
				this.facturaDTO.detalles[indexProd].cantidad;
			this.updateTotal();
		},
		updateTotal() {
			this.total = 0;
			this.facturaDTO.detalles.forEach(element => {
				this.total = this.total + element.precio * element.cantidad;
			});
		},
		existeProducto(item) {
			let indiceProd = -1;
			if (
				this.facturaDTO.detalles !== undefined &&
				this.facturaDTO.detalles !== null
			) {
				this.facturaDTO.detalles.forEach((element, index) => {
					console.log('index: ' + index);
					console.log('item.id: ' + item.id);
					console.log('element.productoId: ' + element.productoId);

					if (element.productoId == item.id) {
						console.log('encontro');

						indiceProd = index;
					}
				});
				console.log('no encontro');
			}
			return indiceProd;
		},
		saveFactura() {
			const mensaje = this.validar();
			if (mensaje === null) {
				axios
					.post('http://localhost:8686/facturas', this.facturaDTO)
					.then(respuesta => {
						this.makeToast(
							'success',
							'Felicitaciones!',
							'Se ha guardado correctamente',
							true
						);
					})
					.catch(error => {
						console.log(error);
						this.makeToast('danger', 'Ups!', 'Ha ocurrido un error', false);
					});
			} else {
				this.makeToast('warning', 'Ups!', mensaje, false);
			}
		},
		validar() {
			let mensaje = null;
			if (this.clienteSelected === null) {
				mensaje = 'Debe seleccionar un cliente';
			} else if (
				this.facturaDTO.detalles === undefined ||
				this.facturaDTO.detalles === null ||
				this.facturaDTO.detalles.length === 0
			) {
				mensaje = 'Debe seleccionar al menos un producto';
			}
			return mensaje;
		},
		makeToast(variant = null, titulo, msj, redirect) {
			const router = this.$router;
			setTimeout(resolve => {
				this.$bvToast.toast(`${msj}`, {
					title: `${titulo}`,
					variant: variant,
					solid: true
				});
			}, 1000);
			if (redirect) router.push('/facturas');
		}
	}
};
</script>

<style lang="scss">
.icon-button {
	padding-left: 3px;
}
.icon-button-alone {
	font-size: 13px !important;
}
.pad-x{
	padding-left: 2%;
	padding-right: 2%;
}
</style>
