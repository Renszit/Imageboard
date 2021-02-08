(function () {
    Vue.component("addComments", {
        template: "#comtemplate",
        props: ["id"],
        data: function () {
            return {
                comments: [],
                username: "",
                comment: "",
                created_at: "",
            };
        },
        mounted: function () {
            var self = this;
            axios
                .get("/comments/" + this.id)
                .then(function (response) {
                    self.comments = response.data;
                })
                .catch(function (err) {
                    console.log("err in mounted function comments", err);
                });
        },
        watch: {
            id: function () {
                var self = this;
                axios
                    .get("/comments/" + this.id)
                    .then((res) => {
                        self.comments = res.data;
                    })
                    .catch(function (err) {
                        console.log("err in mounted function comments", err);
                    });
            },
        },
        filters: {
            date: function (str) {
                if (!str) {
                    return "(n/a)";
                }
                str = new Date(str);
                return (
                    (str.getDate() < 10 ? "0" : "") +
                    str.getDate() +
                    "-" +
                    (str.getMonth() < 9 ? "0" : "") +
                    (str.getMonth() + 1) +
                    "-" +
                    str.getFullYear()
                );
            },
        },
        methods: {
            postcom: function (e) {
                console.log("comment upload!");
                var self = this;
                e.preventDefault();
                var usercomment = {
                    username: this.username,
                    comment: this.comment,
                    id: this.id,
                };
                // console.log("comment:" usercomment);
                axios
                    .post("/comments", usercomment)
                    .then((res) => {
                        console.log(res.data);
                        self.comments.unshift(res.data[0]);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
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
                        if (response.data) {
                            self.image = response.data;
                        } else {
                            self.$emit("close");
                            history.pushState({}, "", "/");
                        }
                    })
                    .catch(function (err) {
                        console.log("error in component", err);
                    });
            },
        },
        filters: {
            date: function (str) {
                if (!str) {
                    return "(n/a)";
                }
                str = new Date(str);
                return (
                    (str.getDate() < 10 ? "0" : "") +
                    str.getDate() +
                    "-" +
                    (str.getMonth() < 9 ? "0" : "") +
                    (str.getMonth() + 1) +
                    "-" +
                    str.getFullYear()
                );
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
                // console.log(lowestId);
                var self = this;
                axios.get("/more/" + lowestId).then((response) => {
                    // console.log(response.data.rows);
                    for (let i = 0; i < response.data.rows.length; i++) {
                        self.images.push(response.data.rows[i]);
                    }
                    if (!response.data.rows[1]) {
                        self.moreButton = false;
                    }
                    // console.log(lowestId);
                });
            },
        },
    });
})();
