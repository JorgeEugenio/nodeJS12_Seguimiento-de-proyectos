<template>
	<div class="p-grid">

        <div class="p-col-12">
			<div class="card">
				<h5>Account Page</h5>
				<p>Pagina en mantenimiento</p>
			</div>
		</div>
<!--         <div class="p-col-12 p-md-10">
			<div class="card p-fluid">
				<h5>Vertical</h5>
				<div class="p-field">
					<label for="nombres">Nombres</label>
					<InputText id="nombres" type="text" :value="nombres"/>
				</div>
				<div class="p-field">
					<label for="apellidos">Apellidos</label>
					<InputText id="apellidos" type="email" :value="apellidos"/>
				</div>
				<div class="p-field">
					<label for="email">Email</label>
					<InputText id="email" type="text" :value="email"/>
				</div>
			</div>
		</div>

        <div class="p-col-12 p-md-2">
			<div class="card p-fluid">
				<h5>Foto Perfil</h5>
				<div class="p-formgrid p-grid">
                    
                    <div class="p-field p-col">
						<img :src="'http://localhost:8110/public/Amy.png'" class="product-image" />
					</div>
					
				</div>
			</div>
		</div> -->
	</div>
</template>

<script>
export default {
    props:{
        data: Object
    },
    data() {
        return {
            nombres: null,
            apellidos: null,
            imgUrl: null,
            email: null,
            checked: false
        }
    },
    created(){

    },
    methods:{
        ejecutar(){
            this.nombres = this.checked
        },
        onUpload() {
			this.$toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
		}
    },
    computed:{
        imagen(){
            return this.checked ? 'p-field p-col-12 p-md-1': ''
        }
    }

}
</script>

<style scoped>
.product-image {
	width: 208px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
</style>
