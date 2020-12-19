(function () {
    Vue.component("addComments", {
        template: "#comtemplate",
        props: ["id"],
        data: function () {
            return { comments: {}, username: "", comment: "" };
        },
        mounted: function () {
            var self = this;
            axios
                .get("/comments/" + this.id)
                .then(function (response) {
                    // console.log(response.data);
                    self.comments = response.data;
                })
                .catch(function (err) {
                    console.log("err in mounted function comments", err);
                });
        },
        watch: {
            id: function () {
                console.log("imageId update");
                var self = this;
                axios
                    .get("/comments/" + this.id)
                    .then(function (response) {
                        // console.log(response.data);
                        self.comments = response.data;
                    })
                    .catch(function (err) {
                        console.log("err in mounted function comments", err);
                    });
            },
        },
        methods: {
            postcom: function (e) {
                console.log("comment upload!");
                e.preventDefault();
                const usercomment = {
                    username: this.username,
                    comment: this.comment,
                    id: this.id,
                };
                var self = this;
                // console.log("comment:" usercomment);
                axios
                    .post("/comments", usercomment)
                    .then(function (response) {
                        console.log(response.data);
                        self.comments.unshift(response.data);
                    })
                    .catch((err) => console.log("error in postreq", err));
            },
        },
    });

    Vue.component("imgComponent", {
        template: "#Template",
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
        watch: {
            id: function () {
                console.log("imageId update");
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
        },
        methods: {
            closeModal: function () {
                this.$emit("close");
                history.pushState({}, "", "/");
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
            imageId: location.hash.slice(1),
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
            addEventListener("hashchange", function () {
                self.imageId = location.hash.slice(1);
            });
        },

        methods: {
            handleFileChange: function (e) {
                this.image = e.target.files[0];
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
                    if (!response.data.rows[1]) {
                        self.moreButton = false;
                    }
                    console.log(lowestId);
                });
            },
        },
    });
})();
