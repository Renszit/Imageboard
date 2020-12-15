new Vue({
    el: "#main",
    data: {
        images: [],
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
});

new Vue({
    el: "#uploader",
    data: {
        title: "",
        image: null,
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

            axios.post("upload", formData).then(console.log);
        },
    },
});
