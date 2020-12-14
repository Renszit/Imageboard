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

    // methods: {
    //     rensMethod: function (city) {
    //         // console.log("Rens's Method :)", city);
    //         // //change the value of the name on data
    //         // this.name = city;
    //     },
    // },
});
