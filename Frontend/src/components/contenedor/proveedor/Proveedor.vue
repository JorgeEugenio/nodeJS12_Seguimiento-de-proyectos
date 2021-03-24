<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div>
				<Toast/>
				<Toolbar class="p-mb-4">
					<template v-slot:left>
						<Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
						<Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProveedores || !selectedProveedores.length" />
                        <Dropdown v-model="seleccionDistrito" :options="listaDistritos" optionLabel="value" optionValue="value" placeholder="Select One" required="true" v-on:change="getDistritosProgramas"></Dropdown>
                        <Dropdown v-model="seleccionPrograma" :options="listaProgramas" optionLabel="value" optionValue="value" placeholder="Select One" required="true" v-on:change="getProveedoresDistritoPrograma" :disabled="seleccionDistrito == 'Todos'"></Dropdown>
					</template>
					<template v-slot:right>
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="proveedores" v-model:selection="selectedProveedores" dataKey="_id" :paginator="true" :rows="10" :filters="filters"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
					<template #header>
						<div class="table-header">
							<h5 class="p-m-0">Administrar Proveedores</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<!-- <Column field="_id" header="_id" :sortable="true"></Column> -->
					<Column field="statusProveedor" header="Status" :sortable="true"></Column>
					<Column field="codigoProveedor" header="Codigo" :sortable="true"></Column>
                    <Column field="tipoProveedor" header="Descripcion" :sortable="true"></Column>
                    <Column field="nombreProveedor" header="Nombre" :sortable="true"></Column>
                    <Column field="empresaProveedor" header="Empresa" :sortable="true"></Column>
                    <Column field="direccionProveedor.distrito" header="Distrito" :sortable="true"></Column>
                    <Column field="direccionProveedor.programa" header="Programa" :sortable="true"></Column>
                    <Column field="telefonoProveedor" header="telefono" :sortable="true"></Column>
                    <Column field="codigoPagoProveedor" header="Codigo Pago" :sortable="true">
                        <template #body= slotProps>
                            <strong>{{slotProps.data.codigoPagoProveedor}}</strong>
                        </template>
                    </Column>
                    <Column field="detalleProveedor" header="Detalle" :sortable="true">
                        <template #body= slotProps>
                            <strong>{{slotProps.data.detalleProveedor}}</strong>
                        </template>
                    </Column>
                    <Column field="fechainstalacionProveedor"  header="Instalacion" :sortable="true" dateFormat="dd.mm.yy">
                            <template #body="slotProps">
                                {{formatoFecha(slotProps.data.fechainstalacionProveedor)}}
                            </template>
                    </Column>
					<Column field="responsableProveedor" header="Responsable" :sortable="true">
                        <template #body= slotProps>
                            <strong>{{slotProps.data.responsableProveedor}}</strong>
                        </template></Column>
					<Column>
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editProveedor(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteProveedor(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="proveedorDialog" :style="{width: '450px', height: '100%',background: 'white'}" :header="cambiarHeader" :modal="true" :class="cambiarColor">	

					<!-- <img :src="'assets/layout/images/product/' + product.image" :alt="product.image" class="product-image" v-if="product.image" /> -->
					<div class="p-field">
						<label for="statusProveedor">Status</label>
						<Dropdown id="statusProveedor" v-model="proveedor.statusProveedor" :options="estados" optionLabel="value" optionValue="text" placeholder="Select One" required="true" :class="{'p-invalid': submitted && !proveedor.statusProveedor}"></Dropdown>
					</div>
                    <template v-if="proveedor.codigoProveedor">
                        <div class="p-field">
                        <label for="codigoProveedor">Codigo Proveedor</label>
                        <InputText id="codigoProveedor" v-model.trim="proveedor.codigoProveedor" required="true" autofocus :class="{'p-invalid': submitted && !proveedor.codigoProveedor}"  :disabled="true"/>
                        <small class="p-invalid" v-if="submitted && !proveedor.codigoProveedor">El nombre del proveedor es requerido.</small>
                    </div>
                    </template>
                    <div class="p-field">
                        <label for="tipoProveedor">Tipo Proveedor</label>
                        <InputText id="tipoProveedor" v-model.trim="proveedor.tipoProveedor" required="true" autofocus :class="{'p-invalid': submitted && !proveedor.tipoProveedor}" />
                        <small class="p-invalid" v-if="submitted && !proveedor.tipoProveedor">El nombre del proveedor es requerido.</small>
                    </div>
                    <div class="p-field">
                        <label for="nombreProveedor">Nombre Proveedor</label>
                        <InputText id="nombreProveedor" v-model.trim="proveedor.nombreProveedor" required="true" autofocus :class="{'p-invalid': submitted && !proveedor.nombreProveedor}" />
                        <small class="p-invalid" v-if="submitted && !proveedor.nombreProveedor">El nombre del proveedor es requerido.</small>
                    </div>
                    <div class="p-field">
                        <label for="empresaProveedor">Empresa Proveedor</label>
                        <InputText id="empresaProveedor" v-model.trim="proveedor.empresaProveedor" required="true" autofocus :class="{'p-invalid': submitted && !proveedor.empresaProveedor}" />
                        <small class="p-invalid" v-if="submitted && !proveedor.empresaProveedor">El nombre del proveedor es requerido.</small>
                    </div>
                    <div class="p-field">
                        <label for="telefonoProveedor">Telefono Proveedor</label>
                        <InputText id="telefonoProveedor" v-model.trim="proveedor.telefonoProveedor" required="true" autofocus :class="{'p-invalid': submitted && !proveedor.telefonoProveedor}" />
                        <small class="p-invalid" v-if="submitted && !proveedor.telefonoProveedor">El nombre del proveedor es requerido.</small>
                    </div>
                    <div class="p-field">
                        <label for="codigoPagoProveedor">Codigo Pago</label>
                        <InputText id="codigoPagoProveedor" v-model.trim="proveedor.codigoPagoProveedor" required="true" autofocus :class="{'p-invalid': submitted && !proveedor.codigoPagoProveedor}" />
                        <small class="p-invalid" v-if="submitted && !proveedor.codigoPagoProveedor">El nombre del proveedor es requerido.</small>
                    </div>
                    <div class="p-field">
                        <label for="detalleProveedor">Detalle Proveedor</label>
                        <InputText id="detalleProveedor" v-model.trim="proveedor.detalleProveedor" required="true" autofocus :class="{'p-invalid': submitted && !proveedor.detalleProveedor}" />
                        <small class="p-invalid" v-if="submitted && !proveedor.detalleProveedor">El nombre del proveedor es requerido.</small>
                    </div>
                    <div class="p-field">
                        <label for="direccionProveedor.departamento">Departamento</label>
                        <InputText id="direccionProveedor.departamento" v-model.trim="proveedor.direccionProveedor.departamento" required="true" autofocus :class="{'p-invalid': submitted && !proveedor.direccionProveedor.departamento}" />
						<small class="p-invalid" v-if="submitted && !proveedor.direccionProveedor.departamento">La descripcion es requerida.</small>
                    </div>
                    <div class="p-field">
                        <label for="direccionProveedor.provincia">Provincia</label>
                        <InputText id="direccionProveedor.provincia" v-model.trim="proveedor.direccionProveedor.provincia" required="true" autofocus :class="{'p-invalid': submitted && !proveedor.direccionProveedor.provincia}" />
						<small class="p-invalid" v-if="submitted && !proveedor.direccionProveedor.provincia">La descripcion es requerida.</small>
                    </div>
                    <div class="p-field">
                        <label for="direccionProveedor.distrito">Distrito</label>
                        <InputText id="direccionProveedor.distrito" v-model.trim="proveedor.direccionProveedor.distrito" required="true" autofocus :class="{'p-invalid': submitted && !proveedor.direccionProveedor.distrito}" />
						<small class="p-invalid" v-if="submitted && !proveedor.direccionProveedor.distrito">La descripcion es requerida.</small>
                    </div>
                    <div class="p-field">
                        <label for="direccionProveedor.programa">Programa</label>
                        <InputText id="direccionProveedor.programa" v-model.trim="proveedor.direccionProveedor.programa" required="true" autofocus :class="{'p-invalid': submitted && !proveedor.direccionProveedor.programa}" />
						<small class="p-invalid" v-if="submitted && !proveedor.direccionProveedor.programa">La descripcion es requerida.</small>
                    </div>
                    <div class="p-field">
                        <label for="direccionProveedor.mzlt">Mz-Lt</label>
                        <InputText id="direccionProveedor.mzlt" v-model.trim="proveedor.direccionProveedor.mzlt" required="true" autofocus :class="{'p-invalid': submitted && !proveedor.direccionProveedor.mzlt}" />
						<small class="p-invalid" v-if="submitted && !proveedor.direccionProveedor.mzlt">La descripcion es requerida.</small>
                    </div>
                    <div class="p-field">
                        <label for="datetemplate">fecha Vcto Proveedor</label>
                        <Calendar id="datetemplate" v-model="proveedor.fechainstalacionProveedor" required="true">
                            <template #date="slotProps">
                                <template>{{slotProps.date.day}}</template>
                            </template>
                        </Calendar>
                    </div>
                    <div class="p-field">
                        <label for="responsableProveedor">Responsable</label>
                        <InputText id="responsableProveedor" v-model.trim="proveedor.responsableProveedor" required="true" autofocus :class="{'p-invalid': submitted && !proveedor.responsableProveedor}" />
                        <small class="p-invalid" v-if="submitted && !proveedor.responsableProveedor">El nombre del proveedor es requerido.</small>
                    </div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProveedor" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteProveedorDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="proveedor">Are you sure you want to delete <b>{{proveedor.name}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProveedorDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProveedor(proveedor)" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteProveedoresDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="proveedor">Are you sure you want to delete the selected products?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProveedoresDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProveedores" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import axios from 'axios';
class Proveedor {
  constructor( statusProveedor = '', codigoProveedor = '', tipoProveedor = '', nombreProveedor = '', empresaProveedor = '', telefonoProveedor = '', 
  codigoPagoProveedor = '', detalleProveedor = '', fechainstalacionProveedor= '', direccionProveedor = {departamento : '',provincia : '',distrito : '',programa : '',mzlt : ''}, responsableProveedor = '') {
      
    this.statusProveedor = statusProveedor;
    this.codigoProveedor = codigoProveedor;
    this.tipoProveedor = tipoProveedor;
    this.nombreProveedor = nombreProveedor;
    this.empresaProveedor = empresaProveedor;
    this.telefonoProveedor = telefonoProveedor;
    this.codigoPagoProveedor = codigoPagoProveedor;
    this.detalleProveedor = detalleProveedor;
    this.fechainstalacionProveedor = fechainstalacionProveedor;
    this.direccionProveedor = direccionProveedor;
    this.responsableProveedor = responsableProveedor;
    
  }
}

export default {
	data() {
		return {
			status:null,
			estados: [
				{ value: 'Activo', text: 'Activo' },
				{ value: 'Inactivo', text: 'Inactivo' }
			],
            fechainstalacionProveedor: null,
			proveedor: new Proveedor(),//usar
			proveedores: [],
			proveedorDialog: false,//usar
			nuevo: false,
			deleteProveedorDialog: false,
			deleteProveedoresDialog: false,
			selectedProveedor: null,
			selectedProveedores: null,
			filters: {},
			submitted: false,
            seleccionProveedor : null,
            listaDistritos: [],
            listaProgramas: [],

            seleccionDistrito: 'Todos',
            seleccionPrograma: null,
            maxCodigoProveedor: 0


		}
	},
	created() {
		//this.getProveedores()
        
        //console.log(this.listaDistritos);
	},
	mounted() {
        this.Inicializar()
		this.getDistritos()
	},
	methods: {
        async Inicializar(){
              await  this.getProveedores()
        },
        formatoFecha(valor){
            return valor.substr(0,10)
        },
		async getProveedores(){
			await axios.get('http://localhost:8000/v1/proveedor')
                .then(data => {
                    this.proveedores = data.data
                })
		},
        async getDistritos(){
            await axios.get('http://localhost:8000/v1/proveedorlistadistritos')
                .then(data => {
                    this.listaDistritos = data.data
                })
        },
        async getDistritosProgramas(){
            if (this.seleccionDistrito == 'Todos') {
                this.getProveedores()
            }else if(this.seleccionDistrito != null){
                await axios.get('http://localhost:8000/v1/proveedorlistaprogramas/'+this.seleccionDistrito)
                    .then(data => {
                        this.listaProgramas = data.data
                    })
                await axios.get('http://localhost:8000/v1/proveedordetalle/'+this.seleccionDistrito)
                    .then(data => {
                        this.proveedores = data.data
                    })
            }
            this.seleccionPrograma = null
		},
        async getProveedoresDistritoPrograma(){
            await axios.get('http://localhost:8000/v1/proveedordetalle/'+this.seleccionDistrito+'/'+ this.seleccionPrograma)
                .then(data => {
                    this.proveedores = data.data
                })
        },
        async getCodigoProveedorMax(){
            await axios.get('http://localhost:8000/v1/proveedorcodigomax/')
                .then(data => {
                    this.maxCodigoProveedor = data.data
                    this.proveedor.codigoProveedor = parseInt(this.maxCodigoProveedor) +1
                })
        },
		openNew() {
			this.proveedor = new Proveedor();
			this.proveedorDialog = true
			
			this.submitted = false;
			this.nuevo = false
            this.proveedor.statusProveedor = 'Activo'
            this.getCodigoProveedorMax()
		},
		hideDialog() {
			this.proveedorDialog = false;
			this.submitted = false;
		},
		editProveedor(proveedor){
			this.nuevo = true
			this.proveedorDialog = true
			this.proveedor = proveedor
			//console.log(this.proveedor);
		},
		async saveProveedor() {//-------------------------------------------------------------
            this.submitted = true
			const validacion =  !this.proveedor.statusProveedor == '' && 
								!this.proveedor.codigoProveedor == '' && 
                                !this.proveedor.tipoProveedor == '' && 
                                !this.proveedor.nombreProveedor == '' && 
                                !this.proveedor.empresaProveedor == '' && 
                                !this.proveedor.telefonoProveedor == '' && 
                                !this.proveedor.codigoPagoProveedor == '' && 
                                !this.proveedor.detalleProveedor == '' && 
                                !this.proveedor.fechainstalacionProveedor == '' &&
                                !this.proveedor.direccionProveedor.departamento == '' &&
                                !this.proveedor.direccionProveedor.provincia == '' &&
                                !this.proveedor.direccionProveedor.distrito == '' &&
                                !this.proveedor.direccionProveedor.programa == '' &&
								!this.proveedor.direccionProveedor.mzlt == ''  &&
                                !this.proveedor.responsableProveedor == ''  
            
            if (validacion) {
                if(!this.nuevo === true) {
                    await axios.post('http://localhost:8000/v1/proveedor', this.proveedor)
                        .then(() => {
                            this.getProveedores()
                            this.proveedor = new Proveedor();
                            this.proveedorDialog = false
                        });
                        console.log('estoy en save-if-if-validacion');
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});		
                }else {
                    this.getProveedor(this.proveedor)
                    await axios.put('http://localhost:8000/v1/proveedor/' + this.proveedor._id, this.proveedor)
                        .then(() => {
                            this.getProveedores();
                            this.proveedor = new Proveedor();
                            this.proveedorDialog = false
                        });
                        console.log('estoy en save-if-else-validacion');
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
                }
            }else{
                this.proveedorDialog = true
                console.log('estoy en save-else-validacion');
            }
		},
		async getProveedor(proveedor) {
			this.nuevo = true
			await axios.get('http://localhost:8000/v1/proveedor/' + proveedor._id)
				.then(data => {
				const { statusProveedor, codigoProveedor, tipoProveedor, nombreProveedor, empresaProveedor, telefonoProveedor, codigoPagoProveedor, detalleProveedor, fechainstalacionProveedor, direccionProveedor, responsableProveedor } = data;
				this.proveedor = new Proveedor(statusProveedor, codigoProveedor, tipoProveedor, nombreProveedor, empresaProveedor, telefonoProveedor, codigoPagoProveedor, detalleProveedor, fechainstalacionProveedor, direccionProveedor, responsableProveedor );
				this.proveedorDialog = true
				});
		},
		async deleteProveedor() {
			await axios.delete('http://localhost:8000/v1/proveedor/' + this.proveedor._id)
				.then(() => {
				this.getProveedores();
				this.proveedor = new Proveedor();
				});
				this.deleteProveedorDialog = false
				this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
		},
		confirmDeleteProveedor(proveedor) {
			this.proveedor = proveedor;
			this.deleteProveedorDialog = true;
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		confirmDeleteSelected() {
			this.deleteProveedoresDialog = true;
		},
		deleteSelectedProveedores() {
			for (let step = 0; step < this.selectedProveedores.length; step++) {
				fetch('http://localhost:8000/v1/proveedor/' + this.selectedProveedores[step]._id, {
					method: 'DELETE',
					headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
					}
					})
					.then(res => res.json())
					this.getProveedores();
			}
			this.deleteProveedoresDialog = false;
			this.selectedProveedores = null;
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
		},
		deleteSelectedProducts() {
			this.products = this.products.filter(val => !this.selectedProducts.includes(val));
			this.deleteProductsDialog = false;
			this.selectedProducts = null;
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
		}
	}, computed:{
		cambiarHeader(){
			return this.nuevo ? 'Editar' : 'Nuevo'
		},
		cambiarColor(){
			return this.nuevo ? 'p-fluid' : 'p-fluid'
		}
	}
}
</script>

<style scoped lang="scss">
.table-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.proveedor-image {
	width: 100px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .proveedor-image {
	width: 150px;
	margin: 0 auto 2rem auto;
	display: block;
}

.confirmation-content {
	display: flex;
	align-items: center;
	justify-content: center;
}

.proveedor-badge {
	border-radius: 2px;
	padding: .25em .5rem;
	text-transform: uppercase;
	font-weight: 700;
	font-size: 12px;
	letter-spacing: .3px;

	&.status-instock {
		background: #C8E6C9;
		color: #256029;
	}

	&.status-outofstock {
		background: #FFCDD2;
		color: #C63737;
	}

	&.status-lowstock {
		background: #FEEDAF;
		color: #8A5340;
	}
}
</style>
