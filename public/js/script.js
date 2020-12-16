(function () {
    Vue.component("imgComponent", {
        template: "#comTemplate",
        props: ["id"],
        data: function () {
            return {
                image: {},
            };
        },
        mounted: function () {
            var self = this;
            axios
                .get(`/imageId/${this.id}`)
                .then(function (response) {
                    self.image = response.data;
                })
                .catch(function (err) {
                    console.log("error in component", err);
                });
        },
        methods: {
            closeModal: function () {
                this.$emit("close");
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            image: null,
            description: "",
            username: "",
            url: "",
            imageId: null,
        },

        mounted: function () {
            var self = this;
            axios
                .get("/images")
                .then(function (response) {
                    self.images = response.data;
                })
                .catch(function (error) {
                    console.log("error", error);
                });
        },

        methods: {
            handleFileChange: function (e) {
                this.image = e.target.files[0];
            },
            showModal: function (imageId) {
                // console.log("clicked!", imageId);
                this.imageId = imageId;
            },
            closeModal: function () {
                this.imageId = null;
            },
            upload: function (e) {
                e.preventDefault();
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("image", this.image);
                formData.append("username", this.username);
                formData.append("url", this.url);
                formData.append("description", this.description);
                axios.post("/upload", formData).then((res) => {
                    this.images.unshift(res.data);
                });
            },
        },
    });
})();
