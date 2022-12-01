function iniciarMiPagina() {

    const seleccionarCategorias = document.getElementById("categorias")
    const resultadoFor = document.getElementById("resultadosFor")
    // const resultado = document.getElementById("resultados")
    const modalRecetas = document.getElementById("modaRecetas")


    if (seleccionarCategorias) {

        seleccionarCategorias.addEventListener(`change`, elegirCategorias)
        obtenerCategoria()
    }

    const favoritosDiv = document.querySelector(`.favoritos`)
    if (favoritosDiv) {
        obtenerFavoritos();
    }







    //USO DE API PARA LAS CATEGORIAS   
    function obtenerCategoria() {
        fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
            .then((res) => res.json())
            .then((data) => {
                //uso data.categoris para acceder a las categories
                mostrarCategoriasDom(data.categories)
            })
    }

    function mostrarCategoriasDom(categorias = []) { // paso un array por parametro para que todas las categorias se guarden en el array


        categorias.forEach(categoria => {
            const selecionarOpcion = document.createElement("option")
            selecionarOpcion.value = categoria.strCategory // muestro el valor de cada categoria
            selecionarOpcion.textContent = categoria.strCategory // muestro el nombre del valor en el Dom
            seleccionarCategorias.appendChild(selecionarOpcion)

        })


    }



    function elegirCategorias(e) {





        console.log(e.target.value)

        const categoria = e.target.value //  de esta forma creo una variable para el valor de cada cada categoria

        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`
        fetch(url) //accedo a la api de catada categoria
            .then((res) => res.json())
            .then((data) => { // data ahora tiene todos los alimentos
                mostrarRecetas(data.meals)

            })
    }

    function mostrarRecetas(recetas = []) { //hago array de data

        // let comprobarResultado = document.getElementById("tituloMuestra")
        // comprobarResultado.innerHTML = recetas.length ? `SE ENCONTRARON RESULTADOS` : `NO SE ENCONTRO NADA` // si en algun momento la api no funciona va a mostrar no se econtro nada

        resultadoFor.innerHTML = ""
        for (let rec of recetas) {
            let cartaRecetas = document.createElement("div")
            cartaRecetas.innerHTML = `<div  class="card" style="width: 18rem;">
                <img src="${rec.strMealThumb ?? rec.img}" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">${rec.strMeal ?? rec.titulo }</h5>
                <p class="card-text"></p>
                <button id="btn__${rec.idMeal??rec.id}" class="btn btn-primary " data-bs-target="#modal" data-bs-toggle="modal">mostrar informacion</button>
                </div>
                </div>`





            resultadoFor.appendChild(cartaRecetas)



            // extraigo los datos de recetas en forma de variable en caso de ser necesario


            let botonRecetas = document.getElementById(`btn__${rec.idMeal ?? rec.id}`);
            // botonRecetas.addEventListener(`click`, selecionarReceta(idMeal)) // de esta forma me tira todos los resultados juntos en forma de objetos cuando seleciono la categoria 

            botonRecetas.onclick = function () { // de esta forma espera a que haga click en el boton y luego ejecuta la funcion
                selecionarReceta(rec.idMeal ?? rec.id)
            }





            function selecionarReceta(id) {

                const urlId = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`
                fetch(urlId)
                    .then((res) => res.json())
                    .then((data) => mostrarRecetaModal(data.meals[0]))
            }

            function mostrarRecetaModal(receta) {


                const {
                    idMeal,
                    strInstructions,
                    strMeal,
                    strMealThumb
                } = receta;

                // Añadir contenido al modal
                const modalTitle = document.querySelector('.modal .modal-title');
                const modalBody = document.querySelector('.modal .modal-body');

                modalTitle.textContent = strMeal;
                modalBody.innerHTML = `
                        <img class="img-fluid img_modal" src="${strMealThumb}" alt="receta ${strMeal}" />
                        <h3 class="my-3">Instrucciones</h3>
                        <p>${strInstructions}</p>
                        <h3 class="my-3">Ingredientes y Cantidades</h3>
                    `;

                const listGroup = document.createElement('UL');
                // Mostrar cantidades e ingredientes
                for (let i = 1; i <= 20; i++) {
                    if (receta[`strIngredient${i}`]) {


                        const ingrediente = receta[`strIngredient${i}`];
                        const cantidad = receta[`strMeasure${i}`];

                        const ingredienteLi = document.createElement('LI');
                        ingredienteLi.classList.add('list-group-item');
                        ingredienteLi.textContent = `${ingrediente} - ${cantidad}`

                        listGroup.appendChild(ingredienteLi);
                    }
                }

                modalBody.appendChild(listGroup);



                const btnsModal = document.getElementById("btnsModalBody")
                btnsModal.innerHTML = ` <button id="btnG" type="button" class="btn btn-danger col">${comprobarSiExiste(idMeal)? "Eliimar De Favoritos" : "Guardar Favoritos"}</button>
                    <button type="button" class="btn btn-secondary col" data-bs-dismiss="modal">Cerrar</button>`




                // almacenar en el storage


                const btnGuardar = document.getElementById(`btnG`)
                btnGuardar.onclick = function () {
                    if (comprobarSiExiste(idMeal)) {
                        eleminarFavorito(idMeal)
                        btnGuardar.textContent = "Guardar Favoritos" // si ya existe mi la receta en elementos va a cambiar el contenido del texto a Guardar Favoritos
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            showConfirmButton: false,
                            timer: 1000
                        })
                        return
                    } else {
                        btnGuardar.textContent = "Eliimar De Favoritos" // si no existe en el storage va a cambiar el contenido del texto a Eliimar De Favoritos
                        Swal.fire({
                            icon: 'success',
                            title: 'Guardado',
                            showConfirmButton: false,
                            timer: 1000
                        })


                    }

                    agregarFavarotito({
                        id: idMeal,
                        titulo: strMeal,
                        img: strMealThumb
                    })




                }










            }

        }

    }












    function agregarFavarotito(receta) {
        console.log(receta)
        const favoritos = JSON.parse(localStorage.getItem(`favoritos`)) ?? [] // en caso de que no exista me va a devolver un array vacio
        localStorage.setItem(`favoritos`, JSON.stringify([...favoritos, receta]))

    }

    function eleminarFavorito(id) {
        const favoritos = JSON.parse(localStorage.getItem(`favoritos`)) ?? []
        const nuevosFavoritos = favoritos.filter(favoritos => favoritos.id !== id)
        localStorage.setItem(`favoritos`, JSON.stringify(nuevosFavoritos))
    }

    function comprobarSiExiste(id) {
        const favoritos = JSON.parse(localStorage.getItem(`favoritos`)) ?? []
        return favoritos.some(favoritos => favoritos.id === id) // esta parte de evitar que se duplique en el localStorague me ayude muchisimo de stackOverflow
    }

    function obtenerFavoritos() {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? []
        if (favoritos.length) {
            mostrarRecetas(favoritos);
            return
        }
        const favoritosVacio = document.createElement("p")
        favoritosVacio.textContent = `no hay favoritos agregados`
        favoritosDiv.appendChild(favoritosVacio)
    }








}


modoOscuro()
// El evento DOMContentLoaded, se ejecuta cuando se ha cargado por completo el contenido del DOM 
document.addEventListener(`DOMContentLoaded`, iniciarMiPagina)