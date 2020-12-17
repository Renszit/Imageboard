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
            lowestId: null,
            moreButton: true,
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
                formData.append("id", this.id);
                formData.append("username", this.username);
                formData.append("url", this.url);
                formData.append("description", this.description);
                axios.post("/upload", formData).then((res) => {
                    this.images.unshift(res.data);
                });
            },
            getMore: function (e) {
                e.preventDefault();
                var lowestId = this.images[this.images.length - 1].id;
                console.log(lowestId);
                var self = this;
                axios.get("/more/" + lowestId).then((response) => {
                    console.log(response.data.rows);
                    for (let i = 0; i < response.data.rows.length; i++) {
                        self.images.push(response.data.rows[i]);
                    }
                    console.log(lowestId);
                });
            },
        },
    });
})();
