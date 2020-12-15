new Vue({
    el: "#main",
    data: {
        images: [],
        title: "",
        image: null,
        username: "",
        url: "",
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
        upload: function (e) {
            e.preventDefault();
            var formData = new FormData();
            formData.append("title", this.title);
            formData.append("image", this.image);
            formData.append("username", this.username);
            formData.append("url", this.url);
            axios.post("/upload", formData).then((res) => {
                this.images.unshift(res.data);
            });
        },
    },
});
