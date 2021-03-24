<template>
    <div class="p-col-6" >
        <div>
            <Toast/>
            <Toolbar class="p-mb-4">
					<template v-slot:left>
						<Button label="New" icon="pi pi-plus" class="p-button-rounded p-button-success p-mr-2 p-mb-2" @click="openNew"/>
						<Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedCelulares || !selectedCelulares.length" />
					</template>

					<template v-slot:right>
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>
            <DataTable ref="dt" :value="celulares" v-model:selection="selectedCelulares" dataKey="_id" :paginator="true" :rows="15" :filters="filters"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" :rowsPerPageOptions="[15,75,100]"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
                <Column selectionMode="multiple" headerStyle="width: 3rem" ></Column>
                <Column field="whatsapp" header="whtspp" :sortable="true" style="text-align: center;">
					<template #body="slotProps" >
						<div class="table-center">
							<span :class="'whtspp status-'+ slotProps.data.whatsapp">{{slotProps.data.whatsapp}}</span>
						</div>
					</template>
				</Column>
                <Column header="whtsppLnk" :sortable="true">
					<template #body="slotProps" class="centered-input text--darken-3 mt-3">
						<div class="table-header">
							<a :href="'https://wa.me/51'+ slotProps.data.numeroCelular">{{slotProps.data.numeroCelular}}</a>
						</div>
					</template>
				</Column>
                <Column field="estadoCelular" header="estado" :sortable="true">
					<template #body="slotProps">
						<div class="table-center">
							<span :class="'celular-badge status-' + slotProps.data.estadoCelular">{{ slotProps.data.estadoCelular}}</span>
						</div>
					</template>
				</Column>
                <Column field="parentezco" header="Parentezco" :sortable="true" >
					<template #body="slotProps">
						<div class="table-center">
							<span>{{ slotProps.data.parentezco}}</span>
						</div>
					</template>
				</Column>
                <Column field="detalles" header="Detalles" :sortable="true"></Column>
                <Column>
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editCelular(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteCelular(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
			<Dialog v-model:visible="celularDialog" :style="{width: '450px'}" :header="cambiarHeader" :modal="true" :class="cambiarColor">	

					<!-- <img :src="'assets/layout/images/product/' + product.image" :alt="product.image" class="product-image" v-if="product.image" /> -->
					<div class="p-field">
						<label for="whatsapp">whtspp</label>
						<Dropdown id="whatsapp" v-model="celular.whatsapp" :options="opcionSiNo" optionLabel="value" optionValue="text" placeholder="Select One" required="true" :class="{'p-invalid': submitted && !celular.whatsapp}"></Dropdown>
					</div>
					<div class="p-field">
						<label for="estadoCelular">Status Celular</label>
						<Dropdown id="estadoCelular" v-model="celular.estadoCelular" :options="estados" optionLabel="value" optionValue="text" placeholder="Select One" required="true" :class="{'p-invalid': submitted && !celular.estadoCelular}"></Dropdown>
					</div>
                    <div class="p-field">
                        <label for="numeroCelular">Numero Celular</label>
                        <InputText id="numeroCelular" v-model.trim="celular.numeroCelular" required="true" autofocus :class="{'p-invalid': submitted && !celular.numeroCelular}" />
                        <small class="p-invalid" v-if="submitted && !celular.numeroCelular">El numero celular es requeridoes requerido.</small>
                    </div>
                    <div class="p-field">
                        <label for="parentezco">Parentezco</label>
                        <InputText id="parentezco" v-model.trim="celular.parentezco" required="true" autofocus :class="{'p-invalid': submitted && !celular.parentezco}" />
						<small class="p-invalid" v-if="submitted && !celular.parentezco">El parentezco es requerida.</small>
                    </div>
                    <div class="p-field">
                        <label for="detalles">Detalles</label>
                        <InputText id="detalles" v-model.trim="celular.detalles" required="true" autofocus :class="{'p-invalid': submitted && !celular.detalles}" />
						<small class="p-invalid" v-if="submitted && !celular.detalles">La descripcion es requerida.</small>
                    </div>
                    
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveCelular" />
					</template>
				</Dialog>
				<Dialog v-model:visible="deleteCelularDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="celular">Are you sure you want to delete <b>{{celular.numeroCelular}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteCelularDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteCelular(celular)" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteCelularesDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="celular">Are you sure you want to delete the selected celulares?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteCelularesDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedCelulares" />
					</template>
				</Dialog>
        </div>
    </div>
</template>
<script>
class Celular {
  constructor( numeroCelular = '',whatsapp = '',estadoCelular = '',parentezco = '',detalles = '',idCliente = '') {

    this.numeroCelular = numeroCelular;
	this.whatsapp = whatsapp;
    this.estadoCelular = estadoCelular;
    this.parentezco = parentezco;
    this.detalles = detalles;
    this.idCliente = idCliente;

  }
}
import axios from 'axios';
export default {
    name:'Detalle2',
	props:{
		lista: Object
	},
	data() {
		return {
			estados: [
				{ value: 'Activo', text: 'Activo' },
				{ value: 'Inactivo', text: 'Inactivo' }
			],
			opcionSiNo: [
				{ value: 'Si', text: 'Si' },
				{ value: 'No', text: 'No' }
			],
			deleteCelularesDialog: false,
			deleteCelularDialog: false,
			celularDialog: false,
			submitted: false,
			nuevo: false,
            celular: new Celular(),
			selectedCelulares: null,//EN USO
			filters: {},

            celulares: [],
		}
	},
	created() {
        
	},
	mounted() {
		this.mostrarDetalleCliente();
	},
	updated(){

	},
	methods: {
		formatCurrency(value) {
			return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
		},
		async mostrarDetalleCliente(){
			if (this.lista[0] === undefined) {
				//console.log('esta indefinido, no muestres nada');
			}else if(this.lista.length == 1){
				await this.getCelular()
			}
			else{
				//console.log('hay mas de un valor');
			}
		},
		async getCelular(){//SE QUEDA
			await axios.get('http://localhost:8000/v1/celularxcliente/' + this.lista[0]._id)
			.then(data => {
				this.celulares = data.data
				//console.log(this.celulares);
			})
		},
		openNew() {
			this.celular = new Celular()
			this.celularDialog = true
			
			this.submitted = false;
			this.nuevo = false;
		},
		hideDialog() {
			this.celularDialog = false;
			this.submitted = false;
		},
		editCelular(celular){
            this.celular = celular
			this.nuevo = true
			this.celularDialog = true
		},
		saveCelular() {//-------------------------------------------------------------
			this.submitted = true
			const validacion =  !this.celular.whatsapp == '' && 
								!this.celular.estadoCelular == '' && 
                                !this.celular.parentezco == '' &&
                                !this.celular.detalles == ''


			this.celular.idCliente = this.lista[0]._id

			if (validacion) {
                if(!this.nuevo === true) {
                    fetch('http://localhost:8000/v1/celular', {
                    method: 'POST',
                    body: JSON.stringify(this.celular),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                    })
                    .then(res => res.json())
                    .then(() => {
                        this.getCelular()
                        this.celular = new Celular();
                        this.celularDialog = false
					
					});
					//console.log('estoy en post');
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});		
                }else {
                    fetch('http://localhost:8000/v1/celular/' + this.celular._id, {
                    method: 'PUT',
                    body: JSON.stringify(this.celular),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                    })
                    .then(res => res.json())
                    .then(() => {
                        this.getCelular();
                        this.celularDialog = false
					});
					//console.log('estoy en put');
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
                }
            }else{
				//console.log('estoy en else ');
                this.celularDialog = true
            }
		},
		deleteCelular() {
			fetch('http://localhost:8000/v1/celular/' + this.celular._id, {
				method: 'DELETE',
				headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
				}
				})
				.then(res => res.json())
				.then(() => {
				this.getCelular();
				this.celular = new Celular();
				});
				this.deleteCelularDialog = false
				this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
		},
		confirmDeleteCelular(celular) {//SE QUEDA
			this.celular = celular;
			this.deleteCelularDialog = true;
		},
		deleteSelectedCelulares() {//SE QUEDA
			for (let step = 0; step < this.selectedCelulares.length; step++) {
				fetch('http://localhost:8000/v1/celular/' + this.selectedCelulares[step]._id, {
					method: 'DELETE',
					headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
					}
					})
					.then(res => res.json())
					this.getCelular();
			}
			this.deleteCelularesDialog = false;
			this.selectedCelulares = null;
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Celulares Deleted', life: 3000});
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		confirmDeleteSelected() {
			this.deleteCelularesDialog = true;
		},

	},
	computed:{
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
.table-center{
	text-align: center;
}
.celular-image {
	width: 100px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .celular-image {
	width: 150px;
	margin: 0 auto 2rem auto;
	display: block;
}

.confirmation-content {
	display: flex;
	align-items: center;
	justify-content: center;
}

.celular-badge {
	border-radius: 2px;
	padding: .25em .5rem;
	text-transform: uppercase;
	font-weight: 700;
	font-size: 12px;
	letter-spacing: .3px;

	&.status-Activo{
		background: #C8E6C9;
		color: #256029;
	}

	&.status-Inactivo {
		background: #FFCDD2;
		color: #C63737;
	}

	&.status-Pendiente {
		background: #FEEDAF;
		color: #8A5340;
	}
}

.whtspp {
	border-radius: 2px;
	padding: .25em .5rem;
	text-transform: uppercase;
	font-weight: 700;
	font-size: 12px;
	letter-spacing: .3px;

	&.status-Si {
		background: #C8E6C9;
		color: #256029;
	}

	&.status-No {
		background: #FFCDD2;
		color: #C63737;
	}
}
</style>
