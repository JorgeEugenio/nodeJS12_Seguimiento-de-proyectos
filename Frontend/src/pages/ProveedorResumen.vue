<template>
	<div class="p-grid button-demo">
		<div class="p-col-12 p-md-12">
			<div class="card">
				<Button @click="CambiarEstadoProveedor" label="Provedor" :class="CambiarEstiloBotonProveedor" />
				<Button @click="CambiarEstadoPagoProveedor" label="Pagos Proveedor" :class="CambiarEstiloBotonPagoProveedor" />
				
			</div>
            <div>
                <BienvenidoProveedor v-show="estadoBienvenidoProveedor"/>
            </div>
            <div class="card" v-if="estadoProveedor">
                <Proveedor />
            </div>
			<div class="card" v-if="estadoPagoProveedor">
                <PagoProveedor />
            </div>
		</div>
	</div>
</template>
<script>
import Proveedor from '../components/contenedor/proveedor/Proveedor'
import BienvenidoProveedor from '../components/contenedor/proveedor/BienvenidoProveedor'
import PagoProveedor from '../components/contenedor/proveedor/PagoProveedor'
export default {
	name:'ProveedorResumen',
	components:{
		BienvenidoProveedor,
		Proveedor,
		PagoProveedor
	},
	data(){
		return {
			estadoBienvenidoProveedor: true,
			estadoProveedor: false,
			estadoPagoProveedor: false
		}

	},
	created(){

	},
	methods: {
		CambiarEstadoProveedor(){
            this.estadoBienvenidoProveedor = false
            this.estadoProveedor = true
			this.estadoPagoProveedor = false
        },
		CambiarEstadoPagoProveedor(){
            this.estadoBienvenidoProveedor = false
            this.estadoProveedor = false
			this.estadoPagoProveedor = true
        },

	},
	computed:{
		CambiarEstiloBotonProveedor(){
            return this.estadoProveedor ? 'p-button-secondary p-mr-2 p-mb-2' :'p-button-outlined p-button-info p-mr-2 p-mb-2'
        },
		CambiarEstiloBotonPagoProveedor(){
            return this.estadoPagoProveedor ? 'p-button-secondary p-mr-2 p-mb-2' :'p-button-outlined p-button-info p-mr-2 p-mb-2'
        },

	}
}
</script>
<style>

</style>