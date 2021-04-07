<template>
    <div class="p-grid crud-demo">
		<div class="p-col-12">
			<div>
				<Toast/>
				<DataTable ref="dt" :value="datalistaprojectsdetalle" dataKey="_id" :paginator="true" :rows="20" :filters="filters"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" :rowsPerPageOptions="[23,24,48]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
					<template #header>
						<div class="table-header">
							<h5 class="p-m-0">Detalles del Boleta</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>
					<Column field="_id" header="codigo Projecto" :sortable="true"></Column>
                    <Column field="fechaAvance" header="Avance" :sortable="true"></Column>
					<Column field="tipoRecurso" header="Tipo recurso" :sortable="true"></Column>
					<Column field="urlRecurso" header="Link" :sortable="true">
                    </Column>
					<Column>
						<template #body="slotProps">
							<Button label="Detalles" icon="pi pi-bars" class="p-button-rounded p-button-success p-mr-2" @click="editBoletaDetalle(slotProps.data)" />
							<Button label="Eliminar" icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteSector(slotProps.data)" />
						</template>
					</Column>
				</DataTable>
            </div>
        </div>
    </div>
</template>

<script>
//import Project from './Project'
export default {
    components:{
    },
    props:{
        datalistaprojectsdetalle: Object

    },
    data() {
        return {
            filters: {},

        }

    },
    created(){
        //console.log('------------------------');
        //console.log(this.datalistaprojectsdetalle);
    },
    mounted(){
        
    },
    updated(){

    },
    methods:{

    },
    computed:{

    }

}
</script>

<style scoped>

</style>