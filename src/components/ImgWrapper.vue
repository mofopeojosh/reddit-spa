<template>
	<img :src="imageSrc" @error="replaceImage" class="img-fluid">
</template>

<script>
export default {
    name: 'ImgWrapper',
	props: {
        src: String,
	},
	data(){
        return {
            imageSrc: '',
			fallbackSrc: 'img/fallback-img.png'
		}
	},
	mounted() {
        this.imageSrc = this.src || this.fallbackSrc;
	},
	methods: {
        replaceImage() {
            this.imageSrc = this.fallbackSrc;
        },
	}
};
</script>

<style scoped>

</style>
