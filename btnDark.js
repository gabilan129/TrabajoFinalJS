function modoOscuro() {


    //TODO DARK MODE
    let btnDarkMode = document.getElementById("botonDarkMode")
    let btnLightMode = document.getElementById('botonLightMode')





    let modoOscuro



    if (localStorage.getItem("modoOscuro")) {
        modoOscuro = localStorage.getItem("modoOscuro")
    } else {
        console.log("Entro por primera vez")
        localStorage.setItem("modoOscuro", true)
        modoOscuro = "true"
    }
    console.log(modoOscuro)

    if (modoOscuro == "true") {
        document.body.classList.add("darkMode")
    } else {
        document.body.classList.remove("darkMode")
    }
    
    btnDarkMode.addEventListener("click", () => {
        document.body.classList.add("darkMode")
        localStorage.setItem("modoOscuro", true)

    })
    btnLightMode.addEventListener("click", () => {
        document.body.classList.remove("darkMode")
        localStorage.setItem("modoOscuro", false)
    })

}