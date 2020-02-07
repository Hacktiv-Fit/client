
function nutritionixInputShow () {
    $('#nutritionix-input').show()
}

function nutritionixInput() {
    const token = localStorage.token
    const query = $('#nQuery').val()
    const gender = $('#nGender').val()
    const weight_kg = $('#nWeight').val()
    const height_cm = $('#nHeight').val()
    const age = $('#nAge').val()
    console.log(query, gender, weight_kg, height_cm, age, 'INPUT =========')
    $.ajax('http://localhost:3000/nutritionix/excercise', {
        method: 'POST',
        headers: { token },
        data: { query, gender, weight_kg, height_cm, age }
    })
    .done(({ data }) => {
        console.log(data)
    })
    .fail(err => {
        console.log(err)
    })
}

function nutritionix() {
    $('#nutritionix-input').on("submit", (e) => {
        e.preventDefault()
    const token = localStorage.token
    const query = $('#nQuery').val()
    const gender = $('#nGender').val()
    const weight_kg = $('#nWeight').val()
    const height_cm = $('#nHeight').val()
    const age = $('#nAge').val()
    console.log(query, gender, weight_kg, height_cm, age, 'INPUT =========')
    // $.ajax('http://localhost:3000/nutritionix/excercise', {
    //     method: 'POST',
    //     headers: { token },
    //     data: { query, gender, weight_kg, height_cm, age }
    // })
    // .done(({ data }) => {
    //     console.log(data)
    // })
    // .fail(err => {
    //     console.log(err)
    // })
    })
}

$(document).ready(function(){
    nutritionix()
    nutritionixInput()
});